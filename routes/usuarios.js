//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioControllers');
const {check} = require('express-validator');


//Crea un usuario
//el endpoint para crear un usuario va a ser api/usuarios
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El email debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    usuarioController.crearUsuario
);

module.exports = router;