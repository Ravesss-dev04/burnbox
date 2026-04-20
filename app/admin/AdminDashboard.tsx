
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Users
} from 'lucide-react';
import Image from 'next/image'
import React, { JSX, ReactNode, useState, useEffect } from 'react'
import DashboardContent from './DashboardContent';
import GalleryManager from './GalleryManager';
import CalculatorBox from './components/CalculatorBox';
import AdminServices from './AdminServices';
import SettingsAdmin from './SettingsAdmin';
import ProfileInfo from './ProfileInfo';
import FeedbackContent from './FeedbackContent';
import Customize from './Customize';
import { Palette } from 'lucide-react';
import SalesLead from './SalesLead';

interface AdminDashboardProps {
  userMail?: string;
  userRole?: 'ADMIN' | 'STAFF';
  onLogout?: () => void;
  children?: ReactNode;
}

interface NotificationItem {
  id: number;
  type: string;
  message: string;
  relatedId: string | null;
  isRead: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userMail, userRole = 'STAFF', onLogout }) => {
  // Role must reflect server-authenticated user role.
  const effectiveRole = userRole === 'ADMIN' ? 'ADMIN' : 'STAFF';

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const sectionMap: Record<string, React.ReactElement> = {
    dashboard: React.createElement(DashboardContent as any, { userMail, onLogout, darkMode: true }),
    services: <AdminServices/>,
    leads: <SalesLead/>,
    gallery: <GalleryManager darkMode={true} />,
    Feedback: <FeedbackContent />,
    profile: <ProfileInfo/>,
    settings: <SettingsAdmin/>,
    customize: <Customize userRole={effectiveRole}/>,
  }

  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent direct navigation to settings by URL state if not admin
  useEffect(() => {
    if (effectiveRole !== 'ADMIN' && activeSection === 'settings') {
      setActiveSection('dashboard');
    }
  }, [effectiveRole, activeSection]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await fetch('/api/auth/notifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        setNotifications([]);
        setUnreadNotificationCount(0);
        return;
      }

      const data = await response.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadNotificationCount(Number(data.unreadCount || 0));
    } catch (error) {
      console.error('Notification fetch error:', error);
      setNotifications([]);
      setUnreadNotificationCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/auth/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
      setUnreadNotificationCount(0);
    } catch (error) {
      console.error('Notification mark-read error:', error);
    }
  };

  useEffect(() => {
    if (!mounted) {
      return;
    }

    void fetchNotifications();
    const intervalId = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [mounted]);

  useEffect(() => {
    if (isNotificationOpen && unreadNotificationCount > 0) {
      void markAllNotificationsAsRead();
    }
  }, [isNotificationOpen, unreadNotificationCount]);

  const getAvatarLetter = (email: string) => {
    const localPart = email?.split('@')[0] || ''
    return localPart ? localPart.charAt(0).toUpperCase() : 'A'
  }

  const getDisplayName = (email?: string) => {
    if (!email) return 'Admin User'
    const localPart = email.split('@')[0]
    return localPart.charAt(0).toUpperCase() + localPart.slice(1)
  }

  if (!mounted) return null;



  const menuItems = [
    { category: "Main", items: [
      { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    ]},
    { category: "Management", items: [
      { id: "services", icon: <ShoppingBag size={20} />, label: "Services" },
      { id: "leads", icon: <Users size={20} />, label: "Leads" },
      { id: "Feedback", icon: <MessageSquare size={20} />, label: "Feedback" },
      { id: "gallery", icon: <ImageIcon size={20} />, label: "Gallery" },
      { id: "customize", icon: <Palette size={20} />, label: "Customization" },
    ]},
    { category: "System", items: [
      { id: "profile", icon: <User size={20} />, label: "Profile" },
      ...(effectiveRole === 'ADMIN' ? [{ id: "settings", icon: <Settings size={20} />, label: "Settings" }] : []),
    ]}
  ];
  const flatMenuItems = menuItems.flatMap(group => group.items);

  // Radial Menu Calculations
  const radius = 140; // Distance from center
  const totalItems = flatMenuItems.length;
  // Spread items in a semi-circle on the right (-75 to 75 degrees)
  const startAngle = -75;
  const endAngle = 75;
  const angleStep = (endAngle - startAngle) / (totalItems - 1);

  const getItemPosition = (index: number) => {
    const angleInDegrees = startAngle + (index * angleStep);
    const angleInRadians = angleInDegrees * (Math.PI / 180);
    return {
      x: Math.cos(angleInRadians) * radius,
      y: Math.sin(angleInRadians) * radius,
    };
  };

  // If in customization mode, render full screen
  if (activeSection === 'customize') {
    return (
      <div className="fixed inset-0 z-50 bg-black w-full h-full">
        <Customize userRole={effectiveRole} />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#030303] text-white overflow-hidden font-sans">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className="hidden md:flex relative h-screen bg-[#0a0a0a] border-r border-white/5 flex-col z-30"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-600/10 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Image src="/bblogo.png" alt="logo" width={24} height={24} className="w-6 h-6" />
            </div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
              >
                BURNBOX
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              {isOpen && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                  {group.category}
                </h3>
              )}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      activeSection === item.id 
                        ? "text-white" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent border-l-4 border-pink-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    {isOpen && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-4">
          {/* User Info */}
          <div className={`flex items-center gap-3 px-2 ${!isOpen && 'justify-center'}`}>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-pink-500/20 shrink-0">
                {getAvatarLetter(userMail || 'A')}
             </div>
             {isOpen && (
               <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">{getDisplayName(userMail)}</p>
                 <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                   effectiveRole === 'ADMIN' 
                     ? 'bg-pink-500/20 text-pink-400 border border-pink-500/20' 
                     : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                 }`}>
                   {effectiveRole}
                 </div>
               </div>
             )}
          </div>

          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 ${!isOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Floating Horizontal Menu (Hidden on Desktop) */}
      <div className="md:hidden fixed left-4 bottom-4 z-50 flex items-center gap-3 max-w-[calc(100vw-2rem)]">
        {/* Main Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`shrink-0 relative z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 backdrop-blur-xl border border-white/10 ${
            isOpen 
              ? "bg-pink-600 text-white shadow-[0_0_30px_rgba(236,72,153,0.6)]" 
              : "bg-black/60 text-white hover:border-pink-500/50"
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Horizontal Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-x-auto scrollbar-hide"
            >
              {flatMenuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25, 
                    delay: index * 0.05 
                  }}
                  className={`shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group ${
                    activeSection === item.id 
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30" 
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  
                  {/* Tooltip Label */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-900/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl" />
        </div>

        {/* Top Header */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#030303]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:block p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <Menu size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-white ml-12 md:ml-0">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-pink-500/50 transition-colors">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => {
                    const nextOpen = !isNotificationOpen;
                    setIsNotificationOpen(nextOpen);
                    if (nextOpen) {
                      void fetchNotifications();
                    }
                  }}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-[360px] max-w-[92vw] bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">Notifications</p>
                        <p className="text-xs text-gray-400">Quotation submissions for Sales and Admin</p>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="px-4 py-4 text-sm text-gray-400">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                          <div className="px-4 py-4 text-sm text-gray-400">No notifications yet.</div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => {
                                setActiveSection('leads');
                                setIsNotificationOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                                notification.isRead ? 'bg-transparent' : 'bg-pink-500/10'
                              }`}
                            >
                              <p className="text-sm text-white">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{getDisplayName(userMail)}</p>
                    <p className={`text-xs font-bold ${effectiveRole === 'ADMIN' ? 'text-pink-500' : 'text-blue-400'}`}>
                      {effectiveRole}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
                    {getAvatarLetter(userMail || 'A')}
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-2 space-y-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <User size={16} /> Profile
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <Settings size={16} /> Settings
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button 
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {sectionMap[activeSection] || (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <p>Section under construction</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard