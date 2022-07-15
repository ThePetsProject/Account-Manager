import { Router } from 'express'
import { Response } from 'express'
import projectProperties from '@utils/project_properties'

export type HealthRouteFnType = (router: Router) => Router

export const formatTime = (seconds: number) => {
  const pad = (time: number) => (time < 10 ? '0' : '') + time
  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  seconds = Math.floor(seconds % 60)

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export const healthHandler = (res: Response): Response => {
  const healthMessage = {
    status: 'UP',
    up_time: formatTime(process.uptime()),
    info: {
      name: projectProperties.name,
      version: projectProperties.version,
    },
  }
  return res.status(200).send(healthMessage)
}

export const healthRoute: HealthRouteFnType = (router: Router): Router =>
  router.get('/', (req, res) => healthHandler(res))
