//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Crea un usuario
//el endpoint para crear un usuario va a ser api/auth
router.post('/', 
    
    authController.autenticarUsario
);
//Iniciar sesion y trae los proyectos del usuario autenticado
router.get('/',
        auth,
        authController.usuarioAutenticado
)


module.exports = router;