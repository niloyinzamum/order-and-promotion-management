import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!); // Convert the secret to a Uint8Array

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
        await jwtVerify(token, jwtSecret);
        return NextResponse.next();
    } catch (error) {
        console.error('Invalid token:', error);
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
}

export const config = {
    matcher: [
        '/promotion-management/:path*',
        '/product-management/:path*',
        '/order-management/:path*',
    ],
};