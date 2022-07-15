import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'

export type GetDataRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
) => Router

export const getDataHandler = async (
  user: mongoose.Model<UserType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = get(req, 'body.decoded', undefined)

  if (!email?.length) return res.sendStatus(401)

  const foundUser = await user.findOne(
    { email },
    {
      _id: false,
      password: false,
    }
  )

  if (!foundUser) return res.sendStatus(404)

  return res.status(200).send(foundUser)
}

export const makeGetDataRoute: GetDataRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
): Router => {
  return router.get('/data', (req, res) => getDataHandler(user, req, res))
}
