import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("sign-in");
  }
  // find the first store associated with the active user
  // if failed to retreive the first store then no store are associated with the active user
  // => keep user inside the root route (render the create store modal)
  // else redirect the active user to the dashboard route

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}
