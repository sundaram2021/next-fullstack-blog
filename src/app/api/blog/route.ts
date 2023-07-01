
import { getToken } from 'next-auth/jwt';
import { prisma } from "../../../../lib/prisma";
import { NextRequest } from 'next/server';
// import { Post } from '@prisma/client';
interface RequestBody {
    title: string,
    body: string,
    email: string 
}


export async function POST(req: NextRequest ) {
  console.log('222323');
  const token = await getToken({ req, secret: process.env.SECRET })

  const currentUserEmail = token?.email as string;
  const currentUserId = token?.id as string;

  const body: RequestBody = await req.json();
  console.log("body: " + JSON.stringify(body));

  const getUser = await prisma.user.findFirst({
    where: {
      email: currentUserEmail
    }
  })

  console.log("id : ", getUser?.id);
  

  const postInput = {
    title: body?.title,
    body: body.body,
    authorId: getUser?.id as string,
  };

  const user = await prisma.post.create({
      data: postInput,
  });

  console.log('user after prisma: ', user);
  return new Response(JSON.stringify(user));
}