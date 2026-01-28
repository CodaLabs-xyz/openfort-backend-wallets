import Openfort from '@openfort/openfort-node';

if (!process.env.OPENFORT_SECRET_KEY) {
  throw new Error('OPENFORT_SECRET_KEY environment variable is not set');
}

const openfort = new Openfort(process.env.OPENFORT_SECRET_KEY);

export default openfort;

// Configuration constants
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002');
export const POLICY_ID = process.env.OPENFORT_POLICY_ID;
