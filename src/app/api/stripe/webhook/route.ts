import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateUser, getUser } from '@/lib/kv';
import Stripe from 'stripe';

// Helper to find user by Stripe customer ID
// In a production app, you would have an index or secondary lookup
// For now, we store the userId in the subscription metadata
// This is a limitation - in production, add a customerId -> userId mapping
async function findUserByCustomerId(_customerId: string): Promise<string | null> {
  return null;
}

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret is not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      
      if (userId) {
        const user = await getUser(userId);
        if (user) {
          await updateUser(userId, {
            isPaid: true,
            stripeCustomerId: session.customer as string,
          });
          console.log(`User ${userId} upgraded to paid`);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Try to find the user by customer ID
      // Note: In production, implement proper customer ID -> user ID mapping
      const userId = await findUserByCustomerId(customerId);
      
      if (userId) {
        const user = await getUser(userId);
        if (user && user.stripeCustomerId === customerId) {
          await updateUser(userId, {
            isPaid: false,
          });
          console.log(`User ${userId} downgraded (subscription canceled)`);
        }
      } else {
        // Log for monitoring - in production, set up proper alerting
        console.warn(`Subscription canceled for customer ${customerId} but user not found. Consider implementing customer ID indexing.`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      console.log(`Payment failed for customer ${customerId}`);
      // In production: Send email notification, retry logic, etc.
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
