import mongoose from 'mongoose'

export type PwdRecoverTokenType = mongoose.Model<any> & {
  token: string
  expireAt: Date
  createdAt: Date
  accountId: mongoose.Types.ObjectId
}

const { Schema } = mongoose

const pwdRecoverTokenData = {
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    trim: true,
    required: true,
    index: {
      unique: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    expires: '2h',
    default: Date.now,
  },
}

const pwdRecoverTokenSchema = new Schema(pwdRecoverTokenData)
pwdRecoverTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export const PwdRecoverToken = mongoose.model<PwdRecoverTokenType>(
  'PwdRecoverToken',
  pwdRecoverTokenSchema,
  'pwdRecoverTokens'
)
