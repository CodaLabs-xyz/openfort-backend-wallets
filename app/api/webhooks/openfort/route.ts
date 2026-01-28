import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

const WEBHOOK_SECRET = process.env.OPENFORT_WEBHOOK_SECRET!;

function verifyWebhook(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('OPENFORT_WEBHOOK_SECRET not configured');
    return false;
  }

  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('x-openfort-signature') || '';

  if (!verifyWebhook(payload, signature)) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(payload);

  console.log(`Received webhook: ${event.type}`, event.data?.id);

  switch (event.type) {
    case 'transaction_intent.succeeded':
      console.log('Transaction confirmed:', event.data.id);
      // TODO: Update your database
      // TODO: Notify users
      // TODO: Trigger downstream processes
      break;

    case 'transaction_intent.failed':
      console.error('Transaction failed:', event.data.id, event.data.error);
      // TODO: Handle failure
      // TODO: Implement retry logic if appropriate
      // TODO: Alert operations team
      break;

    case 'transaction_intent.pending':
      console.log('Transaction pending:', event.data.id);
      // TODO: Update status in database
      break;

    default:
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}
