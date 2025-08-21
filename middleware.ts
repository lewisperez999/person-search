import { auth } from "@/auth"

export default auth((req) => {
  // req.auth contains the user session
  // You can add custom logic here to protect specific routes
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}