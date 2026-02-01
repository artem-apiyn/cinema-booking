
export interface User {
  id: number
  username: string
}

export interface Movie {
  id: number
  title: string
  description: string
  year: number
  lengthMinutes: number
  posterImage: string
  rating: number
}

export interface Cinema {
  id: number
  name: string
  address: string
}

export interface MovieSession {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

export interface Seat {
  rowNumber: number
  seatNumber: number
}

export interface Seats {
  rows: number
  seatsPerRow: number
}

export interface MovieSessionDetails extends MovieSession {
  seats: Seats
  bookedSeats: Seat[]
}

export interface Booking {
  id: string
  userId: number
  movieSessionId: number
  seats: Seat[]
  bookedAt: string
  isPaid: boolean
}

export interface Settings {
  bookingPaymentTimeSeconds: number
}

export interface AuthResponse {
  token: string
}

export interface BookingResponse {
  bookingId: string
}

export interface PaymentResponse {
  message: string
}

export interface ErrorResponse {
  message: string
  error?: string
}

export interface ZodError {
  errors?: Array<{
    path: (string | number)[]
    message: string
  }>
}

export interface ApiError {
  data?: ErrorResponse
  message?: string
  statusCode?: number
}