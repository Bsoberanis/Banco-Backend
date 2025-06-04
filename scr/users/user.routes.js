import { Router } from 'express';
import bcrypt from 'bcryptjs';

const router = Router();

const users = []; // Guardamos usuarios acá (simula una DB)

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  // Verificar si usuario ya existe
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario
  users.push({ name, email, password: hashedPassword });

  return res.status(201).json({ message: 'Usuario registrado correctamente' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Comparar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  return res.json({ message: 'Login exitoso' });
});

export default router;
