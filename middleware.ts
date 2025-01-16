import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import sql from '@/lib/db';

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const session = auth().protect();
    const dbUserId = session.userId.replace('user_', '');
    
    console.log('Debug Info:', {
      path: request.nextUrl.pathname,
      fullUserId: session.userId,
      dbUserId: dbUserId
    });

    try {
      const userCheck = await sql`
        SELECT * FROM user_roles 
        WHERE user_id = ${dbUserId}
      `;
      
      console.log('Database check:', userCheck);

      if (!userCheck.length) {
        console.log('No user found in database');
        return Response.redirect(new URL('/', request.url));
      }

      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (userCheck[0].role !== 'admin') {
          return Response.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      return Response.redirect(new URL('/', request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
