import { NextResponse } from 'next/server';
import { db } from '@/app/api/(lib)/db';
import { comparePassword } from '@/app/api/(lib)/utils';
import { generateJWT } from '../../(lib)/utils';

export const POST=async(req:Request)=>{
  try {
    const {email,password}=await req.json();
    if(!email||!password){
      return NextResponse.json({success:false,msg:"All fields are required!",status:200});
    }
    
    const loginUser=await db.user.findUnique({
      where:{
        email
      }
    });
    console.log(loginUser);
    if(!loginUser){
      return NextResponse.json({succsess:false,msg:"No account found associated with this email"},{status:401});
    }
    if(!await comparePassword(password,loginUser.password)){
      return NextResponse.json({succsess:false,msg:"Wrong credentials"},{status:401});
    }
    // if(!loginUser.validated){  //if not verified
    //   return NextResponse.json({success:false,msg:'Email is not verified',data:{userId:loginUser.id}},{status:401})
    // }
    console.log(loginUser);
    const userData={
      id:loginUser.id,
      name:loginUser.name,
      email:loginUser.email,
      address:loginUser.address,
      role:loginUser.role,
      validated:loginUser.validated
    }
    return NextResponse.json({success:true,msg:"Login successful",
                              data:{...userData},
                              token:generateJWT(loginUser.id)
                            },
                            {status:200});
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error",{status:500});
  }
}
