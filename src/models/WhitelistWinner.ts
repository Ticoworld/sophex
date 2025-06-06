import { Schema, model, models } from 'mongoose';

const winnerSchema = new Schema({
  twitterId: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v),
      message: 'Invalid Ethereum wallet address',
    },
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model redefinition in Next.js hot reload
export const WhitelistWinner = models.WhitelistWinner || model('WhitelistWinner', winnerSchema);