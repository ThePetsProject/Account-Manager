import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { PwdRecoverTokenType } from '@src/infrastructure/database/models/pwd-recovery-token'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { UserType } from '@src/infrastructure/database/models/user'

export type SendPwdRecoveryRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>
) => Router

const generateRecoverUrl = (token: string) =>
  `${process.env.APP_BASE_URL}${process.env.RECOVER_PASSWORD_PATH}${token}`

export const sendPwdRecoveryHandler = async (
  pwdRecoveryTokenModel: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body

  if (!email?.length) return res.sendStatus(401)

  const foundUser = await user.findOne({ email })

  if (!foundUser) return res.sendStatus(404)

  const recoveryToken = uuidv4()

  const recoverUrl = generateRecoverUrl(recoveryToken)

  const newToken = pwdRecoveryTokenModel.create({
    accountId: foundUser._id,
    token: recoveryToken,
  })

  if (!newToken) return res.sendStatus(500)

  const axiosConfig = {
    method: 'post',
    url: `${process.env.MESSAGE_MANAGER_URL}/${process.env.MESSAGE_MANAGER_RECOVER_PWD_PATH}`,
    data: {
      recoverUrl,
      toEmail: email,
    },
  }

  return axios
    .request(axiosConfig)
    .then((response) => {
      return res.sendStatus(200)
    })
    .catch((e) => res.status(500).send(e.message))
}

export const makeSendPwdRecoveryRoute: SendPwdRecoveryRouteFnType = (
  router: Router,
  token: mongoose.Model<PwdRecoverTokenType>,
  user: mongoose.Model<UserType>
): Router => {
  return router.post('/', (req, res) =>
    sendPwdRecoveryHandler(token, user, req, res)
  )
}
