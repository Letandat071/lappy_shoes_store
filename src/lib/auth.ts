import { cookies } from 'next/headers';
import * as jose from 'jose';
import Admin from '@/models/Admin';
import connectDB from './mongoose';

export async function getAdminFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jose.jwtVerify(token, secret);
    const adminId = payload.adminId;
    if (!adminId) return null;
    
    await connectDB();
    const admin = await Admin.findById(adminId);
    return admin;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
} 