import { NextRequest, NextResponse } from 'next/server';
import openfort, { CHAIN_ID } from '@/lib/openfort-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, chainId } = await request.json();

    // Create a developer account (backend wallet)
    const account = await openfort.accounts.create({
      chainId: chainId || CHAIN_ID,
    });

    return NextResponse.json({
      id: account.id,
      address: account.address,
      chainId: account.chainId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to create wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}
