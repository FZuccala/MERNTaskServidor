const Tarea = require('../modelos/Tareas');
const Proyecto = require('../modelos/Proyecto');
const { validationResult } = require('express-validator');

//Crear una tarea
exports.crearTarea = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

 
    try {
           //Extraer el proyecto y ver si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Revisar que el proyecto sea del creador
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtener las tareas por proyecto
exports.obtenerTareas = async ( req, res ) => {

    try {
            
            //Extraemos el proyecto
           //Extraer el proyecto y ver si existe
           const { proyecto } = req.query;
           const existeProyecto = await Proyecto.findById(proyecto);
   
           if(!existeProyecto){
               return res.status(404).json({msg: 'Proyecto no encontrado'});
           }
           //Revisar que el proyecto sea del creador
           if(existeProyecto.creador.toString() !== req.usuario.id){
               return res.status(401).json({msg: 'Usuario no autorizado'});
           }

        //Obtener las tareas
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({tareas});

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//Actualizar las tareas
exports.actualizarTareas = async(req, res) => {

    try {
            //Extraemos el proyecto
           //Extraer el proyecto y ver si existe
           const { proyecto, nombre, estado } = req.body;

           //Si la tarea existe o no
           let tareaExiste = await Tarea.findById(req.params.id);

           if(!tareaExiste){
                return res.status(404).json({msg: 'La tarea no existe'});
           }
                   //crear un objeto con la nueva tarea e ir actualizando la info
        const nuevaTarea = {};
           const existeProyecto = await Proyecto.findById(proyecto);
   
           
           //Revisar que el proyecto sea del creador
           if(existeProyecto.creador.toString() !== req.usuario.id){
               return res.status(401).json({msg: 'Usuario no autorizado'});
           } 

        
            nuevaTarea.nombre = nombre;
          
        
            nuevaTarea.estado = estado;
        
        //Guardar la tarea
         tareaExiste = await Tarea.findByIdAndUpdate({ _id: req.params.id}, nuevaTarea, {new: true}); 

        res.json({tareaExiste});
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Eliminar tareas
exports.eliminarTareas = async(req, res) => {

    try {
        //Extraemos el proyecto
       //Extraer el proyecto y ver si existe
       const { proyecto } = req.query;
    
       //Si la tarea existe o no
       let tareaExiste = await Tarea.findById(req.params.id);

       if(!tareaExiste){
            return res.status(404).json({msg: 'La tarea no existe'});
       }
               //crear un objeto con la nueva tarea e ir actualizando la info

       const existeProyecto = await Proyecto.findById(proyecto);

       
       //Revisar que el proyecto sea del creador
       if(existeProyecto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: 'Usuario no autorizado'});
       } 

       //Eliminar la tarea
       await Tarea.findByIdAndRemove({_id: req.params.id});
       res.json({msg: 'Tarea eliminada'});
} catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
}
}