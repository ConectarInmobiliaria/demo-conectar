// lib/auth.js
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {}
        if (!email || !password) throw new Error('Email y contraseña requeridos')
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) throw new Error('Email o contraseña incorrectos')
        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) throw new Error('Email o contraseña incorrectos')
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user.role || 'INQUILINO').toUpperCase()
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {}
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}

export default NextAuth(authOptions)
