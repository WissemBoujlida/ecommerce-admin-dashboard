"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";

// we're gonna add the ModalProvider inside the root layout.
// the root layout is a server component.
// when adding client components inside server components we have to ensure there will be no hydration erros,
// especially with Modals since there a lot of ways you can trigger a Modal
// and that can cause a synchronization error between the server side rendering and the client side rendering.
// for example: the server will not have any modal open but the client will and that is going to throw a hydration error.

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ensure that until the useEffect lifecycle has run which only happens in the client side, I return null
  // so if the Modal has not mounted, in server side rendering return null
  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
}
