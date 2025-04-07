import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(async (req, ctx) => {
    const publicPages = ["/adminlogin"];

    if (req.auth?.user?.email) {
        if (publicPages.includes(req.nextUrl.pathname.toLowerCase())) {
            const adminCheckResponse = await fetch(req.nextUrl.origin + "/api/isAdmin", {
                body: JSON.stringify({ email: req.auth.user.email }),
                method: "POST"
            });
            const adminData = await adminCheckResponse.json();

            if (adminData.isAdmin) {
                return NextResponse.redirect(req.nextUrl.origin + '/AdminPortal');
            } else {
                return NextResponse.redirect(req.nextUrl.origin + '/');
            }
        }

        const adminProtected = ["/adminportal", "/eventscrud"];
        if (adminProtected.includes(req.nextUrl.pathname.toLowerCase())) {
            const adminCheckResponse = await fetch(req.nextUrl.origin + "/api/isAdmin", {
                body: JSON.stringify({ email: req.auth.user.email }),
                method: "POST"
            });
            const adminData = await adminCheckResponse.json();

            if (!adminData.isAdmin) {
                return NextResponse.redirect(req.nextUrl.origin + '/profile');
            }
        }

        return NextResponse.next();
    } else if (!publicPages.includes(req.nextUrl.pathname.toLowerCase())) {
        return NextResponse.redirect(req.nextUrl.origin);
    }
});

export const config = {
    matcher: [
        '/AdminLogin',
        '/AdminPortal',
        '/EventCRUD'
    ]
}