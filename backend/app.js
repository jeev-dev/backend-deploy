
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const globalConfig =require('./config')
const port1=globalConfig.port
const connection=require('./db')

let port = 5000;

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: "*"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uploadDir = './uploads/postjob/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/postjob/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const newFileName = uniqueSuffix + fileExtension;
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage });




/*   post a job Start */


// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  host: 'consulting.prabisha.com', // SMTP server hostname
  port: 587, // Port for the SMTP server (587 is commonly used for TLS)
  secure: false, // Set to true if your SMTP server uses SSL/TLS
  auth: {
    user: 'info@prabisha.com', // Your email address
    pass: 'ElzAeL6n', // Your email password
  },
});


app.post('/jobpost', (req, res) => {
  const { role, email, companyname,number, location, skills , environment, jobtype , minCTC, noticeperiod , maxCTC , description , descdocs } = req.body;
  const query = 'INSERT INTO postjob (role , email, companyname,number, location, skills , environment, jobtype , minCTC, noticeperiod , maxCTC , description , descdocs) VALUES (?, ?,?, ?,?, ?, ?,?, ?, ?, ?, ?)';
  connection.query(query, [role , email, companyname,number, location, skills , environment, jobtype , minCTC, noticeperiod , maxCTC , description , descdocs], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.json({ error: 'failed' });
      return;
    }
    // Send the contact form data to your email
    const mailOptions = {
  from: `${email}`,
  to: ['info@prabisha.com'],
  subject: 'Job Post Submission',
  html: `
    <html>
      <head>
        <!-- Include Bootstrap CSS -->
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        >
        <style>
          /* Add custom styles here */
          body {
            background-color: #f0f0f0; /* Background color */
            padding: 20px;
          }
          .container {
            background-color: #ffffff; /* Content background color */
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="mb-4">Job Post Submission</h2>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${companyname}</p>
          <p><strong>Number:</strong> ${number}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Skills:</strong> ${skills}</p>
          <p><strong>Environment:</strong> ${environment}</p>
          <p><strong>Job-Type:</strong> ${jobtype}</p>
          <p><strong>MinimumCTC:</strong> ${minCTC}</p>
          <p><strong>Notice Period:</strong> ${noticeperiod}</p>
          <p><strong>MaximumCTC:</strong> ${maxCTC}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Documents:</strong> ${descdocs}</p>
        </div>
      </body>
    </html>
  `,
};

    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ error: 'Email not sent' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'Entry created successfully and email sent', id: results.insertId });
      }
    });
  });
});


/*   post a job End */

















