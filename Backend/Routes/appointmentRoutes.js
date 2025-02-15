import express from 'express'
import {
  getAvailableSlots,
  bookAppointment,
} from '../controller/appointmentController.js'

const router = express.Router()

router.get('/available-slots', getAvailableSlots)
router.post('/book-appointment', bookAppointment)

export default router
