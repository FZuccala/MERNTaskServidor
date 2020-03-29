const Proyecto = require('../modelos/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
       //Crear un nuevo proyecto
       const proyecto = new Proyecto(req.body);
       //Guardar el creador via JWT
       proyecto.creador = req.usuario.id;

       
       proyecto.save();
       res.json(proyecto); 
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1}); 
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualiza un proyecto existente (Put)
exports.actualizarProyecto = async(req, res) => {
        //Revisar si hay errores
        const errores = validationResult(req);
        if(!errores.isEmpty()){
            return res.status(400).json({errores: errores.array()});
        }
    //Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let idProyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!idProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //verificar el creador del proyecto
        if(idProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }
        //actualizar el proyecto
        idProyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto }, {$new : true});
        res.json({idProyecto});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor'); 
    }
}

exports.eliminarProyecto = async(req, res) => {

    try {
        // Revisar el ID
        let idProyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!idProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //verificar el creador del proyecto
        if(idProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'El proyecto fue eliminado satisfactoriamente'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

 