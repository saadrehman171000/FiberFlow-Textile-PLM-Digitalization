import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import sql from '@/lib/db';

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, request) => {
  if (!request.nextUrl.pathname.startsWith('/clerk_')) {
    console.log('Request path:', request.nextUrl.pathname);
  }

  if (!isPublicRoute(request)) {
    const session = auth().protect();
    const dbUserId = session.userId.replace('user_', '');
    
    // Check if user exists in our database
    const userCheck = await sql`
      SELECT role FROM user_roles 
      WHERE user_id = ${dbUserId}
    `;

    // If user not in database, redirect to home
    if (!userCheck.length) {
      return Response.redirect(new URL('/', request.url));
    }

    // Admin routes check
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (userCheck[0].role !== 'admin') {
        return Response.redirect(new URL('/dashboard', request.url));
      }
    }

    // Dashboard routes check
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!['admin', 'user'].includes(userCheck[0].role)) {
        return Response.redirect(new URL('/', request.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
