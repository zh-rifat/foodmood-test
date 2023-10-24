import React from 'react'
import Link from 'next/link'
import Menu from './menu'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className="navbar bg-rgb(94, 105, 115) font-serif flex justify-around items-center">
       
<div className="logo">
<Image src="/fast-food.png" alt="logo" height={70} width={90}></Image>
<Link href="/" className="text-red-700 ">
FOODIE!!!
</Link>
</div>

<div className="">
<Menu /> 
</div>
      

    
  </div>
  )
}

export default Navbar