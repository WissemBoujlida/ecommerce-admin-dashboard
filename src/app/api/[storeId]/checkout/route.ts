import { NextResponse } from "next/server";
import Stripe from "stripe";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

// the ckeckout route will not work from the storefront
// because CORS will prevent that
// because the storefront is on a different origin localhost:3001, the API is on localhost:3000
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// before the POST request we do the OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;

  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Products are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        unit_amount: product.price.toNumber() * 100,
        product_data: {
          name: product.name,
        },
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId,
      items: {
        create: productIds.map((productId: string) => ({
          productId,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.STOREFRONT_URL}/cart?success=1`,
    cancel_url: `${process.env.STOREFRONT_URL}/cart?cancel=1`,
    // once the user has paid, load this session and use the metadata to load the order and
    // update isPaid to true
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
