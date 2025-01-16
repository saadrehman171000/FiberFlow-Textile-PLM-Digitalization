import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navigation() {
  return (
    <nav>
      {/* ... other navigation items ... */}
      <Link href="/user-dashboard">Dashboard</Link>
      <UserButton afterSignOutUrl="/"/>
    </nav>
  );
} 