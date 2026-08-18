# Doctor Appointment Frontend

A modern and responsive frontend for a Doctor Appointment Management System built with React, TypeScript, Vite, and Tailwind CSS.

The application allows patients to book appointments while providing an admin dashboard to manage appointments, patients, slots, and doctor information.

## 🚀 Features

### Patient Side

- Doctor profile and clinic information
- View available appointment dates
- View available time slots
- Select appointment date and time
- Patient details form
- Appointment confirmation
- Unique appointment token generation
- Booking confirmation with token number
- Responsive appointment booking modal
- Form validation
- Toast notifications

### Admin Dashboard

- Dashboard overview
- Total appointments
- Total patients
- Booked appointments
- Completed appointments
- Cancelled appointments
- Appointment management
- Appointment search
- Date filtering
- Appointment details modal
- Update appointment status
- Appointment pagination
- Slot management
- Create appointment slots
- Update appointment slots
- Delete appointment slots
- Slot pagination
- Loading states
- Error handling
- Toast notifications

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Ant Design
- Axios
- Lucide React
- React Icons
- JavaScript / TypeScript

## 📁 Project Structure

```text
doctor-appointment-frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.ts
│   │   ├── appointment.Api.ts
│   │   └── slotApi.ts
│   │
│   ├── components/
│   │   └── AppointmentModel.tsx
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Dashboard/
│   │   ├── Appointment/
│   │   └── Slot/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
