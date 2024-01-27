import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'

import routes from './src/routes'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`)
})
