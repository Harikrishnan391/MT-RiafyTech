import Appointment from '../models/Appointment.js'

const availableSlots = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
]

export const getAvailableSlots = async (req, res) => {
  const { date } = req.query
  if (!date) return res.status(400).json({ message: 'Date is required' })
  try {
    const bookedAppointments = await Appointment.find({ date })
    const bookedTimes = bookedAppointments.map((appt) => appt.time)
    const slots = availableSlots.filter((slot) => !bookedTimes.includes(slot))
    res.json({ date, availableSlots: slots })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const bookAppointment = async (req, res) => {
  const { name, phone, date, time } = req.body
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    return res
      .status(400)
      .json({ message: 'Cannot book an appointment for a past date.' })
  }

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  try {
    const existingAppointment = await Appointment.findOne({ date, time })
    if (existingAppointment) {
      return res.status(400).json({ message: 'Slot already booked' })
    }
    const newAppointment = new Appointment({ name, phone, date, time })
    await newAppointment.save()
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}
