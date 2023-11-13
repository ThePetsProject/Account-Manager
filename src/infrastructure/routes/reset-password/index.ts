import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { PwdRecoverTokenType } from '@src/infrastructure/database/models/pwd-recovery-token'
import { UserType } from '@src/infrastructure/database/models/user'

export type ResetPwdRecoverRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>
) => Router

export const resetPwdRecoveryHandler = async (
  pwdRecoveryTokenModel: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const { password, token } = req.body

  if (!(password?.length && token?.length)) return res.sendStatus(400)

  const foundToken = await pwdRecoveryTokenModel.findOne({ token })

  if (!foundToken) return res.status(404).send({ message: 'No token' })

  const foundUser = await user.findOneAndUpdate(
    { _id: foundToken.accountId },
    { password }
  )

  if (!foundUser) return res.status(404).send({ message: 'No user' })

  await foundToken.deleteOne()

  return res.sendStatus(204)
}

export const makeResetPwdRecoveryRoute: ResetPwdRecoverRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>
): Router => {
  return router.post('/reset', (req, res) =>
    resetPwdRecoveryHandler(token, user, req, res)
  )
}
