import express from 'express'
import cors, { CorsOptions } from 'cors'
import { routesMaker } from './infrastructure/routes'
import { healthRoute } from './infrastructure/routes/health'
import validateJWT from './infrastructure/middlewares/jwt'

declare global {
  namespace Express {
    interface Request {
      email: string
    }
  }
}

const app = express()
const router = express.Router()

const corsOptions: CorsOptions = {
  origin: process.env.ENV === 'PRODUCTION' ? 'https://thepetsproject.org' : '*',
  optionsSuccessStatus: 200,
}

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const routes = routesMaker(router)
const dataRoutes = [routes.getDataRoute, routes.setDataRoute]

app.use('/api/v1/account/health', healthRoute(router))
app.use('/api/v1/account/secure', validateJWT, dataRoutes)
app.use('/api/v1/account/recover-password', [
  routes.pwdRecoveryRoute,
  routes.validatePwdRecoveryRoute,
])

export default app
