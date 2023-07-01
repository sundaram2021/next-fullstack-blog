import jwt, { JwtPayload } from "jsonwebtoken";

interface Signoptions {
    expiresIn? : string | number;
}

const defaultSignOptions: Signoptions = {
    expiresIn: "1h"
}

export function signJwtAccessToken(payload: JwtPayload, options: Signoptions = defaultSignOptions){
   const secret = process.env.JWT_SECRET;
   const token = jwt.sign(
    payload,
    secret!,
    options
   )

   return token
}

export function verifyJwt(token:string){
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret!);

        return  decoded as JwtPayload
    } catch (error) {
        console.log(error);
        return null
        
    }
}