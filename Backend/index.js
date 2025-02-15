import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import router from './Routes/appointmentRoutes.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(bodyParser.json())

app.use('/api',router)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
