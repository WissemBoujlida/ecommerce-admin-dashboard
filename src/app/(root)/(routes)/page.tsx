"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

export default function Root() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // with this, if we try to close the StoreModal, we can't
  // that's the exact behaviour we want from the StoreModal
  // because the StoreModal is going to hold the create store form
  // and is going to redirect once the first store is created
  // from the navigation bar we are able to close it
  // but if the user is at the root page, that means that the user don't have any store created yet
  // and we don't want to allow the user to go anywhere else besides this Modal.
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
