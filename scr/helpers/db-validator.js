import Role from '../role/role.model.js';
import User from '../users/user.model.js';

// Verifica si el rol ingresado existe en la colección de roles
export const esRolValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol '${role}' no existe en la base de datos.`);
    }
};

// Verifica si el email ya está registrado
export const emailExiste = async (email = '') => {
    const existeEmail = await User.findOne({ email: email.toLowerCase() });
    if (existeEmail) {
        throw new Error(`El email '${email}' ya está registrado.`);
    }
};

// Verifica si el username ya está registrado
export const usernameExiste = async (username = '') => {
    const existeUsername = await User.findOne({ username: username.toLowerCase() });
    if (existeUsername) {
        throw new Error(`El nombre de usuario '${username}' ya está registrado.`);
    }
};
