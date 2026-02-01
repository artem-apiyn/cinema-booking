import { Router } from 'express';
import { bookings } from'../data/index.js';
import { authenticateToken } from '../auth.js';

const router = Router();

router.post('/bookings/:bookingId/payments', authenticateToken, (req, res) => {
  try {
    const bookingToPay = bookings.find(({ id }) => id === req.params.bookingId);

    if (!bookingToPay) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    if (bookingToPay.isPaid) {
      return res.status(409).json({ message: 'Бронирование уже оплачено' });
    }

    bookingToPay.isPaid = true;
    res.json({ message: 'Бронирование успешно оплачено' });
  } catch (error) {
    console.error('Ошибка при оплате бронирования:', error);
    res.status(500).json({ message: 'Ошибка при оплате бронирования' });
  }
});

export default router;
