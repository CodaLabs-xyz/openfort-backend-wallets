# Openfort Backend Wallets Demo

This project demonstrates how to use Openfort backend wallets for server-side operations like batch minting NFTs.

## Features

- **Backend Wallets**: Create developer-controlled wallets with TEE security
- **Batch Minting**: Mint multiple NFTs in a single transaction
- **Idempotency**: Safe retry handling for failed operations
- **Webhooks**: Real-time transaction status updates

## Getting Started

### Prerequisites

- Node.js 18+
- Openfort account with API keys
- A deployed NFT contract (optional for testing)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `OPENFORT_SECRET_KEY` - Your Openfort secret key (sk_...)
- `OPENFORT_POLICY_ID` - Gas sponsorship policy ID
- `OPENFORT_WEBHOOK_SECRET` - For verifying webhook signatures

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the admin dashboard.

## API Endpoints

### POST /api/wallet/create

Creates a new backend wallet.

```json
{
  "name": "treasury",
  "chainId": 80002
}
```

### POST /api/batch-mint

Mints multiple NFTs in a single transaction.

```json
{
  "accountId": "acc_...",
  "contractAddress": "0x...",
  "recipients": ["0x...", "0x..."],
  "idempotencyKey": "optional-uuid"
}
```

### POST /api/webhooks/openfort

Receives webhook events from Openfort. Configure in your dashboard.

## Project Structure

```
code-example/
├── app/
│   ├── api/
│   │   ├── batch-mint/route.ts      # Batch minting endpoint
│   │   ├── wallet/create/route.ts   # Wallet creation endpoint
│   │   └── webhooks/openfort/route.ts # Webhook handler
│   ├── page.tsx                     # Admin dashboard
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── openfort-admin.ts            # Openfort client setup
│   └── utils.ts                     # Utility functions
└── package.json
```

## Security Considerations

1. **Never expose your secret key** - Keep `OPENFORT_SECRET_KEY` server-side only
2. **Verify webhooks** - Always validate webhook signatures
3. **Use idempotency keys** - Prevent duplicate transactions on retries
4. **Monitor transactions** - Set up alerts for failed operations

## Learn More

- [Openfort Documentation](https://openfort.io/docs)
- [Backend Wallets Guide](https://openfort.io/docs/guides/backend-wallets)
- [Webhooks Guide](https://openfort.io/docs/guides/webhooks)
