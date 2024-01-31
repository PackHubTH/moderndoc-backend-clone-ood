import prisma from '@prisma'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'

import routes from './src/routes'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
app.use('/api', routes)

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`)

  await prisma.student.create({
    data: {
      studentNumber: '63070506969',
      userId: 'bf9d1046-5bf4-4660-8ba5-4971c647c944',
      courseId: '1e97faa3-4301-452d-99f6-e304a8a4a3f9',
      isApproved: true,
    },
  })
})
