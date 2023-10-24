import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { db } from './db';
const SALT_ROUNDS=12;
const JWT_SECRET="doomdoof"
export async function hashPassword(password:string) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(hashedPassword);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

export const comparePassword=async(password:string,hashedPassword:string)=>{
  try {
    return bcrypt.compare(password,hashedPassword);
  } catch (error) {
    throw error;
  }
}

export const generateJWT=(userId:string)=>{
  return jwt.sign({userId},JWT_SECRET,{expiresIn:"21d"});
}

export const verifyJWT=(token:string)=>{
  try {
    const decodedToken=jwt.verify(token,JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw error;
  }
}
export const getUserByJWT=async(token:string)=>{
  try {
    const {userId}=verifyJWT(token) as { [key: string]: any };
    const user=db.user.findUnique({
      where:{
        id:userId
      }
    });
    return user;
  } catch (error) {
    throw error;
  }
}
export const getUserById=(userId:string)=>{
  const user=db.user.findUnique({
    where:{
      id:userId
    },
    select:{
      id:true,
      name:true,
      email:true,
      address:true,
      phone:true,
      role:true
    }
  });
  return user;
}

export const generateOTP=(length:number)=>{
  const values= new Uint8Array(length);
  crypto.getRandomValues(values);
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += (values[i] % 10).toString(); // Generate a digit from 0 to 9
  }
  return otp;
}

export const validateOTP=async(userId:string,code:string)=>{
  console.log(userId,code)
  const otp = await db.oTP.findFirst({
    where: {
      userId,
      code,
      expires: {
        gte: new Date(),
      },
    },
  });
  console.log(otp);
  return !!otp;
}
