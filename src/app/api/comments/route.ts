import { prisma } from "../../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  blogId: string;
  comment: string;
  email: string;
}

export  async function POST(
  req: Request,
  res: NextApiResponse
) {
  try {
    const body : RequestBody = await req.json();

    const { blogId, comment, email } = body;

    console.log("blogId: ", blogId);
    console.log("comment: ", comment);
    console.log("email: ", email);

    const createdComment = await prisma.comment.create({
      data: {
        comment: comment,
        author: { connect: { email: email } },
        post: { connect: { id: blogId } },
      },
    });

    const allComments = await prisma.comment.findMany({
      where: {
        postId: blogId,
      },
    });

    return new Response(JSON.stringify(allComments));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}


export async function GET(req: Request ) {

    console.log("GET request : ", req.method);
    
    const allComments = await prisma.comment.findMany({});
   
    return new Response(JSON.stringify(allComments));
  }
  
