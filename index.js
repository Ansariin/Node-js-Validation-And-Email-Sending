const express = require('express');
// const bodyParser = require('body-parser')

const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000
const path = require("path");
let dotenv = require("dotenv");
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use('/static', express.static(path.join(__dirname, 'static')));
dotenv.config({ path: "./config.env" });


app.get('/', (req, res) => {
  res.render('index')
});


// email config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.email_address}`,
    pass:  `${process.env.email_password}`
  }
});



app.post('/', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('mobile').isLength({ min: 10 }).isNumeric(),
], (req, res) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);
  const { email, password, mobile } = req.body;

  const mailOptions = {
    from: `${process.env.email_address}`,
    to: `${email}`,
    subject: 'Sending Email using Node.js',
    text: `That was easy! your password is ${password} and mobile number is ${mobile}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
  
  
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});