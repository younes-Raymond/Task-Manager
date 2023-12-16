const app = require('./app');
const express = require('express')
const path = require('path');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || 4000;
const nodemailer = require('nodemailer');
const fs =  require('fs');

const {
  UKLONDONEMAILS,
    FRPARIS,
    UKMANCHESTER,
    emailArray,
    ListOfCompaniesOfCanada,
    ListOfMoroccoRecruiter,
    ListOfNewYorkRecruiter,
    NewListOfCanada
 } = require('./Data.js');
// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});







const sendEmail = async () => {
  
  // create reusable transporter object using the default SMTP transport
   let gmailtransporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: 'raymondyounes2@gmail.com',
      pass: "qxjfzpqyrinhmqza",
    },
  });

  const hotmailTransporter = nodemailer.createTransport({
    host: 'smtp.live.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-hotmail-email@hotmail.com',
      pass: 'your-hotmail-password',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });


  const frTransporter = nodemailer.createTransport({
    host: 'smtp.live.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-hotmail-email@hotmail.com',
      pass: 'your-hotmail-password',
    },
    tls: {
      rejectUnauthorized: false,
    },

  });

const listtest = [
  'raymondyounes2@gmail.com',
  'youneshero436@gmail.com'
]

  const emailLog = [];

  // Loop through each company in testList
  for (let i = 0; i < listtest.length; i++) {
    const companyEmail = listtest[i];


    let transporter;
    if (companyEmail.endsWith('@gmail.com')) {
      transporter = gmailtransporter;
    } else if (companyEmail.endsWith('@hotmail.com') || companyEmail.endsWith('@outlook.com')) {
      transporter = hotmailTransporter;
    } else if (companyEmail.endsWith('.fr')) {
      transporter = frTransporter;
    } else {
      // Handle other email providers if needed
      console.error(`Unsupported email provider for ${companyEmail}`);
      continue; // Skip to the next iteration
    }


    // setup email data
    let mailOptions = {
      from: 'raymondyounes2@gmail.com',
      to: listtest,
      subject: 'Job Application',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
        
                p {
                    margin-bottom: 10px;
                }
        
                .button-container {
                    margin-top: 20px;
                }
        
                .button {
                    background-color: #2196F3;
                    border: none;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 10px 20px;
                    border-radius: 4px;
                }
            </style>
            <title>Cover Letter</title>
        </head>
        <body>
            <p>Dear Hiring Manager,</p>
            <p>I am writing to express my interest in the open position at your company. Please find my cover letter attached for your consideration.</p>
            <p>Best regards,</p>
            <a style="text-decoration: none; color: inherit;" href="https://younes-dev-v9ap.onrender.com/">
              <p class="signature">Younes Raymond</p>
            </a>
            <div class="button-container">
                <a href="https://www.linkedin.com/in/younes-raymond-188a40241/" style="text-decoration: none;">
                    <button class="button">Linkedin</button>
                </a>
            </div>
            <img src="https://ajial.onrender.com/api/v1/track" width="1" height="1" style="display:none;">
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'cover_letter.txt',
          content: 'Dear Hiring Manager, I am writing to express my interest in the open web developer position at your company. Please find my cover letter below for your consideration. My name is Younes Raymond, and I am a professional web developer with five years of experience in database administration and website design. I possess strong creative and analytical skills, making me a valuable asset to any development team. Skills: Front End Coding (React.js, Redux, Material-UI), Back End Development (Node.js, MongoDB), Computer Literacy (Bash scripting, Project Management Tools), Languages (French - Fluent, English - Proficient). Education: freeCodeCamp (2016 - 2017) - Front-End Engineering Certificate, codeCademy (2017 - 2019) - Full Stack Web Developer Certificate. Experience: Ajial-Amanegment Company (2018 - Present) - Applications Developer, pieceX Company (2018 - 2020) - Web Content Manager, Ajial-Amanagment Company (2019 - Current) - Analysis Content. I am confident in my ability to contribute effectively to your team and bring my technical expertise to your projects. I look forward to the opportunity to discuss how my skills align with the needs of your company. Thank you for considering my application. Best regards, Younes Raymond',
        },
        {
          filename: 'resume.pdf',
          path: './web developer -resume.pdf', // Replace with the actual path to your PDF file
        },
      ],
    };


    try {
      // send mail with defined transport object
      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent to ${companyEmail}: ${info.messageId}`);
      emailLog.push({ company: companyEmail, success: true, messageId: info.messageId });
    } catch (error) {
      console.error(`Error sending email to ${companyEmail}:`, error);
      let errorMessage;
      if (error.code === 'EENVELOPE') {
        errorMessage = 'Invalid recipient address';
      } else {
        errorMessage = error.message;
      }
    
      // Log error to array
      emailLog.push({ company: companyEmail, success: false, error: errorMessage });    }
  }

  const logFileName = './emailLog-1.json';
  fs.writeFileSync(logFileName, JSON.stringify(emailLog, null, 2));
  console.log(`Email log saved to ${logFileName}`);
};

// Uncomment the line below to test sending the email
// sendEmail();

