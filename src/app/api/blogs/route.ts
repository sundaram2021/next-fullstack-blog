import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";


interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    posts: Post[];
    comments: Comment[];
  }

interface Post {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    title: string;
    body: string;
    author: User;
    authorId: string;
    comments: Comment[];
    liked: boolean;
    saved: boolean;
}

interface Comment {
    id: string;
    comment: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    post: Post;
    postId: string;
    author?: User;
    authorId?: string;
}  

interface Like {
    id: string;
    likedPostId: string;
    likedUserEmail: string;
    state: boolean;
  }

interface Save {
    id: string;
    savedPostId: string;
    savedUserEmail: string;
    state: boolean;
  }
  


export async function GET(req: NextRequest ) {
  const token = await getToken({ req, secret: process.env.SECRET })

  console.log("token : ",token);

  const currentUserEmail = token?.email as string;
  const currentUserId = token?.id as string;
  
  

  const likes:Like[] = await prisma.like.findMany({
    where: {
      likedUserEmail : currentUserEmail as string,
    }
  })

  console.log("likes : ", likes);
  

  const saves:Save[] = await prisma.save.findMany({
    where: {
      savedUserEmail : currentUserEmail as string,
    }
  })

  const likedPostIds = likes.map((like) => like.likedPostId);

  console.log("likedPostIds : ", likedPostIds);
  

  if(likedPostIds.length > 0 && likes.length > 0){
    await prisma.post.updateMany({
      where: {
        id: {
          in: likedPostIds,
        },
      },
      data: {
        liked: true,
      },
    });
  } else {
    await prisma.post.updateMany({
      where: {},
      data: {
        liked: false,
      },
    });
  }

  const savedPostIds = saves.map((save) => save.savedPostId);

  if(savedPostIds.length > 0 && saves.length > 0){
    await prisma.post.updateMany({
      where: {
        id: {
          in: savedPostIds,
        },
      },
      data: {
        saved: true,
      },
    });
  }else {
    await prisma.post.updateMany({
      where: {},
      data: {
        saved: false,
      },
    });
  }


  const posts = await prisma.post.findMany({
    include: {
      comments: true,
      author: true,
    },
  });

  const postsWithComments = posts.map((post) => {
    const comments = post.comments.map((comment) => comment);
    return {
      ...post,
      author: post.author,
      comments
      // updatedLikePosts,
      // updatedSavePosts,
    };
  });
  
  return new Response(JSON.stringify(postsWithComments));
}

