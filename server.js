require('dotenv').config();
/* --------- Server Start --------- */
const express = require('express');
const path = require('path');

const app = express();
const port = 3000; 

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})

/* --------- Email --------- */
const nodemailer = require('nodemailer');

const nodemailerConfig = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'jacobshawd@gmail.com',
        pass: process.env.GOOGLE_MAIL_KEY,
    },
}

function sendEmail(data){
    const transporter = nodemailer.createTransport(nodemailerConfig);
    transporter.sendMail(data, (err, info) => {
        if(err) {
            console.log('Error sending email', err);
        } else {
            return info.response;
        }
    });
};

/* --------- Endpoints --------- */
const googleSiteApiKey = process.env.GOOGLE_SITE_KEY;

app.get('/api-key', (req, res) => {
    res.json({ googleSiteApiKey });
});   

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body
    const emailData = {
        'from': 'jacobshawd@gmail.com',
        'to': 'jacobshawd@gmail.com',
        'subject': `Website Contact - ${email} - ${name}`,
        'text': message,
    }
    const response = await sendEmail(emailData);
    res.json({response});
});