'use strict'
var express = require('express');
var hbs = require('express-handlebars');
var nodemailer = require('nodemailer');



const app = express();

// Handlebars configuracion
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
// Para poder usar formulario
app.use(express.urlencoded());
app.use ('/',express.static('web3'));

app.get('/contacto', function(req, res){
   res.render('formulario', {tipoFormulario:'Contacto'});
});



app.post('/contacto', async function(req, res) {

   try {
       var error = [];
	
	if (!req.body.nombre || req.body.nombre==" ")
		{error.push('El nombre es obligatorio');}
	if (!req.body.apellido || req.body.apellido==" ")
		{ error.push('El apellido es obligatorio');}
	if (!req.body.email || req.body.email==" ")
		{error.push('El e-mail es obligatorio');}
	if (!req.body.mensaje || req.body.mensaje==" ")
		{error.push('Debes enviarme algun mensaje!');}

       if (error!=0) {
           res.render('formulario', {error: error})
           return;
       }

       var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
               user: 'grupo2utnba',
               pass: 'utnba2019'
           }
       });

       let info = await transporter.sendMail({
           from: '"'+req.body.nombre+' '+req.body.apellido+'" <'+req.body.email+'>',
           to: 'grupo2utnba@gmail.com, '+req.body.email,
           subject: 'Nuevo mensaje proveniente del sitio web',
           text: req.body.mensaje,
           html: '<p>'+req.body.mensaje+'<b>'
       });



       res.render('mensajeEnviado', {info: info.response});
   }
   catch(err) {

       res.render('formulario', {error: err});
   }

});



app.listen(3000, function(){
   console.log('Servidor escuchando en el puerto 3000');
});
