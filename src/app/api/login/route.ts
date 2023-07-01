import { signJwtAccessToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import bcrypt from 'bcrypt';

interface RequestBody {
    name: string,
    email: string,
    password: string
}


export async function POST(req:Request) {
    console.log('2');
    
    const body: RequestBody = await req.json();
    console.log("body : " + JSON.stringify(body));

    const  user = await prisma.user.findFirst({
        where : {
          email: body.email,
        }
    })

    console.log('user after prisma : ', user);
    

    async function comparePasswords(userPassword: string, bodyPassword: string): Promise<boolean> {
      // console.log('user password', userPassword);
      // console.log('body password', bodyPassword);
        
      try {
        const passwordMatch = await bcrypt.compare(bodyPassword, userPassword);
        return passwordMatch;
      } catch (error) {
        // Handle the error, e.g., log or throw an exception
        // console.error('Error comparing passwords:', error);
        console.log('error : ', error);
        
        return false;
      }
    }

    if(user && (await comparePasswords(user.password, body.password))){
      const { password, ...userWithoutPassword } = user;
      // console.log(userWithoutPassword);

      const acessToken =  signJwtAccessToken(userWithoutPassword)
      const result = {
        ...userWithoutPassword,
        acessToken
      }   
      return new Response(JSON.stringify(result)) 
    }

    else {
      // console.log('uuuu ');
        
      return new Response(JSON.stringify(null));
    }
}