'use strict';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';

// ✅ CORREGIR: cambiar scr → src
import limiter from '../scr/middlewares/validar-cant-peticiones.js';
import UserRoutes from '../scr/users/user.routes.js';

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const configurarRutas = (app) => {
    // RUTA para probar desde Postman:
    app.use("/ProyectoBanco/v1/user", UserRoutes);

    // Ruta simple para probar si el servidor funciona
    app.get('/', (req, res) => {
        res.send('Server is running!');
    });
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("**Conexion realizada a la base de datos**");
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        configurarMiddlewares(app);
        await conectarDB();
        configurarRutas(app);
        app.listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.log(`❌ Server init failed: ${err}`);
    }
};
