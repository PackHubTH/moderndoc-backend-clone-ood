import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'

import routes from './src/routes'
import { sendEmail } from 'services/EmailService'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
app.use('/api', routes)

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`)
})
