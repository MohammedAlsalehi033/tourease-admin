// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req) {
//   // Retrieve the session token. The secret is required for decryption.
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
//   // Get the pathname from the request URL.
//   const { pathname } = req.nextUrl;

//   // Log the middleware trigger for debugging purposes.
//   console.log(`Middleware triggered for path: ${pathname}`);

//   // If there is no token, the user is not authenticated.
//   // Redirect them to the login page.
//   if (!token) {
//     console.log('No token found, redirecting to /login');
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // If a token exists, the user is authenticated.
//   // Allow the request to proceed.
//   return NextResponse.next();
// }

// export const config = {
//   // This matcher configuration applies the middleware to all paths
//   // EXCEPT for the following:
//   // - /api/:path* (API routes)
//   // - /_next/static/:path* (Next.js static files)
//   // - /_next/image/:path* (Next.js image optimization files)
//   // - /favicon.ico    (The site's favicon)
//   // - /login          (The login page itself, to prevent redirect loops)
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
// };



import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Allow access to login, signup, and public files
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)'],
};