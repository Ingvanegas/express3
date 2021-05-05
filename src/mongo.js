const mongoose =  require ("mongoose");

mongoose.connect ('mongodb://localhost:27017/mi_base');

const schema = {nombre: string, apellido: string, edad: Number};
const Usuarios = mongoose.model('Usuarios', schema);
const yo = {nombre: 'Juan', apellido: 'Perez', edad: 24};
let nuevo_usuario = new Usuarios(yo)
nuevo_usuario.save();

Usuarios.find().then(function (resultados){
    console.log(resultados);
    });
