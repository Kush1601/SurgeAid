import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <DashboardClient />;
}
