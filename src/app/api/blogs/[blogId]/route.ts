import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request, {params}: {params: {blogId: string}}){
    const blog = await prisma.post.findUnique({
        where: {
            id: params.blogId
        }
    });

    return NextResponse.json(blog);
}