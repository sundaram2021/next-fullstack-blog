import { prisma } from "../../../../lib/prisma";
import bcrypt from 'bcrypt';

interface RequestBody {
    name: string,
    email: string,
    password: string
}


export async function POST(req:Request) {
    console.log('222323');
    
    const body: RequestBody = await req.json();
    console.log("body : " + JSON.stringify(body));

    const  user = await prisma.user.create({
        data : {
          name: body.name,
          email: body.email,
          password: await bcrypt.hash(body.password, 10)
        }
    })

    console.log('user after prisma : ', user);
    return new Response(JSON.stringify(user)) 
    
}

// interface extendedRequest extends Request {

export async function Put(req:Request) {
    console.log('222323');
    
    
    const body: RequestBody = await req.json();
    console.log("body : " + JSON.stringify(body));
    const email = req.headers.get('Authorization');

    const  user = await prisma.user.update({
        where: {
            email: email as string
        },
        data : {
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
        }
    })
    return new Response(JSON.stringify(user)) 
    
}