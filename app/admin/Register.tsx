"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Admin account created successfully! Please login.')
        router.push('/admin') // Redirect to admin login
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-[60%]'>
        <div className='w-full md:w-1/2 px-15 relative bg-[#D9D9D9]'>
          {/* logo */}
          <div className='absolute top-5 left-6'>
            <Image
              src="/bblogo.png"
              alt='logo'
              width={35}
              height={35}
              className='mr-2'
            />
          </div>
          {/* title */}
          <div className='flex flex-col justify-center items-center h-[80vh] px-10 py-12'>
            <h2 className='text-[25px] font-semibold text-center mb-8'>Create Admin Account</h2>
            
            {error && (
              <div className='w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4'>
                {error}
              </div>
            )}
            
            {/* form */}
            <form className='space-y-4 w-full' onSubmit={handleRegister}>
              <input 
                type="email" 
                placeholder='Admin Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
              <input 
                type="password" 
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
                minLength={6}
              />
              <input 
                type="password" 
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
              <button 
                type='submit' 
                disabled={isLoading}
                className='bg-[#F43C6D] w-full text-white font-medium py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-50'
              >
                {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </button>
            </form>
            
            <div className='bg-gray-400 w-full border border-gray-400 opacity-50 mt-10'></div>
            
            {/* extra links */}
            <div className='mt-5 w-full text-[15px] font-medium text-gray-700 text-center'>
              <p>
                Already have an admin account?
                <Link href="/admin" className='text-blue-500 font-bold hover:text-blue-700 ml-1'>
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* image section */}
        <div className='hidden md:flex w-full md:w-1/2 bg-black text-white relative items-center justify-center'>
          <div className='absolute inset-0 opacity-100'>
            <Image
              src="/bbimage2.png"
              alt='bbimage'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full h-full flex flex-col justify-start pt-8 px-8 items-center'>
            <h1 className='text-2xl font-light mb-4'>Create Admin Account</h1>
            <p className='text-lg mb-6 text-center'>Register for administrative access</p>
            <Image
              src="/bbimage.png"
              alt='logo'
              width={400}
              height={400}
              className='object-contain mt-auto text-right'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register