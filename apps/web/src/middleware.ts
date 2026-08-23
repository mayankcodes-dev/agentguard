import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/',                    // landing page
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/demo(.*)',        // demo endpoints — no auth needed for hackathon demo
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
