import { Router } from 'express';
import { settings } from'../data/index.js';

const router = Router();

router.get('/settings', async (req, res) => {
  res.json(settings);
});

export default router;