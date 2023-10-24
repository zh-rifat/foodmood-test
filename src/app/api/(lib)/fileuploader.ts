import fs from 'fs';
export const uploadPhoto=async(photo:File,path:string)=>{
  const photoFile=await photo.arrayBuffer();
  fs.writeFileSync(path,Buffer.from(photoFile));
}
