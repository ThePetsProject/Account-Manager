import { Request, Response, NextFunction } from 'express'
import axios, { AxiosRequestConfig } from 'axios'
import { get, set } from 'lodash'

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtUrl = `${process.env.JWT_MANAGER_URL}/${process.env.JWT_MANAGER_VALIDATE_PATH}`

  const authHeader = req.headers['authorization']

  if (!authHeader) return res.sendStatus(401)

  const bearer = authHeader.split(' ')
  const bearerToken = bearer[1]

  const axiosConfig: AxiosRequestConfig = {
    url: jwtUrl,
    method: 'POST',
    data: {
      token: bearerToken,
    },
  }

  return axios
    .request(axiosConfig)
    .then((response) => {
      const email = get(response, 'data.email', '')
      set(req, 'body.decoded.email', email)
      return next()
    })
    .catch(() => res.sendStatus(401))
}
