import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { planId, price, interval } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `AI Companion - ${interval === "week" ? "Weekly" : "Monthly"} Access`,
              description: `Unlimited access to your AI companion for ${interval === "week" ? "1 week" : "1 month"}`,
            },
            unit_amount: price * 100, // Stripe expects amount in cents
            recurring: {
              interval: interval as "week" | "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/chat?success=true`,
      cancel_url: `${req.headers.get("origin")}/payment?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
