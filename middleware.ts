import { authMiddleware } from "@clerk/nextjs/server";
import sql from '@/lib/db';  // Use your custom db import

const middleware = authMiddleware({
  publicRoutes: ["/"],
  async afterAuth(auth, req) {
    // Block access to admin routes if not logged in
    if (!auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      const homeUrl = new URL('/', req.url);
      return Response.redirect(homeUrl);
    }

    // If trying to access admin routes, verify admin status
    if (req.nextUrl.pathname.startsWith('/admin')) {
      try {
        const adminCheck = await sql`
          SELECT role FROM user_roles 
          WHERE (user_id = ${auth.userId?.replace('user_', '')} OR user_id = ${auth.userId}) 
          AND role = 'admin'
        `;

        // If not an admin, redirect to home
        if (!adminCheck.length) {
          const homeUrl = new URL('/', req.url);
          return Response.redirect(homeUrl);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        const homeUrl = new URL('/', req.url);
        return Response.redirect(homeUrl);
      }
    }
  }
});

export default middleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
