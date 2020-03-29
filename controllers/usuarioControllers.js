const Usuario = require('../modelos/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, res) => {
   
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

   //Extraer email y password de req.body
   const {email, password} = req.body;
   
    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

         //Guarda el usuario
         await usuario.save();

        //crear el jwt
        const payload = {
            id: usuario.id 
        };
        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 7200
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            //Mensaje de confirmacion
            res.json({ token });
        });

       

        
    } catch (error) {
        console.log(error);

        res.status(400).send('Hubo un error');
    }
}