import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Ruta de usuario funcionando');
});

export default router;
