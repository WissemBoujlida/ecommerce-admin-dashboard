import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ storeId: string }>;
  },
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // use clerk to authenticate the route
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // parse the request body
    const body = await req.json();

    // destruct required fields from req body
    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      colorId,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        images: {
          createMany: {
            data: images,
          },
        },
        isArchived,
        isFeatured,
        storeId,
        categoryId,
        sizeId,
        colorId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
