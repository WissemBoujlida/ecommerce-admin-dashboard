"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  urls: string[];
}
export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  urls,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onUpload(result: any) {
    onChange(result.info.secure_url);
  }

  if (!isMounted) return null;
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {urls.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
            <Image src={url} alt="uploaded-img" fill className="object-cover" />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="ecommerce-admin-dashboard"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="size-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
