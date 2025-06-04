"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[];
}

export function CategoryForm({ category, billboards }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
  });

  const title = category ? "Edit category" : "Create category";
  const description = category
    ? "Edit the billboard"
    : "Create a new billboard";

  const successToastMessage = category
    ? "Category updated"
    : "Category created";
  const errorToastMessage = category
    ? "Error updating category"
    : "Error creating category";
  const action = category ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: "",
      billboardId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (category) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(successToastMessage);
    } catch (error) {
      toast.error(errorToastMessage);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Trash className="size-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>

                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a billboard"
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem key={billboard.id} value={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
