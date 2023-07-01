import { prisma } from "../../../../lib/prisma";



export async function GET(req: Request ) {
  const posts = await prisma.user.findMany({});
 
  return new Response(JSON.stringify(posts));
}


export async function DELETE(req: Request) {
  const data = await req.json();
  const { id } = data;

  await prisma.user.delete({
    where: {
      id: id,
    },  
  });

  const users = await prisma.user.findMany({})
  return new Response(JSON.stringify(users));  
}