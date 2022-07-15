import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { PwdRecoverTokenType } from '@src/infrastructure/database/models/pwd-recovery-token'
import { get } from 'lodash'

export type ValidatePwdRecoverRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>
) => Router

export const validatePwdRecoveryHandler = async (
  pwdRecoveryTokenModel: mongoose.Model<PwdRecoverTokenType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const token = get(req, 'body.token', undefined)

  if (!token?.length) return res.sendStatus(400)

  const foundToken = await pwdRecoveryTokenModel.findOne({ token })

  if (!foundToken) return res.sendStatus(404)

  return res.sendStatus(200)
}

export const makeValidatePwdRecoveryRoute: ValidatePwdRecoverRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>
): Router => {
  return router.post('/validate', (req, res) =>
    validatePwdRecoveryHandler(token, req, res)
  )
}
