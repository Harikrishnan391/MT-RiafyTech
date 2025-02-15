document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date')
  const timeSelect = document.getElementById('time')
  const form = document.getElementById('appointmentForm')
  const message = document.getElementById('message')

  const API_BASE = 'http://localhost:3000/api'

  // Fetch available time slots when a date is selected
  dateInput.addEventListener('change', async () => {
    const selectedDate = dateInput.value
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      message.textContent = 'You cannot select a past date.'
      message.style.color = 'red'
      timeSelect.innerHTML =
        '<option value="">Select a valid date first</option>'
      return
    } else {
      message.textContent = ''
    }

    if (!selectedDate) return

    try {
      const response = await fetch(
        `${API_BASE}/available-slots?date=${selectedDate}`
      )
      const data = await response.json()

      timeSelect.innerHTML = '<option value="">Select a time</option>'
      data.availableSlots.forEach((slot) => {
        const option = document.createElement('option')
        option.value = slot
        option.textContent = slot
        timeSelect.appendChild(option)
      })
    } catch (error) {
      console.error('Error fetching available slots:', error)
    }
  })

  // Handle form submission (Booking an appointment)
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const date = dateInput.value
    const time = timeSelect.value

    if (!name || !phone || !date || !time) {
      message.textContent = 'Please fill all fields.'
      message.style.color = 'red'
      return
    }

    try {
      const response = await fetch(`${API_BASE}/book-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, date, time }),
      })

      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        message.textContent = data.message || 'Failed to book appointment.'
        message.style.color = 'red'
        return
      }

      message.textContent = 'Appointment booked successfully!'
      message.style.color = 'green'
      form.reset()
    } catch (error) {
      console.error('Error booking appointment:', error)
      message.textContent = 'Error booking appointment.'
      message.style.color = 'red'
    }
  })
})
