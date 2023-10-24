
import { NextResponse } from 'next/server';
import { generateOTP } from '../../(lib)/utils';
import { validateOTP } from '../../(lib)/utils';
import { db } from '../../(lib)/db';
export const POST=async(req:Request)=>{
  
  try { 
    const {userId,code}=await req.json();
    const validated=await validateOTP(userId,code);
    if(validated){
      const update=await db.user.update({
        where:{
          id:userId
        },
        data:{
          validated:true
        }
      });
      console.log(update)
      return NextResponse.json({success:true,msg:"User verified successfully",data:{}});
    }else{
      return NextResponse.json({success:false,msg:'OTP validation failed',data:{}},{status:401})
    }
    
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error",{status:500});
  }

}
