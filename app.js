const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const config = require('config');
const debugError = require('debug')('app:error');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static("public"));
app.use(morgan('tiny'));

 console.log(config.get('db'));
 debugError('Esto es un mensaje al parecer de error! TT');

let usuarios = [
    {id:1, nombre:"Emmanuel", apellido:'morales'},
    {id:2, nombre:"Migdalia"},
    {id:3, nombre:"Emma JR"},
]

app.get('/api/usuarios', (req, res) =>{
    res.status(200).json(usuarios);
});

app.get('/api/usuarios/:id([0-9]+)', (req, res) =>{
    const {id} = req.params;
    const usuario =  usuarios.find(u => u.id === parseInt(id));
    if(!usuario) {
        res.status(404).json({ estado: false, mensaje: 'usuario no encontrado' });
    }else{
        res.status(200).json({ estado:true, data:[usuario] });
    }
});

app.get('/api/usuarios/filtro', (req, res) => {
    const { nombre, edad } = req.query;
    res.status(200).json({ nombre, edad  });
});


app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object().keys({
        nombre: Joi.string().min(3).max(30).required(),
    });

    const { error, value } = schema.validate(req.body);
    if(error){
        res.status(400).json(error);
        return;
    }

    const usuario = { id: usuarios.length +1, nombre: value.nombre};
    usuarios.push(usuario);
    res.status(200).json(usuario);
});

app.put('/api/usuarios/:id', (req, res) => {

    let usuario = usuarios.find(usuario => usuario.id === parseInt(req.params.id));
    if(!usuario){
        res.status(404).json({ mensaje: 'Usuario no encontrado'})
        return;
    }

    const schema = Joi.object().keys({
        nombre: Joi.string().min(3).max(30).required(),
    });

    const { error, value } = schema.validate(req.body);
    if(error){
        res.status(400).json(error);
        return;
    }

    //usuario = { ...usuario, ...value};
    usuario.nombre = value.nombre;
    res.status(200).json(usuario);

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});