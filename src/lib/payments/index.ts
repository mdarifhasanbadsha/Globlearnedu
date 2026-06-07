import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export async function createPaymentIntent(amount: number, currency: string, metadata: Record<string, string>) {
  return stripe.paymentIntents.create({ amount, currency, metadata });
}

export async function retrievePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id);
}
