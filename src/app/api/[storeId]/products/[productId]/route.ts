import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> },
) {
  try {
    const { storeId, productId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> },
) {
  try {
    const { storeId, productId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
          createMany: {
            data: images,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> },
) {
  try {
    const { storeId, productId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
