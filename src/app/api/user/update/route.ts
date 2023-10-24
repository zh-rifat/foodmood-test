import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { comparePassword, generateOTP, hashPassword, verifyJWT } from '@/app/api/(lib)/utils';
import { getUserByJWT } from './../../(lib)/utils';
import { db } from '@/app/api/(lib)/db';
import { sendOTP } from './../../(lib)/mailsender';
import { uploadPhoto } from './../../(lib)/fileuploader';

export const POST= async(req:Request) => {
  try {
    const formData=await req.formData();
    const data=Object.fromEntries(formData);
    const {name,address,email,phone,old_password,new_password,photo}:any=data;
    const token=req.headers.get('authorization');
    const user=await getUserByJWT(token||"");

    if(!user){
      return NextResponse.json({success:false,msg:'Authentication failed.'},{status:401});
    }
    let updatedData:any={};
    if(name) updatedData.name=name;
    if(address) updatedData.address=address;
    if(email&&email!=user.email) {
      const existingEmail=await db.user.findUnique({where:{email}});
      if(existingEmail)
        return NextResponse.json({success:false,msg:'Email already exists'},{status:400});

      updatedData.email=email;
      updatedData.validated=false;
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 60); // expires in 60 minute
      const code=generateOTP(5);
      const createOtp=await db.oTP.create({data:{code,expires:expiration,userId:user.id}});
      sendOTP(email,code);
    }
    if(phone&&phone!=user.phone){
      const existingPhone=await db.user.findUnique({where:{phone}});
      if(existingPhone)
        return NextResponse.json({success:false,msg:'Phone number already exists'},{status:400});
      updatedData.phone=phone;
      //TODO: send otp to the new phone number
    }
    if(new_password&&old_password){
      const passwordMatch=await comparePassword(old_password,user.password);
      if(!passwordMatch){
        return NextResponse.json({success:false,msg:'Old password is incorrect'},{status:401});
      }
      updatedData.password= await hashPassword(new_password);
    }

    if(photo){
      if(photo.type.indexOf('image')==-1){
        return NextResponse.json({success:false,msg:'Invalid file type'},{status:400});
      }
      if(photo.size>1024*1024*2){
        return NextResponse.json({success:false,msg:'File size should be less than 2MB.'},{status:400});
      }
      console.log(photo)
      try {
        // Check if the directory exists
        // const directory=path.join(process.cwd(),'public','uploads','images','users');
        const directory='public/uploads/images/users';
        if (!fs.existsSync(directory)) {
          // If it doesn't exist, create it recursively
          fs.mkdirSync(directory, { recursive: true });
          console.log(`Directory '${directory}' created.`);
        } else {
          console.log(`Directory '${directory}' already exists.`);
        }
      } catch (err) {
        console.error('Error:', err);
      }
      
      // const photoPath=path.join('public','uploads','images','users',`${Date.now()}_${photo.name}`);
      const photoPath=`public/uploads/images/users/${Date.now()}_${photo.name}`;
      uploadPhoto(photo,photoPath);
      updatedData.photo=photoPath.replace('public/','');
    }
    console.log("updated data: ",updatedData);
    const update=await db.user.update({where:{id:user.id},data:updatedData})
    console.log(update);
    
    return NextResponse.json({success:true,msg:'Profile updated successfully',data:{...update}},{status:200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({success:false,msg:'Internal error',data:null},{status:500});
  }
};
