'use strict';
const nodemailer = require('nodemailer');
var fs = require('fs');
var shuffle = require('shuffle-array');
const emails = require('./data.json');
const config = require('./config');

var data = '';

var readStream = fs.createReadStream('template.html', 'utf8');
let pessoas = emails.dados;

readStream.on('data', function(chunk) {  
    data += chunk;
}).on('end', function() {
    shuffle(pessoas);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.email_user,
            pass: config.email_pass
        }
    });
    for(let i = 0 ; i < pessoas.length; i++){
        
        let next
        if(i<pessoas.length-1){
            next = i+1
        } else{
            next = 0
        }
        let newdata = data.split('{$nome}').join(pessoas[next].nome);
        
        let mailOptions = {
            from: '"Família do Rafa 👪" <amgsecretofamilia@gmail.com>',
            to: pessoas[i].email,
            subject: 'Seu Amigo ✔',
            html: newdata
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
    
    
});
