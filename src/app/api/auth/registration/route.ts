import { NextResponse } from 'next/server';
import { db } from '@/app/api/(lib)/db';
import { generateOTP, hashPassword } from '@/app/api/(lib)/utils';
import { sendOTP } from '../../(lib)/mailsender';
export const POST=async(req:Request)=>{
  try {
    const {name, email,phone,password,address}=await req.json();
    if(!name||!email||!phone||!password||!address){
      return NextResponse.json({success:false,msg:"All fields are required!",status:200});
    }
    let user;
    const existingEmail=await db.user.findUnique({
      where:{
        email
      }
    });
    if(existingEmail&&existingEmail.validated){
      return NextResponse.json({success:false,msg:"Email already exists!",status:200});
    }else{
      user=existingEmail;   //if existing email then send otp to the user
    }
    const existingPhone=await db.user.findUnique({
      where:{
        phone
      }
    });
    if(existingPhone&&existingPhone.validated){
      return NextResponse.json({success:false,msg:"Phone number already exists!",status:200});
    }

    if(!existingEmail&&!existingPhone){   //if no user existing then create a new user
      const e_password=await hashPassword(password);
      const createUser=await db.user.create({data:{name,phone,email,password:e_password,address}});
      user=createUser;
      console.log(createUser);
    }

    if(!user){
      return new NextResponse("Internal error",{status:500});
    }

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 60); // expires in 60 minute

    const code=generateOTP(5);
    const createOtp=await db.oTP.create({data:{code,expires:expiration,userId:user.id}});

    sendOTP(user.email,code);

    return NextResponse.json({success:true,msg:"Registration successful",data:user},{status:200});
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error",{status:500});
  }
}
