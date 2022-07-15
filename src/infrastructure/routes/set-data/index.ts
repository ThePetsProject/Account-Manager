import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'

export type SetDataRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
) => Router

interface UserDataPayload {
  email: string
  name?: string
  surName?: string
  password?: string
}

export const setDataHandler = async (
  user: mongoose.Model<UserType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const email = get(req, 'body.email', undefined)

  if (!email?.length) return res.sendStatus(401)

  let payload = {} as UserDataPayload

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      payload[key as keyof UserDataPayload] = req.body[key]
    }
  }

  const foundUser = await user.findOneAndUpdate({ email }, payload)

  if (!foundUser) return res.sendStatus(404)

  if (payload.password) {
    foundUser.password = payload.password
    const newUser = await foundUser.save()
    if (!newUser) return res.sendStatus(500)
  }

  return res.status(200).send({})
}

export const makeSetDataRoute: SetDataRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
): Router => {
  return router.post('/data', (req, res) => setDataHandler(user, req, res))
}
