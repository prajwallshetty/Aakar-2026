import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const { nextUrl } = req;
    const isAuthApiRoute = nextUrl.pathname.startsWith("/api/auth");
    const isAdminLoginRoute = nextUrl.pathname.toLowerCase().startsWith("/adminlogin");

    if (isAuthApiRoute || isAdminLoginRoute) {
        return NextResponse.next();
    }

    if (!req.auth?.user?.email) {
        return NextResponse.redirect(new URL("/AdminLogin", nextUrl));
    }
    return NextResponse.next();
});

// export default auth(async (req, ctx) => {
//     const publicPages = ["/adminlogin"];

//     if (req.auth?.user?.email) {
//         if (publicPages.includes(req.nextUrl.pathname.toLowerCase())) {
//             const adminCheckResponse = await fetch(req.nextUrl.origin + "/api/isAdmin", {
//                 body: JSON.stringify({ email: req.auth.user.email }),
//                 method: "POST"
//             });
//             const adminData = await adminCheckResponse.json();

//             if (adminData.isAdmin) {
//                 return NextResponse.redirect(req.nextUrl.origin + '/AdminPortal');
//             } else {
//                 return NextResponse.redirect(req.nextUrl.origin + '/Participants');
//             }
//         }

//         const adminProtected = ["/adminportal", "/eventscrud", "/participants"];
//         if (adminProtected.includes(req.nextUrl.pathname.toLowerCase())) {
//             const adminCheckResponse = await fetch(req.nextUrl.origin + "/api/isAdmin", {
//                 body: JSON.stringify({ email: req.auth.user.email||"" }),
//                 method: "POST"
//             });
//             const adminData = await adminCheckResponse.json();

//             if (!adminData.isAdmin) {
//                 return NextResponse.redirect(req.nextUrl.origin + '/AdminLogin');
//             }
//         }

//         return NextResponse.next();
//     } else if (!publicPages.includes(req.nextUrl.pathname.toLowerCase())) {
//         return NextResponse.redirect(req.nextUrl.origin + '/AdminLogin');
//     }
// });

export const config = {
    matcher: [
        '/AdminLogin',
        '/AdminPortal',
        '/MerchOrders',
        '/EventsCRUD',
        '/Participants',
        '/Participants/:id',
        "/EventStatistics",
        "/CollegeStatistics",
        "/api/:path*",
    ]
}