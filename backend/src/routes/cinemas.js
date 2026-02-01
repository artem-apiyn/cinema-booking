import { Router } from 'express';
import { cinemas, movieSessions } from'../data/index.js';
import { serializeDates } from '../utils/serialize.js';

const router = Router();

router.get('/cinemas', async (req, res) => {
  res.json(cinemas);
});

router.get('/cinemas/:cinemaId/sessions', (req, res) => {
  const cinemaId = Number.parseInt(req.params.cinemaId);
  const cinema = cinemas.find((c) => c.id === cinemaId);
  if (!cinema) {
    return res.status(404).json({ message: 'Кинотеатр не найден' });
  }

  const sessions = movieSessions
    .filter((s) => s.cinemaId === cinemaId)
    .map(({ seats, ...session }) => session);
  res.json(serializeDates(sessions));
});

export default router;
