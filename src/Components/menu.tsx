import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Menu = () => {
  return (
    <div className="flex items-center ">
      <div className="md:hidden toggleIc">
      <Image src="/bibimbap.png" alt="logo" height={30} width={30}></Image>
      </div>
      <div className="menu hidden md:block  ">
   <ul className=" flex flex-col md:flex-row ">
      <li>
     <Link href="" className=" ">
     Home
     </Link>
     </li>
     <div className="reg ">
     <li >
     <Link href=""  className=" ">
      Registration
     </Link>
     </li>
  
              <div className="regMenu ">
                   <ul className="">
                      <li className=""><Link href="">Customer</Link></li>
                      <li className=""><Link href="">Vendor</Link></li>
                   </ul>
              </div>
              </div>
   
     
     <li>
     <Link href=""  className=" ">
    About
     </Link>
    </li>
     <li>
     <Link href=""  className="">
     Contact
     </Link>
     </li>
     </ul>
     </div>
     </div>
     
  )
}

export default Menu