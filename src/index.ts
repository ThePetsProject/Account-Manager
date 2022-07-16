require('newrelic')
import app from './app'
import { mongoConnect } from './infrastructure/database/connect'
import displayRoutes from 'express-routemap'

const port = process.env.PORT

mongoConnect().then(() => {
  app.listen(port, async () => {
    console.log(`server is listening on ${port}`)
  })
})
