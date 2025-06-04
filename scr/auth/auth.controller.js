import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas: el usuario no existe.'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'Este usuario está desactivado.'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta.'
            });
        }

        const token = await generarJWT(user.id);

        // Redirección por rol
        let redirectTo = '';
        if (user.role === 'ADMIN') {
            redirectTo = '/admin/dashboard';
        } else if (user.role === 'CLIENT') {
            redirectTo = '/client/home';
        } else {
            redirectTo = '/unknown-role';
        }

        return res.status(200).json({
            msg: 'Login exitoso.',
            userDetails: {
                username: user.username,
                role: user.role,
                token: token,
                redirectTo: redirectTo
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error en el servidor.",
            error: e.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: encryptedPassword,
            role: data.role || 'CLIENT', // Rol por defecto CLIENT
            estado: true
        });

        return res.status(201).json({
            message: "¡Usuario registrado con éxito!",
            userDetails: {
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al registrar el usuario.",
            error: error.message
        });
    }
};
