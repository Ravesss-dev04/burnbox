import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth-utils';
import { getCorsHeaders } from '@/lib/corsHeaders';

const QUOTATION_NOTIFICATION_TYPE = 'QUOTATION_SUBMITTED';

interface AuthenticatedUser {
  id: number;
  role: string;
  position: string | null;
}

interface NotificationRow {
  id: number;
  type: string;
  message: string;
  relatedId: string | null;
  isRead: number | boolean;
  createdAt: Date;
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  const headers = getCorsHeaders(request.headers.get('origin'));

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    }

    if (!canViewQuotationNotifications(user)) {
      return NextResponse.json({ notifications: [], unreadCount: 0 }, { headers });
    }

    await ensureNotificationTable();

    const notifications = await prisma.$queryRaw<NotificationRow[]>`
      SELECT
        id,
        type,
        message,
        related_id AS relatedId,
        is_read AS isRead,
        created_at AS createdAt
      FROM notifications
      WHERE user_id = ${user.id}
        AND type = ${QUOTATION_NOTIFICATION_TYPE}
      ORDER BY created_at DESC
      LIMIT 30
    `;

    const unreadRows = await prisma.$queryRaw<Array<{ unreadCount: bigint | number }>>`
      SELECT COUNT(*) AS unreadCount
      FROM notifications
      WHERE user_id = ${user.id}
        AND type = ${QUOTATION_NOTIFICATION_TYPE}
        AND is_read = ${false}
    `;

    return NextResponse.json(
      {
        notifications: notifications.map((item) => ({
          id: item.id,
          type: item.type,
          message: item.message,
          relatedId: item.relatedId,
          isRead: Boolean(Number(item.isRead)),
          createdAt: item.createdAt,
        })),
        unreadCount: Number(unreadRows[0]?.unreadCount ?? 0),
      },
      { headers }
    );
  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}

export async function PATCH(request: NextRequest) {
  const headers = getCorsHeaders(request.headers.get('origin'));

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    }

    if (!canViewQuotationNotifications(user)) {
      return NextResponse.json({ updated: 0 }, { headers });
    }

    await ensureNotificationTable();

    let notificationIds: number[] = [];
    try {
      const body = await request.json();
      if (Array.isArray(body?.notificationIds)) {
        notificationIds = body.notificationIds
          .map((value: unknown) => Number(value))
          .filter((value: number) => Number.isInteger(value) && value > 0);
      }
    } catch {
      // Ignore parse errors and fall back to marking all unread as read.
    }

    if (notificationIds.length > 0) {
      const placeholders = notificationIds.map(() => '?').join(',');
      await prisma.$executeRawUnsafe(
        `UPDATE notifications
         SET is_read = true
         WHERE user_id = ?
           AND type = ?
           AND id IN (${placeholders})`,
        user.id,
        QUOTATION_NOTIFICATION_TYPE,
        ...notificationIds
      );
    } else {
      await prisma.$executeRaw`
        UPDATE notifications
        SET is_read = ${true}
        WHERE user_id = ${user.id}
          AND type = ${QUOTATION_NOTIFICATION_TYPE}
          AND is_read = ${false}
      `;
    }

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}

function canViewQuotationNotifications(user: AuthenticatedUser): boolean {
  if (user.role === 'ADMIN') {
    return true;
  }

  return (user.position || '').trim().toLowerCase() === 'sales';
}

async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return null;
  }

  let decoded: any = null;
  try {
    decoded = verifyToken(token);
  } catch {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
        decoded = JSON.parse(payloadStr);
      }
    } catch {
      return null;
    }
  }

  const requesterId = decoded?.userId ?? decoded?.sub;
  if (!requesterId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(requesterId) },
    select: {
      id: true,
      role: true,
      position: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    role: String((user as any).role),
    position: (user as any).position || null,
  };
}

async function ensureNotificationTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      type VARCHAR(64) NOT NULL,
      message TEXT NOT NULL,
      related_id VARCHAR(191) NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX idx_notifications_user_created (user_id, created_at),
      INDEX idx_notifications_user_read (user_id, is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}
