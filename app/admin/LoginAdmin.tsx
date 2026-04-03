"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Loader2, KeyRound, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type AuthView = 'login' | 'forgot' | 'reset';

const LoginAdmin = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('STAFF')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for reset token in URL
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setView('reset')
    }
  }, [searchParams])

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setIsLoggedIn(true)
        setUserEmail(userData.email)
        
        // Determine role with fallback
        let role = userData.role || 'STAFF';
        if (userData.email === 'admin@example.com') {
          role = 'ADMIN';
        }
        setUserRole(role);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    // Demo Admin Login
    if (view === 'login' && email === 'admin@example.com' && password === 'admin123') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = { email: 'admin@example.com', role: 'ADMIN' }
      localStorage.setItem('adminUser', JSON.stringify(userData))
      setIsLoggedIn(true)
      setUserEmail('admin@example.com')
      setUserRole('ADMIN')
      setIsLoading(false)
      return
    }

    try {
      let endpoint = '';
      let body = {};

      switch (view) {
        case 'login':
          endpoint = '/api/auth/login';
          body = { email, password };
          break;
        case 'forgot':
          endpoint = '/api/auth/forgot-password';
          body = { email };
          break;
        case 'reset':
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
          }
          endpoint = '/api/auth/reset-password';
          body = { token: searchParams.get('token'), password };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (view === 'login') {
          const role = data?.user?.role || 'STAFF'
          const userData = { email: email, role }
          localStorage.setItem('adminUser', JSON.stringify(userData))
          setIsLoggedIn(true)
          setUserEmail(email)
          setUserRole(role)
          router.refresh()
        } else if (view === 'forgot') {
          setSuccessMessage('Reset link sent to your email.')
        } else if (view === 'reset') {
          setSuccessMessage('Password reset successfully! Please login.')
          setTimeout(() => setView('login'), 2000);
        }
      } else {
        setError(data.error || 'Operation failed')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
    setUserEmail('')
    setUserRole('STAFF')
    setEmail('')
    setPassword('')
    router.refresh()
  }

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} userMail={userEmail} userRole={userRole as 'ADMIN' | 'STAFF'} />
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#030303] p-4'>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className='flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl min-h-[600px] relative z-10'>
        
        {/* Left Side - Form */}
        <div className='w-full md:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center'>
          {/* Logo */}

          <div className='absolute top-8 left-8 flex items-center gap-2'>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Image src="/bblogo.png" alt="logo" width={20} height={20} className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">BURNBOX</span>
          </div>

          <div className='max-w-sm w-full mx-auto mt-10'>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className='text-3xl font-bold text-white mb-2'>
                    {view === 'login' && 'Welcome Back'}
                    {view === 'forgot' && 'Forgot Password?'}
                    {view === 'reset' && 'Reset Password'}
                  </h2>
                  <p className='text-gray-400'>
                    {view === 'login' && 'Enter your credentials to access the dashboard.'}
                    {view === 'forgot' && 'Enter your email to receive a reset link.'}
                    {view === 'reset' && 'Create a new password for your account.'}
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2'
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2'
                  >
                    <Check size={16} />
                    {successMessage}
                  </motion.div>
                )}

                <form className='space-y-5' onSubmit={handleAuth}>
                  {/* Email Field - Common for all except reset (unless we want to confirm email) */}
                  {view !== 'reset' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input 
                          type="email" 
                          placeholder='name@example.com'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className='w-full bg-[#111] border border-white/10 text-white px-10 py-3 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder-gray-600'
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Fields */}
                  {(view === 'login' || view === 'reset') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 ml-1">
                        {view === 'reset' ? 'New Password' : 'Password'}
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='w-full bg-[#111] border border-white/10 text-white px-10 py-3 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder-gray-600'
                          required
                          minLength={view === 'login' ? 1 : 6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password */}
                  {(view === 'reset') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className='w-full bg-[#111] border border-white/10 text-white px-10 py-3 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder-gray-600'
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Forgot Password Link */}
                  {view === 'login' && (
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => setView('forgot')}
                        className='text-sm text-gray-400 hover:text-pink-400 transition-colors'
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type='submit' 
                    disabled={isLoading}
                    className='w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {view === 'login' && 'Sign In'}
                        {view === 'forgot' && 'Send Reset Link'}
                        {view === 'reset' && 'Reset Password'}
                        {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </>
                    )}
                  </button>
                </form>

                {/* Navigation Links */}
                <div className='mt-8 text-center'>
                  {(view === 'forgot' || view === 'reset') && (
                    <button 
                      onClick={() => setView('login')}
                      className='text-gray-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto'
                    >
                      Back to Login
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Right Side - Image/Branding */}
        <div className='hidden md:flex w-1/2 bg-[#050505] relative items-center justify-center overflow-hidden'>
          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-pink-600/20 to-purple-900/20 z-0" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 z-0" />
          
          <div className='relative z-10 w-full h-full flex flex-col items-center justify-center p-12'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md aspect-square"
            >
               {/* Glowing Orb behind image */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[60px]" />
               
               <Image
                src="/bbimage.png"
                alt='Admin Character'
                fill
                className='object-contain drop-shadow-2xl'
                priority
              />
            </motion.div>
            
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                Manage your services, gallery, and inquiries in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginAdmin