import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";

// Định nghĩa interface cho Google Profile
interface GoogleProfile {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập email và mật khẩu');
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user || !user.password) {
          throw new Error('Email hoặc mật khẩu không đúng');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordMatch) {
          throw new Error('Email hoặc mật khẩu không đúng');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar
        };
      }
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          const googleProfile = profile as GoogleProfile;
          if (!googleProfile?.sub) {
            throw new Error('Không thể lấy thông tin từ Google');
          }
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              avatar: googleProfile.picture || null,
              role: 'user',
              googleId: googleProfile.sub
            });
            
            user.id = newUser._id.toString();
            user.role = 'user';
          } else {
            if (!existingUser.googleId) {
              existingUser.googleId = googleProfile.sub;
              existingUser.avatar = googleProfile.picture || existingUser.avatar;
              await existingUser.save();
            }
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Có lỗi xảy ra khi đăng nhập với Google');
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 