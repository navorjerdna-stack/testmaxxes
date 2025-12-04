import { NextRequest, NextResponse } from 'next/server';
import { stripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' },
        { status: 503 }
      );
    }

    if (!SUBSCRIPTION_PRICE_ID) {
      return NextResponse.json(
        { error: 'Stripe price ID is not configured. Please set STRIPE_PRICE_ID.' },
        { status: 503 }
      );
    }

    const { userId, userEmail } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get the origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      customer_email: userEmail || undefined,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
