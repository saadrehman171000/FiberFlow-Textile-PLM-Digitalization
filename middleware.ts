import { authMiddleware } from "@clerk/nextjs/server";
import sql from '@/lib/db';

// Simple in-memory cache for location data
const locationCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getPublicIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return null;
  }
};

const getLocationData = async (ip: string) => {
  try {
    const response = await fetch(`https://api.db-ip.com/v2/free/${ip}`);
    
    if (!response.ok) return null;
    
    const data = await response.json();

    return {
      country: data.countryName,
      city: data.city,
      region: data.stateProv,
      lat: null,
      lon: null,
      timezone: 'Asia/Karachi',
      isp: 'PTCL',
      ip: ip
    };
  } catch (error) {
    return null;
  }
};

const middleware = authMiddleware({
  publicRoutes: ["/"],
  async afterAuth(auth, req) {
    if (!auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      const homeUrl = new URL('/', req.url);
      return Response.redirect(homeUrl);
    }

    if (auth.userId) {
      try {
        let ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                req.headers.get('x-real-ip') || 
                req.headers.get('cf-connecting-ip') || 
                '127.0.0.1';

        if (process.env.NODE_ENV === 'development' || ip === '::1' || ip === '127.0.0.1') {
          const publicIp = await getPublicIp();
          if (publicIp) ip = publicIp;
        }

        await sql`
          UPDATE user_roles 
          SET 
            last_login_at = CURRENT_TIMESTAMP,
            ip_address = ${ip}
          WHERE user_id = ${auth.userId.replace('user_', '')}
        `;

        const cacheKey = `${auth.userId}-${ip}`;
        const cachedData = locationCache.get(cacheKey);
        
        if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
          return;
        }

        const locationData = await getLocationData(ip);
        if (!locationData) return;

        locationCache.set(cacheKey, {
          data: locationData,
          timestamp: Date.now()
        });

        await sql`
          UPDATE user_roles 
          SET 
            location = ${JSON.stringify(locationData)}::jsonb
          WHERE user_id = ${auth.userId.replace('user_', '')}
        `;
      } catch (error) {
        // Silent fail in production
      }
    }

    // If trying to access admin routes, verify admin status
    if (req.nextUrl.pathname.startsWith('/admin')) {
      try {
        const adminCheck = await sql`
          SELECT role FROM user_roles 
          WHERE user_id = ${auth.userId?.replace('user_', '')}
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
