import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value || "";
    const isPublic = path === "/";
    if (isPublic && token) {
        return NextResponse.redirect(new URL("/users", request.url));
    }
    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    '/',          
    '/users',
    '/tasks',
    '/generateinvoice',     
    
  ],
};

