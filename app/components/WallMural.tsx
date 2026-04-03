'use client'

const imagesWall = [
    {
        src: '/wallmuralimg1.png',
        title: '',
        description: ''
    },

     {
        src: '/wallmuralimg2.png',
        title: '',
        description: ''
    },

     {
        src: '/wallmuralimg3.png',
        title: '',
        description: ''
    },

     {
        src: '/wallmuralimg4.png',
        title: '',
        description: ''
    }
    
]

export default function Wallmural() {
    
    return(
        <div className="min-h-[100vh] bg-[#333] custom-gallery-bg py-10">
           <h3 className="text-2xl text-center mt-20 text-pink-400">Wall Mural</h3>
           <img className="items-center flex justify-center ml-150" src="/wallmural.png" alt="" width={700} height={500}/>
        </div>
    )
}