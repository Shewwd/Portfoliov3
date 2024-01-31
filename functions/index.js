const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api-key', (req, res) => {
    res.json({ googleSiteApiKey: process.env.GOOGLE_SITE_KEY });
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

exports.api = functions.https.onRequest(app);