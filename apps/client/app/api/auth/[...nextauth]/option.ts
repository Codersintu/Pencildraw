import CredentialsProvider from "next-auth/providers/credentials";
import {client} from "@repo/db/index"
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
type jwtProps={
    token:any,
    user?:any,
    account?:any
    session?:any
}
export const authOptions={
    adapter:PrismaAdapter(client),
    providers:[
        CredentialsProvider({
        name:"Credentials",
        credentials:{
                email: { label: "Email", type: "text", placeholder: "test@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "password"}
        },
        async authorize(credentials): Promise<any> {
            if (!credentials?.email || !credentials?.password) {
                 throw new Error(
                  "Credentials are missing!"
                 );
            }

               const user= await client.user.findUnique({
                    where:{
                        email: credentials.email
                    },
                })

                if(!user) {
                    const HashedPassword=await bcrypt.hash(credentials.password, 10);
                    const newUser= await client.user.create({
                        data:{
                            email: credentials.email,
                            password: HashedPassword,
                        }
                    })
                    return newUser;
                }

                const isPasswordValid= await bcrypt.compare(credentials.password, user.password as string);
                if(!isPasswordValid) return null;

                return user;
            }
        }),
    

        Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],

    callbacks:{
     async jwt({ token, user, account }:jwtProps) {
       if (user) {
        token.id = user.id;
        token.email = user.email;
       token.name = user.name;
     }

     if (account) {
       token.accessToken = account.access_token;
     }

  return token;
},
      async session({session,token}:jwtProps){
            if(token){
                session.user.email=token.email;
                session.user.id=token.id;
                session.user.name=token.name;
            }
            return session;
        }
    },

    // pages:{
    //     signIn:"/auth/signin"
    // },
    session:{
        strategy:"jwt"
    },
    
    secret:process.env.NEXTAUTH_SECRET,
}