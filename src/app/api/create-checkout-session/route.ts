import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Lazy initialization of Stripe to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });
  }
  return stripeInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { planId, price, interval } = await req.json();

    // Get Stripe instance (will throw if key not configured)
    const stripe = getStripe();

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
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
