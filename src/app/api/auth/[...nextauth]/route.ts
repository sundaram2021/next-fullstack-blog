import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../../../../../lib/prisma";
import bcrypt from 'bcrypt';
// import { PrismaAdapter } from 'next-auth/prisma-adapter';

const handler = NextAuth({
    
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        email: { label: "email", type: "text", placeholder: "jsmith@test.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // console.log("1");
        // console.log("credentials : ", credentials);
        // const res = await fetch("http://localhost:3000/api/login", {
        //   method: 'POST',
        //   body: JSON.stringify({ name: credentials?.name, email: credentials?.email, password: credentials?.password }),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const user = await res.json()
        // console.log("User is : " , user);
        
  
        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   console.log(user); 

        //   return user
        // }
        // // Return null if user data could not be retrieved
        // return null

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email
            }
          })
          if(user){
            const isPasswordMatch = await bcrypt.compare(credentials?.password as string, user.password);
            if(isPasswordMatch){
              const { password, ...userWithoutPassword } = user;
              return userWithoutPassword;
            } else {
              throw new Error('Password does not match!');
            }
          } else {
            throw new Error('No user found!');
          }
        } catch (error) {
          throw new Error(error as unknown as string);
        }
      }
    })
  ],
  session : {
    maxAge: 604800 
  },
  pages: {
    signIn: '/login',
  }
});
// const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }