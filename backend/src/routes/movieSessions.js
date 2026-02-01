import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { movieSessions, bookings } from '../data/index.js';
import { authenticateToken } from '../auth.js';
import { serializeDates } from '../utils/serialize.js';

const router = Router();

router.get('/movieSessions/:movieSessionId', (req, res) => {
  const movieSessionId = Number.parseInt(req.params.movieSessionId);
  const movieSession = movieSessions.find((s) => s.id === movieSessionId);

  if (!movieSession) {
    return res.status(404).json({ message: 'Сеанс не найден' });
  }

  const sessionBookedSeats = bookings
    .filter((s) => s.movieSessionId === movieSessionId)
    .flatMap((s) => s.seats);

  res.json(serializeDates({ ...movieSession, bookedSeats: sessionBookedSeats }));
});

router.post('/movieSessions/:movieSessionId/bookings', authenticateToken, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }

  const movieSessionId = Number.parseInt(req.params.movieSessionId);
  const movieSession = movieSessions.find((s) => s.id === movieSessionId);

  if (!movieSession) {
    return res.status(404).json({ message: 'Сеанс не найден' });
  }

  const { seats } = req.body;

  if (!isValidSeats(seats, movieSession.seats.rows, movieSession.seats.seatsPerRow)) {
    return res.status(400).json({ message: 'Неверное тело запроса' });
  }

  const hasConflictedBooking = bookings.find(
    (booking) =>
      booking.movieSessionId === movieSessionId &&
      booking.seats.some((bookedSeat) =>
        seats.find(
          ({ rowNumber, seatNumber }) =>
            bookedSeat.rowNumber === rowNumber && bookedSeat.seatNumber === seatNumber
        )
      )
  );

  if (hasConflictedBooking) {
    return res.status(409).json({ message: 'Места уже забронированы' });
  }

  const newBooking = {
    id: uuidv4(),
    movieSessionId,
    userId: user.id,
    isPaid: false,
    seats,
    bookedAt: new Date(),
  };

  bookings.push(newBooking);

  res.status(200).json({ bookingId: newBooking.id });
});

function isValidSeats(seats, rowsNumber, seatsPerRow) {
  if (!Array.isArray(seats)) {
    return false;
  }

  if (!seats.length) {
    return false;
  }

  return seats.every(
    (seat) => isValidSeat(seat) && seat.rowNumber <= rowsNumber && seat.seatNumber <= seatsPerRow
  );
}

function isValidSeat(seat) {
  if (typeof seat !== 'object' || seat === null) {
    return false;
  }

  if (!seat.hasOwnProperty('rowNumber') || !seat.hasOwnProperty('seatNumber')) {
    return false;
  }

  const { rowNumber, seatNumber } = seat;

  if (
    typeof rowNumber !== 'number' ||
    typeof seatNumber !== 'number' ||
    !Number.isFinite(rowNumber) ||
    !Number.isFinite(seatNumber)
  ) {
    return false;
  }

  return rowNumber > 0 && seatNumber > 0;
}

export default router;
