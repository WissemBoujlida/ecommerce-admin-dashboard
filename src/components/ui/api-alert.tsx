"use client";

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

export function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  function onCopy() {
    navigator.clipboard.writeText(description);
    toast.success("copied to clipboard");
  }

  return (
    <Alert className="flex flex-col space-y-4">
      <Server className="size-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge
          className="capitalize"
          variant={variant === "public" ? "secondary" : "destructive"}
        >
          {variant}
        </Badge>
      </AlertTitle>

      <AlertDescription className="mt-4 flex items-center justify-between w-full">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-black font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="size-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
