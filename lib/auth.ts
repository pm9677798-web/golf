import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  subscriptionStatus: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<any> {
  const payload = verifyToken(token)
  if (!payload) return null

  // Support emergency admin bypass
  if (payload.userId === 'admin-bypass') {
    return {
      id: 'admin-bypass',
      email: 'admin@golfheart.com',
      first_name: 'Admin',
      last_name: 'User',
      subscription_status: 'active'
    }
  }

  const { data: user } = await (supabaseAdmin
    .from('users') as any)
    .select('*')
    .eq('id', payload.userId)
    .single()

  return user
}

export async function checkSubscriptionStatus(userId: string): Promise<boolean> {
  const { data: user } = await (supabaseAdmin
    .from('users') as any)
    .select('subscription_status, subscription_end_date')
    .eq('id', userId)
    .single()

  if (!user) return false

  if (user.subscription_status !== 'active') return false

  if (user.subscription_end_date && new Date(user.subscription_end_date) < new Date()) {
    // Update expired subscription
    await (supabaseAdmin
      .from('users') as any)
      .update({ subscription_status: 'inactive' })
      .eq('id', userId)
    return false
  }

  return true
}