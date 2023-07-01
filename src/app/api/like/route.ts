import { prisma } from "../../../../lib/prisma";
interface RequestBody {
    likedPostId: string,
    likedUserEmail: string 
}


export async function POST(req:Request) {

  const { likedPostId, likedUserEmail } = await req.json();

  console.log("likedPostId : ", likedPostId);
  console.log("likedUserEmail : ", likedUserEmail);
  
  
    const isLikedIdExist = await prisma.like.findFirst({
        where : {
          likedPostId: likedPostId,
          likedUserEmail: likedUserEmail
        } 
    })

    if(!isLikedIdExist){
      await prisma.like.create({
        data : {
            likedPostId: likedPostId,
            likedUserEmail: likedUserEmail,
            state: true
        }
      })
    } else {
      await prisma.like.delete({
        where : {
          likedPostId: likedPostId
        }
      })
    }


    const blog = await prisma.post.findFirst({
      where: {
        id: likedPostId
      }
    })

    //get the liked from post schema  
    const like = blog?.liked;
    console.log("like : ", like);
    
        
    if (likedPostId !== null) {
    
        await prisma.post.update({
          where: {
            id: likedPostId
          },
          data: {
            liked: !like ,
          },
        })
    }

    const updatedBlogs = await prisma.post.findMany({})

    return new Response(JSON.stringify(updatedBlogs));
}




export async function GET(req: Request ) {

  console.log("GET request : ", req.method);
  
  const likes = await prisma.like.findMany({});
 
  return new Response(JSON.stringify(likes));
}


