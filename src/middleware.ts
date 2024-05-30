// import { NextResponse , NextRequest } from 'next/server'
// export {default} from 'next-auth/middleware'
// import { getToken } from "next-auth/jwt"
// import { NextURL } from 'next/dist/server/web/next-url'
 
// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     const token = await getToken({req : request})
//     const url = request.nextUrl

//     if(token && (url.pathname.startsWith('/sign-in'))|| 
//                 (url.pathname.startsWith('/sign-up')) ||
//                 (url.pathname.startsWith('/verify')) ||
//                 (url.pathname.startsWith('/')) 
//             )
//         {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         }

//   return NextResponse.redirect(new URL('/home', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/sign-in',
//             '/sign-up',
//             '/dashboard',
//             '/verify/:path*',

//   ],
// }


// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   // Redirect to dashboard if the user is already authenticated
//   // and trying to access sign-in, sign-up, or home page
//   if (
//     token &&
//     (url.pathname.startsWith('/sign-in') ||
//       url.pathname.startsWith('/sign-up') ||
//       url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (!token && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }

import { NextResponse, NextRequest } from 'next/server';
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    if (
      url.pathname.startsWith('/sign-in') || 
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/sign-in', 
    '/sign-up', 
    '/', 
    '/verify/:path*'
  ],
};