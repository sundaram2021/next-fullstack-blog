import { prisma } from "../../../../lib/prisma";
interface RequestBody {
    likedPostId: string,
    likedUserEmail: string 
}


export async function POST(req:Request) {

  const { savedPostId, savedUserEmail } = await req.json();
    const isSavedIdExist = await prisma.save.findFirst({
        where : {
          savedPostId: savedPostId,
          savedUserEmail: savedUserEmail
        } 
    })

    if(!isSavedIdExist){
      await prisma.save.create({
        data : {
            savedPostId: savedPostId,
            savedUserEmail: savedUserEmail,
            state: true
        }
      })
    } else {
      await prisma.save.delete({
        where : {
          savedPostId: savedPostId
        }
      })
    }


    // const blog = await prisma.post.findFirst({
    //   where: {
    //     id: savedPostId
    //   }
    // })

    // //get the liked from post schema  
    // const save = blog?.saved;
    // console.log("like : ", save);
    
        
    // if (savedPostId !== null) {
    
    //     await prisma.post.update({
    //       where: {
    //         id: savedPostId
    //       },
    //       data: {
    //         liked: !save ,
    //       },
    //     })
    // }

    const updatedBlogs = await prisma.post.findMany({})

    return new Response(JSON.stringify(updatedBlogs));
}




export async function GET(req: Request ) {

  console.log("GET request : ", req.method);
  
  const saves = await prisma.save.findMany({});
 
  return new Response(JSON.stringify(saves));
}


