'use client'

import { UserDashboard } from "@/components/UserDashboard";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function UserDashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    redirect('/sign-in');
  }

  return <UserDashboard />;
}