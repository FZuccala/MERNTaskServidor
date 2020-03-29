const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear Tarea 
// api/tareas
router.post('/', auth,
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty()
]
,tareaController.crearTarea);
//Obtener las tareas
router.get('/', auth, tareaController.obtenerTareas);
//Actualizar tareas
router.put('/:id', auth, tareaController.actualizarTareas);
//Eliminar tareas
router.delete('/:id', auth, tareaController.eliminarTareas);



module.exports = router;