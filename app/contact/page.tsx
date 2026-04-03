"use client"
import React, { Suspense, useState } from 'react'
import { Header } from '../components'
import ContactPages from '../components/ContactPages'
import Footer from '../components/Footer'

const page = () => {
 
  return (
    <div><ContactPages/><Footer/></div>
  )
}
export default page

