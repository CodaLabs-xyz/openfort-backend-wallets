import { NextRequest, NextResponse } from 'next/server';
import openfort, { CHAIN_ID, POLICY_ID } from '@/lib/openfort-admin';
import crypto from 'crypto';

export const runtime = 'nodejs';

interface BatchMintRequest {
  accountId: string;
  contractAddress: string;
  recipients: string[];
  idempotencyKey?: string; // Client can provide for retry safety
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchMintRequest = await request.json();
    const { accountId, contractAddress, recipients, idempotencyKey } = body;

    // Validate required fields
    if (!accountId || !contractAddress || !recipients?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: accountId, contractAddress, recipients' },
        { status: 400 }
      );
    }

    // Use provided idempotencyKey or generate one
    // IMPORTANT: For retries, client should send the same idempotencyKey
    const finalIdempotencyKey = idempotencyKey || crypto.randomUUID();

    // Create transaction intent for batch mint
    const transactionIntent = await openfort.transactionIntents.create({
      account: accountId,
      chainId: CHAIN_ID,
      policy: POLICY_ID,
      interactions: recipients.map((recipient: string, index: number) => ({
        contract: contractAddress,
        functionName: 'mint',
        functionArgs: [recipient, index + 1],
      })),
      idempotencyKey: finalIdempotencyKey,
    });

    return NextResponse.json({
      transactionId: transactionIntent.id,
      status: transactionIntent.state,
      idempotencyKey: finalIdempotencyKey,
      recipientCount: recipients.length,
    });
  } catch (error: any) {
    // Check if this is a duplicate request (idempotency key already used)
    if (error.code === 'idempotency_key_in_use') {
      return NextResponse.json(
        { error: 'This batch is already being processed', code: 'DUPLICATE_REQUEST' },
        { status: 409 }
      );
    }

    console.error('Batch mint failed:', error);
    return NextResponse.json(
      { error: 'Failed to process batch mint' },
      { status: 500 }
    );
  }
}
