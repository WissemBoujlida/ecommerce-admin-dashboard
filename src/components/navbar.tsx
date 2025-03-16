import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";

export async function Navbar() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <div>dark/light mode</div>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
