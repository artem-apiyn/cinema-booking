import { Router } from 'express';
import { movies, movieSessions } from'../data/index.js';
import { serializeDates } from '../utils/serialize.js';

const router = Router();

router.get('/movies', async (req, res) => {
  res.json(movies);
});


router.get('/movies/:movieId/sessions', async (req, res) => {
  const movieId = Number.parseInt(req.params.movieId);
  const movie = movies.find(({ id }) => id === movieId);

  if (!movie) {
    return res.status(404).json({ message: 'Фильм не найден' });
  }

  const sessions = movieSessions
    .filter((session) => session.movieId === movieId)
    .map(({ seats, ...session }) => session);

  res.json(serializeDates(sessions));
});

export default router;
