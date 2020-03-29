const Usuario = require('../modelos/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsario = async(req, res) => {
    //Revisar si hay errores 
    const errores = validationResult(res);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    //extraer email y password
    const {email, password} = req.body;

    try {
        //revisar que el usuario este registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no esta registrado'});
        }
        //Revisar que el password sea el correcto
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({msg: 'El password es incorrecto'});
        }

        //Si todo va bien se crea el jwt
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
    }
}

//Trae los proyectos del usuario autenticado
exports.usuarioAutenticado = async( req, res ) => {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({ usuario });

    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
