// subject field added
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Contact form backend is running!');
});

app.post('/send_mail', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send('All fields are required.');
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sebastianmacwan95@gmail.com',
      pass: 'xtavllkqjewqnikc'
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'sebastianmacwan95@gmail.com',
    subject: `${subject}`,
    text: `You received a new message from your website:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending mail:', error);
      return res.status(500).send('Error sending mail.');
    }
    res.send('Email sent successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
