const app = require('./app');
const express = require('express')
const http  = require('http');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || 4000;
const nodemailer = require('nodemailer');
const fs =  require('fs');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);


//Use CORS middleware 
app.use(cors());


const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});





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


// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    httpServer.close(() => {
        process.exit(1);
    });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Start the server

setTimeout(() => {
  // Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}, 10000)



app.listen(3000, () => {
  console.log('Server started on port 3000');
});




const generateUniqueId = () => {
  // console.log(uuidv4)
  return uuidv4();
};


const {
  testCompanies,
  BestWebAgencyInRabat,
  AU,
  MATANGER,
  INTERNATIONLEMAILS,
  GEBERLINE,
  GEFrankfurt,
  SPMADRID,
  UKLONDONEMAILS,
  FRPARIS,
  UKMANCHESTER,
  emailArray,
  ListOfCompaniesOfCanada,
  ListOfMoroccoRecruiter,
  ListOfNewYorkRecruiter,
  NewListOfCanada
 } = require('./Data.js');


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

//const how to creat more and ore shecduke a meettinf 
// i want the same id who stored in emailLog.json file to send via the api in the img src arttbute 


  const emailArrays = [
    // testCompanies
    // testEmailList
  BestWebAgencyInRabat,
  // UKLONDONEMAILS,
  // NewListOfCanada,
  // ListOfCompaniesOfCanada,
  // ListOfMoroccoRecruiter,
  // ListOfNewYorkRecruiter,
  // GEBERLINE,
  // SPMADRID,
  // emailArray,
  // AU,
  // GEFrankfurt,
  // UKMANCHESTER,
  // MATANGER,
  // INTERNATIONLEMAILS,
  // GEFrankfurt,
  // FRPARIS,
  // emailArray,
  ];

  const batchSize = 12; //400
  const pauseDuration =   30 * 60 * 1000;  // 25 * 60 * 60 * 1000
  const emailLog = [];
  for (const emailArray of emailArrays) {
    for (let i = 0; i < emailArray.length; i++) {
      const batch = emailArray.slice(i, i + batchSize);

      for (const companyDetails of batch) {
        const messageId = generateUniqueId();
        const {companyName , link , email: companyEmail } = companyDetails;
        let transporter;
        if (companyEmail.endsWith('@gmail.com')||companyEmail.endsWith('.com') ||companyEmail.endsWith('.ma')|| companyEmail.endsWith('.co') ) {
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
          to: companyEmail,
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
        <p>Dear ${companyName} Team,</p>
        <p>I'm eager to join your web development team, bringing expertise in React.js, Node.js, and MongoDB.</p>
        <p>Key Skills:</p>
        <ul>
          <li>Front End: React.js, Redux, Material-UI.</li>
          <li>Back End: Node.js, MongoDB.</li>
          <li>Computer Literacy: Bash scripting, Project Management Tools.</li>
          <li>Languages: Fluent in French, Proficient in English.</li>
        </ul>
        <p>Excited about the opportunity to contribute to ${companyName}. Thank you for considering my application.</p>
        <p>Best regards,</p>
        <a style="text-decoration: none; color: inherit;" href="https://younes-dev-v9ap.onrender.com/">
          <p class="signature">Younes Raymond</p>
        </a>
      
            <div class="button-container">
                <a href="https://www.linkedin.com/in/younes-raymond-188a40241/" style="text-decoration: none;">
                    <button class="button">Linkedin</button>
                </a>
            </div>
            <img src="https://ajial.onrender.com/api/v1/track?id=${messageId}-${companyEmail}" width="1" height="1" style="display:none;">
        </body>
        </html>
          `,
          attachments: [
            {
              filename: 'cover_letter.txt',
              content: `Dear ${companyName} Hiring Team,I hope this message finds you well. I am reaching out to express my sincere interest in joining your esteemed team as a web developer. After thorough research and admiration for the exceptional work your agency has delivered to clients, I am enthusiastic about the possibility of contributing my skills and expertise to further elevate your projects.My name is Younes Raymond, and I am a seasoned web developer with a proven track record of success in the field. Over the course of five years, I have honed my abilities in database administration and website design, consistently delivering high-quality solutions to meet diverse client needs.Key Skills:- Front End Coding: Proficient in React.js, Redux, and Material-UI.- Back End Development: Experienced in Node.js and MongoDB.- Computer Literacy: Skilled in Bash scripting and proficient in various Project Management Tools.- Languages: Fluent in French and proficient in English.Education:- Front-End Engineering Certificate from freeCodeCamp (2016 - 2017).- Full Stack Web Developer Certificate from codeCademy (2017 - 2019).Experience:- Applications Developer at Ajial-Amanegment Company (2018 - Present).- Web Content Manager at pieceX Company (2018 - 2020).- Analysis Content role at Ajial-Amanagment Company (2019 - Current).I am confident that my blend of technical skills, creativity, and analytical prowess aligns well with the needs of your agency. I am eager to contribute my expertise to your projects and collaborate with a team known for its innovation and excellence.I would welcome the opportunity to discuss in further detail how my background and skills can bring added value to ${companyName}. Thank you for considering my application. I am looking forward to the possibility of contributing to the continued success of your agency.Best regards,Younes Raymond`,
            },
            {
              filename: 'resume.pdf',
              path: './web developer -resume.pdf', // Replace with the actual path to your PDF file
            },
          ],
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log(`Message sent to ${companyEmail}: ${messageId}`);
          emailLog.push({ company:companyName, company: companyEmail, success: true, messageId: messageId });

          if (emailLog.length % 12 === 0) {
            console.log('Pausing for 25 hours...');
            await new Promise((resolve) => setTimeout(resolve, pauseDuration));
          }
        } catch (error) {
          console.error(`Error sending email to ${companyEmail}:`, error);
          let errorMessage;
          if (error.code === 'EENVELOPE') {
            errorMessage = 'Invalid recipient address';
          } else {
            errorMessage = error.message;
          }
          emailLog.push({ company: companyEmail, success: false, error: errorMessage });
        }
      }
    }
  }

  const now = new Date();
  const formattedDate = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
const formattedTime = `${now.getHours()}_${now.getMinutes()}`;
const logFileName = `./emailLogTrack_${formattedDate}_${formattedTime}.json`;
  fs.writeFileSync(logFileName, JSON.stringify(emailLog, null, 2));
  console.log(`Email log saved to ${logFileName}`);
};
// sendEmail()
