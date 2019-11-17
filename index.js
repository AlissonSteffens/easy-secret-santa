'use strict';
const nodemailer = require('nodemailer');
var fs = require('fs');
var shuffle = require('shuffle-array');
const emails = require('./data.json');
const config = require('./config');

var data = '';
var resultado = '';
var interval = 2 * 2000;

var readStream = fs.createReadStream('template.html', 'utf8');
let pessoas = emails.dados;

readStream.on('data', function (chunk) {
    data += chunk;
}).on('end', function () {
    shuffle(pessoas);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.email_user,
            pass: config.email_pass
        }
    });

    fs.writeFile("resultado.txt", "", function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was created!");
    });

    for (let i = 0; i < pessoas.length; i++) {
        setTimeout(function (i) {
            let next
            if (i < pessoas.length - 1) {
                next = i + 1
            } else {
                next = 0
            }
            let newdata = data.split('{$nome}').join(pessoas[next].nome);

            
            resultado = pessoas[i].nome + ' -> ' + pessoas[next].nome + '\n';
            fs.appendFileSync('resultado.txt', resultado);
            
            let mailOptions = {
                from: '"Amigo Secreto 🎁" <email@gmail.com>',
                to: pessoas[i].email,
                subject: 'Aqui está o seu amigo Secreto ✔',
                html: newdata
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
            
        }, interval * i, i);
    }
});
