const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

app.get('/api/get-token', (req, res) => {
    const token = jwt.sign({}, process.env.JWT_KEY, { expiresIn: '1h' });
    
    res.json({ token });
});

app.get('/api-key', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            res.json({ googleSiteApiKey: process.env.GOOGLE_SITE_KEY });
        }
    });
});   

app.post('/send-email', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            
            const { name, email, message } = req.body
            const emailData = {
                'from': 'jacobshawd@gmail.com',
                'to': 'jacobshawd@gmail.com',
                'subject': `Website Contact - ${email} - ${name}`,
                'text': message,
            }
            const response = await sendEmail(emailData);
            res.json({response});

        }
    });
});

exports.api = functions.https.onRequest(app);