import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../../../../../lib/prisma";

export const authOptions:NextAuthOptions = {
    
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        email: { label: "email", type: "text", placeholder: "jsmith@test.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("1");
        console.log("credentials : ", credentials);

        // const userInfo = await prisma.user.findUnique({
        //   where: {
        //       email: credentials?.email,
        //   }
        // })

        // if(userInfo === null) return null;
        
        
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("http://localhost:3000/api/login", {
          method: 'POST',
          body: JSON.stringify({ name: credentials?.name, email: credentials?.email, password: credentials?.password }),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
        console.log("User is : " , user);
        
  
        // If no error and we have user data, return it
        if (res.ok && user) {
          console.log(user); 

          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  session : {
    maxAge: 604800 
  },
  callbacks: {
    async jwt({token, user}){
      return { ...token, ...user }
    },

    async session({session, token}){
      session.user = token as any;

      return session
    }
  },
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
};
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }