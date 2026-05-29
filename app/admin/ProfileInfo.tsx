import { AnimatePresence, motion } from "framer-motion";
import { Camera, Edit, Mail, Phone, Plus, Search, Trash, User, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface StaffMember {
  id: number;
  name: string | null;
  email: string;
  position: string | null;
  role: 'ADMIN' | 'STAFF';
  image: string | null;
  bio: string | null;
  created_at: string;
}

interface ProfileInfoProps {
  userRole?: 'ADMIN' | 'STAFF';
  userMail?: string;
}

const ProfileInfo = ({ userRole = 'STAFF', userMail }: ProfileInfoProps) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch staff from the database
  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/auth/admin/users', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const users: StaffMember[] = data.users || [];
        
        if (userRole === 'ADMIN') {
          // Admin sees all staff
          setStaffList(users);
        } else {
          // Staff sees only their own profile
          const ownProfile = users.filter((u: StaffMember) => u.email === userMail);
          setStaffList(ownProfile);
        }
      } else {
        // If not authorized (staff can't access admin/users), try to show own info
        setStaffList([]);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchStaff, 10000);
    return () => clearInterval(interval);
  }, [userRole, userMail]);

  const handleDeleteClick = (staff: StaffMember) => {
    setDeleteTarget(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/auth/admin/users?id=${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Staff account deleted successfully.');
        setShowDeleteModal(false);
        setDeleteTarget(null);
        fetchStaff(); // Refresh in real time
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete staff account');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Error deleting staff account');
    } finally {
      setDeleting(false);
    }
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      (staff.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.position || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
            Profile Details
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {userRole === 'ADMIN' ? 'Manage staff profiles' : 'Your profile details'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-colors w-64"
            />
          </div>
        </div>
      </div>
      
      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((staff) => (
            <motion.div
              key={staff.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col h-[450px]"
            >
              {/* ID Card Header / Lanyard Hole visual */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1a1a1a] rounded-b-xl border-b border-x border-white/10 z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-black/50 rounded-full"></div>
              </div>
              
              {/* Company Branding Strip */}
              <div className="h-28 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                 <div className="absolute top-5 left-5 font-black text-white/90 tracking-[0.2em] text-[10px]">BURNBOX INC.</div>
                 <div className="absolute top-4 right-4 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold">BB</span>
                    </div>
                 </div>
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col items-center -mt-14 relative z-10">
                {/* Avatar */}
                <div className="relative w-28 h-28 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-800 shadow-2xl relative">
                     {staff.image ? (
                      <Image src={staff.image} alt={staff.name || staff.email} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#0a0a0a] p-1.5 rounded-full">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full border border-emerald-400 shadow-[0_0_10px_#10b981]"></div>
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-white text-center leading-tight mb-1">
                  {staff.name || staff.email.split('@')[0]}
                </h3>
                <div className="mb-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-wider border border-pink-500/20">
                      {staff.position || 'Staff'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      staff.role === 'ADMIN' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {staff.role}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="w-full space-y-3 mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">ID No.</span>
                    <span className="text-zinc-300 font-mono text-xs">BB-{String(staff.id).padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Email</span>
                    <span className="text-zinc-300 text-xs truncate max-w-[140px]" title={staff.email}>{staff.email}</span>
                  </div>
                  {staff.bio && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Bio</span>
                      <span className="text-zinc-300 text-xs truncate max-w-[140px]" title={staff.bio}>{staff.bio}</span>
                    </div>
                  )}
                </div>

                {/* Barcode / Footer */}
                <div className="w-full mt-auto pt-2 opacity-30 group-hover:opacity-60 transition-opacity flex flex-col items-center gap-1">
                   <div className="h-6 w-3/4 bg-white/20"></div>
                   <span className="text-[8px] text-zinc-600 tracking-[0.5em] uppercase">Authorized Personnel</span>
                </div>
                
                {/* Hover Actions Overlay - Delete only visible to ADMIN */}
                {userRole === 'ADMIN' && (
                  <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 rounded-xl">
                     <button 
                       onClick={() => handleDeleteClick(staff)} 
                       className="w-32 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                     >
                        <Trash size={14} /> Delete
                     </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStaff.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <User size={48} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-500">
              {userRole === 'ADMIN' ? 'No staff accounts found. Create accounts in Settings.' : 'Profile not found.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Trash size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Staff Account</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete the staff account for{' '}
                <strong className="text-white">{deleteTarget.name || deleteTarget.email}</strong>?
                This will revoke their access immediately.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    <>
                      <Trash size={14} /> Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileInfo;
