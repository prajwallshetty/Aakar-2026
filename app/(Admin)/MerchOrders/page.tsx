import MerchOrders from "@/components/(Admin)/MerchOrders";
import { auth } from "@/auth";
import { isAdmin } from "@/backend/admin";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/AdminLogin");
  }

  const admin = await isAdmin(session.user.email);
  if (!admin) {
    redirect("/AdminLogin");
  }

  return <MerchOrders />;
}