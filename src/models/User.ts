import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  twitterId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  spinsUsed: {
    type: Number,
    default: 0,
    min: 0,
  },
  freeSpins: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastSpinDate: {
    type: Date,
    default: null,
  },
  whitelistWon: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = models.User || model('User', userSchema);