// Route for creating a new entry in the database
app.post('/postjob',upload.single("fileInput"),(req, res) => {
  // console.log(req.file.path,"reqfile")
  // console.log(req.body,"reqbody")
  let docpath=req.file.path
  let descdocs=docpath
  const { role,email, companyname,number,location,skills,environment,jobtype,minCTC,maxCTC,description } = req.body;
  const query = 'INSERT INTO postjob (role,email, companyname,number,location,skills,environment,jobtype,minCTC,maxCTC,description,descdocs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [role,email, companyname,number,location,skills,environment,jobtype,minCTC,maxCTC,description,descdocs], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.json({ error: 'failed' });
      return;
    }
    const mailOptions = {
      from: `${email}`,
      to: ['info@prabisha.com'],
      subject: 'Job Post Submission',
      html: `
        <html>
          <head>
            <!-- Include Bootstrap CSS -->
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            >
            <style>
              /* Add custom styles here */
              body {
                background-color: #f0f0f0; /* Background color */
                padding: 20px;
              }
              .container {
                background-color: #ffffff; /* Content background color */
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="mb-4">Job Post Submission</h2>
              <p><strong>Role: </strong> ${role}</p>
              <p><strong>Email: </strong> ${email}</p>
              <p><strong>Company: </strong> ${companyname}</p>
              <p><strong>Number: </strong> ${number}</p>
              <p><strong>Location: </strong> ${location}</p>
              <p><strong>Skills: </strong> ${skills}</p>
              <p><strong>Work Place: </strong> ${environment}</p>
              <p><strong>Job-Type: </strong> ${jobtype}</p>
              <p><strong>Minimum CTC: </strong> ${minCTC}</p>
              <p><strong>Maximum CTC: </strong> ${maxCTC}</p>
              <p><strong>Description: </strong> ${description}</p>
              <p><strong>Documents:</strong> <a href=${port1}${descdocs}>${port1}${descdocs}</a>  </p>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ error: 'Email not sent' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'Entry created successfully and email sent', id: results.insertId });
      }
    });
    
    // res.json({ message: 'Entry created successfully', id: results.insertId });
  });

});




const uploadDir1 = './uploads/postresume';
if (!fs.existsSync(uploadDir1)) {
  fs.mkdirSync(uploadDir1);
}
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file,"fillleee")
      cb(null, './uploads/postresume'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname); // Get file extension
      const newFileName = uniqueSuffix + fileExtension; // Generate unique filename
      cb(null, newFileName);
      console.log(newFileName,"newFileName")
  }
});
// Initialize Multer middleware
const upload1 = multer({ storage: storage1 });

app.post('/postresume',upload1.single("fileInput1"),(req, res) => {
  console.log(req.file.path,"reqfile")
  console.log(req.body,"reqbody")
  let resume=req.file.path
  const { email, jobtype,name,number,linkedin,location,industry,functionalarea,skills,experience,noticeperiod,education,currentsalary,expectedsalary,visa,agree} = req.body;
  const query = 'INSERT INTO postresume (email, jobtype,name,number,linkedin,location,industry,functionalarea,skills,experience,noticeperiod,education,currentsalary,expectedsalary,visa,resume,agree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [email, jobtype,name,number,linkedin,location,industry,functionalarea,skills,experience,noticeperiod,education,currentsalary,expectedsalary,visa,resume,agree], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.json({ error: 'failed' });
      return;
    }
    const mailOptions = {
      from: `${email}`,
      to: ['info@prabisha.com'],
      subject: 'Resume Post Submission',
      html: `
        <html>
          <head>
            <!-- Include Bootstrap CSS -->
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            >
            <style>
              /* Add custom styles here */
              body {
                background-color: #f0f0f0; /* Background color */
                padding: 20px;
              }
              .container {
                background-color: #ffffff; /* Content background color */
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
          skills,experience,education,currentsalary,expectedsalary,visa,agree
            <div class="container">
              <h2 class="mb-4">Resume Post Submission</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Number:</strong> ${number}</p>
              <p><strong>Linkedin profile:</strong><a href=${port1}${linkedin}></a> ${linkedin}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Industry:</strong> ${industry}</p>
              <p><strong>Functionalarea:</strong> ${functionalarea}</p>
              <p><strong>Skills:</strong> ${skills}</p>
              <p><strong>Experience:</strong> ${experience}</p>
              <p><strong>Notice period:</strong> ${noticeperiod}</p>
              <p><strong>Education:</strong> ${education}</p>
              <p><strong>Currentsalary:</strong> ${currentsalary}</p>
              <p><strong>Expectedsalary:</strong> ${expectedsalary}</p>
              <p><strong>Visa:</strong> ${visa}</p>
              <p><strong>Resume:</strong><a href=${port1}${resume}>${port1}${resume}</a></p>
              <p><strong>Agree:</strong> ${agree}</p>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ error: 'Email not sent' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'Entry created successfully and email sent', id: results.insertId });
      }
    });
  });
});

app.post('/contactus', (req, res) => {
  const {name,email,number,message} = req.body;
  const query = 'INSERT INTO contactus (name,email,number,message) VALUES (?, ?, 1234567890, ?)';
  connection.query(query, [name,email,number,message], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.json({ error: 'failed' });
      return;
    }
    const mailOptions = {
      from: `${email}`,
      to: ['info@prabisha.com'],
      subject: 'Contact Form Submission',
      html: `
        <html>
          <head>
            <!-- Include Bootstrap CSS -->
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            >
            <style>
              /* Add custom styles here */
              body {
                background-color: #f0f0f0; /* Background color */
                padding: 20px;
              }
              .container {
                background-color: #ffffff; /* Content background color */
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="mb-4">Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Number:</strong> ${number}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ error: 'Email not sent' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'Entry created successfully and email sent', id: results.insertId });
      }
    });
    // res.json({ message: 'Entry created successfully', id: results.insertId });
  });
});


// Route for getting data from the database
app.get('/getjobs', (req, res) => {
  const query = 'SELECT * FROM postjob ORDER BY id DESC ';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.json({ error: 'failed' });
      return;
    }
    res.json({ data: results });
  });
});


// Route for getting data from the database



app.post('/userdata',(req,res)=>{
  const {name,email,mobile_number,password} = req.body;
  console.log(password,"password",mobile_number)
  if (!name || !email || !mobile_number || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'INSERT INTO user (name,email,mobile_number,password) VALUES (?, ?, ?, ?)';
  connection.query(query, [name,email,mobile_number,password], (err, results) => {
    if (err) {
      console.log(err,"errorororr")
      res.json({ error: 'failed' });
      return;
    }
    res.json({ message: 'Entry created successfully', id: results.insertId });
  });
})

app.get('/getuserdata', (req, res) => {
  const userEmail = req.query.email;
  const userPassword = req.query.password;
  const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
  connection.query(query,[userEmail,userPassword], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.json({ error: 'failed' });
      return;
    }
    if (results.length === 0) {
      // No user found with the provided email
      res.status(404).json({ error: 'User not found.' });
    } else {
      // User with the provided email found
      res.status(200).json({ data: results,message:"This user is present" });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
