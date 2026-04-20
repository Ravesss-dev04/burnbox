"use client"
import React, { useState, useEffect } from 'react'
import { Trash2, Shield, ShieldOff, User, RefreshCw } from 'lucide-react'

const PREDEFINED_POSITIONS = [
  'Sales',
  'Graphic Design',
  'Web Developer',
  'Admin Support',
  'Marketing',
  'Customer Support',
  'Finance',
  'Human Resources',
]

const CUSTOM_POSITION_VALUE = '__custom__'

interface UserData {
  id: number;
  email: string;
  role: 'ADMIN' | 'STAFF';
  position: string | null;
  name: string | null;
  image: string | null;
  bio: string | null;
  created_at: string;
}

const SettingsAdmin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [positionSelection, setPositionSelection] = useState('')
  const [customPosition, setCustomPosition] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [bio, setBio] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF')
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<UserData[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/auth/admin/users', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      } else if (res.status === 401 || res.status === 403) {
        setUsers([])
        setStatus('Admin authorization required. Please sign in with an ADMIN account.')
      } else {
        setStatus(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setStatus('Error fetching users')
    } finally {
      setLoadingUsers(false)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedPosition = positionSelection === CUSTOM_POSITION_VALUE
      ? customPosition.trim()
      : positionSelection.trim()

    if (!normalizedPosition) {
      setStatus('Position / Title is required')
      return
    }

    setLoading(true)
    setStatus('')
    try {
      const res = await fetch('/api/auth/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, position: normalizedPosition, role, name, image, bio })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Invitation sent: ${data.user.email} (${data.user.role}) - email verification required before dashboard access.`)
        setEmail(''); setPassword(''); setPositionSelection(''); setCustomPosition(''); setRole('STAFF'); setName(''); setImage(''); setBio('');
        fetchUsers() // Refresh list
      } else {
        setStatus(data.error || 'Failed to create user')
      }
    } catch (err: any) {
      setStatus(err.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userEmail: string, newRole: 'ADMIN' | 'STAFF') => {
    if (!confirm(`Are you sure you want to change ${userEmail}'s role to ${newRole}?`)) return;
    
    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin/update-role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail, role: newRole })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Role updated: ${data.user.email} -> ${data.user.role}`)
        fetchUsers() // Refresh list
      } else {
        setStatus(data.error || 'Failed to update role')
      }
    } catch (err: any) {
      setStatus(err.message || 'Error updating role')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) return;

    setLoading(true)
    try {
      const res = await fetch(`/api/auth/admin/users?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`User deleted: ${userEmail}`)
        fetchUsers() // Refresh list
      } else {
        setStatus(data.error || 'Failed to delete user')
      }
    } catch (err: any) {
      setStatus(err.message || 'Error deleting user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Settings</h2>
        <p className="text-zinc-400">Manage access and permissions for the admin dashboard.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl border ${status.includes('Failed') || status.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'} flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2`}>
          {status.includes('Failed') || status.includes('Error') ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )}
          {status}
        </div>
      )}

      {/* User Management List */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <User className="text-blue-500" size={24} />
            User Management
          </h3>
          <button 
            onClick={fetchUsers}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={18} className={loadingUsers ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-sm">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Position</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loadingUsers ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{user.email}</div>
                      <div className="text-xs text-zinc-500">ID: {user.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {user.position || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.role === 'STAFF' ? (
                          <button
                            onClick={() => updateUserRole(user.email, 'ADMIN')}
                            className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                            title="Promote to Admin"
                          >
                            <Shield size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserRole(user.email, 'STAFF')}
                            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                            title="Revoke Admin Access"
                          >
                            <ShieldOff size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          Create New Account
        </h3>
        
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Full Name</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email Address</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
            <p className="text-xs text-zinc-500">This password becomes active only after invitation email verification.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Position / Title</label>
            <div className="relative">
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 appearance-none cursor-pointer"
                value={positionSelection}
                onChange={e => {
                  const nextValue = e.target.value
                  setPositionSelection(nextValue)
                  if (nextValue !== CUSTOM_POSITION_VALUE) {
                    setCustomPosition('')
                  }
                }}
                required
              >
                <option value="" disabled>Select a position</option>
                {PREDEFINED_POSITIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value={CUSTOM_POSITION_VALUE}>Other (please specify)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {positionSelection === CUSTOM_POSITION_VALUE && (
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200"
                type="text"
                value={customPosition}
                onChange={e => setCustomPosition(e.target.value)}
                placeholder="Enter custom position title"
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Profile Image URL</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="text" 
              value={image} 
              onChange={e => setImage(e.target.value)} 
              placeholder="https://example.com/image.jpg" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Access Role</label>
            <div className="relative">
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 appearance-none cursor-pointer" 
                value={role} 
                onChange={e => setRole(e.target.value as 'ADMIN' | 'STAFF')}
              >
                <option value="STAFF">Staff (Limited Access)</option>
                <option value="ADMIN">Admin (Full Access)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-zinc-400">Bio / Description</label>
            <textarea 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 min-h-[100px]" 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Short bio about the staff member..." 
            />
          </div>
          <div className="md:col-span-2 mt-2">
            <button 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsAdmin
