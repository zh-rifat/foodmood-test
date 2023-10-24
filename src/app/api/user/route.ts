
import { getUserById, verifyJWT } from '@/app/api/(lib)/utils';
import { TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';


//get user data
export const GET=async (req:Request,{params}:{params:{id:string}})=>{
  try {
    const token=req.headers.get('authorization');
    const decodedToken=verifyJWT(token||"") as { [key: string]: any };
    const {userId}=decodedToken;
    console.log("id: -==> ",decodedToken['userId']);
    return NextResponse.json({success:true,msg:"User data retrieved",data:await getUserById(userId)},{status:200});
  } catch (error:any) {
    console.error(error);
    if(error.name==='TokenExpiredError'){
      return NextResponse.json({success:false,msg:"token expired"},{status:401});
    }

      return NextResponse.json({success:false,msg:"Authentication failed."},{status:401});
  }
}
