const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea proyectos
// api/proyectos
router.post('/', 
auth, 
[ check('nombre', 'El nombre es obligatorio').not().isEmpty() ] ,
proyectoController.crearProyecto);

//Obtiene los proyectos
router.get('/', auth ,proyectoController.obtenerProyectos);

//Modifica los proyectos
router.put('/:id', auth, 
[ check('nombre', 'El nombre es obligatorio').not().isEmpty() ] ,
proyectoController.actualizarProyecto);

//Eliminar un proyecto
router.delete('/:id', auth, 
proyectoController.eliminarProyecto);

module.exports = router;