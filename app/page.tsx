'use client';

import { useState } from 'react';
import { Wallet, Package, Bell, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<string | null>(null);

  const createWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'treasury', chainId: 80002 }),
      });
      const data = await response.json();
      setWalletAddress(data.address);
      setAccountId(data.id);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerBatchMint = async () => {
    if (!accountId) return;
    setLoading(true);
    setMintStatus('Processing...');
    try {
      const response = await fetch('/api/batch-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT || '0x...',
          recipients: [
            '0x1234567890123456789012345678901234567890',
            '0x2345678901234567890123456789012345678901',
            '0x3456789012345678901234567890123456789012',
          ],
        }),
      });
      const data = await response.json();
      setMintStatus(`Transaction: ${data.transactionId} - Status: ${data.status}`);
    } catch (error) {
      setMintStatus('Failed to mint');
      console.error('Failed to batch mint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Wallets Admin</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Backend Wallet
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Create a developer-controlled wallet
              </p>
            </div>
            <div className="p-6">
              {walletAddress ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Address:</p>
                  <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                    {walletAddress}
                  </code>
                </div>
              ) : (
                <button
                  onClick={createWallet}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Wallet
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Batch Mint
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Mint multiple NFTs in one transaction
              </p>
            </div>
            <div className="p-6">
              <button
                onClick={triggerBatchMint}
                disabled={!accountId || loading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mint 3 NFTs
              </button>
              {mintStatus && (
                <p className="mt-2 text-sm text-gray-600">{mintStatus}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm md:col-span-2">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Webhook Events
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Real-time transaction updates (check server logs)
              </p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500">
                Webhook endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/webhooks/openfort</code>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Configure this URL in your Openfort dashboard to receive transaction notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
