import { Router } from 'express';
import { authenticateToken } from '../auth.js';
import { bookings } from'../data/index.js';
import { serializeDates } from '../utils/serialize.js';
const router = Router();

router.get('/me/bookings', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    const userBookings = bookings.filter((booking) => booking.userId === user.id);
    res.json(serializeDates(userBookings));
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

export default router;
