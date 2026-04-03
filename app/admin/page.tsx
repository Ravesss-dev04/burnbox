
import React, { Suspense } from 'react'
import LoginAdmin from './LoginAdmin'




const AdminPage = () => {
  return (
   <div className='w-full h-full bg-gray-400'>
     <Suspense fallback={<div className="text-white p-4">Loading admin…</div>}>
       <LoginAdmin/>
     </Suspense>
   </div>
  )
}

export default AdminPage
