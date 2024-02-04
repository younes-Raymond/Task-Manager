const app = require('./app');
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');
const  nodemailer  = require('nodemailer');
const  { validate } = require('deep-email-validator') ;
const  csvParser = require('csv-parser') ;
const fs = require('fs');


// Create an HTTP server
const httpServer = http.createServer(app);

// Use CORS middleware
app.use(cors());

// Create a Socket.IO server attached to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: 'https://ajial.onrender.com',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Handle Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'message' event
  socket.on('message', (data) => {
    console.log('Received message:', data);

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Handle uncaughtException Error
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Start the Express app


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));



const sendEmailsCampaign = async (emailArray) => {
  console.log('email array after sendemailcompain run ', emailArray);

  const batchSize = 20; // Set the batch size
  const pauseBetweenBatches = 30 * 1000; // Set the pause duration between batches in milliseconds
  const pauseAfterBatches = 3 * 60 * 1000; // Set the pause duration after sending a certain number of batches

  const gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'raymondyounes2@gmail.com',
          pass: 'belr cwbo qybm sukv',
      },
      tls: {
        rejectUnauthorized: false
      }
  });

  let emailLog = []; // Initialize email log
  let emailCounter = 0; // Initialize email counter for the current batch
  let batchCounter = 0; // Initialize batch counter

  // Loop through each email in the array
  for (const companyEmail of emailArray) {
      console.log('Company email:', companyEmail);

      // Validate the email address before sending
      let res = await validate({
          email: companyEmail,
          sender: 'raymondyounes2@gmail.com',
          validateRegex: true,
          validateMx: true,
          validateTypo: true,
          validateDisposable: true,
          validateSMTP: true,
      });

      console.log('res valid:', res.valid);

      if (!res.valid) {
          console.error(`Invalid email address: ${companyEmail}`);
          continue; // Skip sending the email if the address is invalid
      }

      // Send the email
      const transporter = companyEmail.endsWith('@yahoo.com') ? yahooTransporter : gmailTransporter;
      await sendEmail(companyEmail, transporter);
      emailLog.push({ company: companyEmail, success: true });

      emailCounter++; // Increment email counter

      // Pause after sending a batch of emails
      if (emailCounter === batchSize) {
          console.log(`Pausing for ${pauseBetweenBatches / 1000} seconds between batches...`);
          await new Promise(resolve => setTimeout(resolve, pauseBetweenBatches));
          emailCounter = 0; // Reset the email counter
          batchCounter++; // Increment batch counter

          // Pause after sending a certain number of batches
          if (batchCounter === 1) {
              console.log(`Pausing for ${pauseAfterBatches / 1000 / 60} minutes after ${batchCounter} batch(es)...`);
              await new Promise(resolve => setTimeout(resolve, pauseAfterBatches));
              batchCounter = 0; // Reset the batch counter
          }
      }
  }

  const logDirectory = './jsonLogs'; // Define the directory where log files will be stored

  // Ensure that the log directory exists, if not, create it
  if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
  }
  
  // Save email log to file
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const formattedTime = `${now.getHours()}-${now.getMinutes()}`;
  const logFileName = `${logDirectory}/emailLog_${formattedDate}_${formattedTime}.json`;
  
  fs.writeFileSync(logFileName, JSON.stringify(emailLog, null, 2));
  console.log(`Email log saved to ${logFileName}`);
    
};

const affilliateLink = 'https://amzn.to/3SjGbE9';
// https://amzn.to/3HR5BE0, old affiliate 
const primaryImage = 'https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71A3c74fhML._AC_SL1500_.jpg'
const sendEmail = async (companyEmail, transporter) => {
    // Set up your email transporter and mail options here
    const mailOptions = {
        from: 'raymondyounes2@gmail.com',
        to: companyEmail,
        subject: 'Tempo 30 Wireless Earbuds Promotion',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Light Promotion</title>
                <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
              }
              .button {
                  display: inline-block;
                  background-color: #ff9900; /* Amazon's color scheme */
                  color: #fff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
              }
              .product-images-container {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-between;
                  margin-top: 20px;
              }
              .product-image {
                  width: 48%; /* Two images per row with small spacing */
                  margin-bottom: 10px;
              }
              .ii a[href] {
                color: #fff; 
            }
          </style>
            </head>
            <body>
                <div class="container">
                <h2>Gritin Rechargeable Book Light for Reading in Bed</h2>
        <img src="${primaryImage}" class="product-image" alt="Gritin Rechargeable Book Light">
        <p>Brand: Gritin</p>
        <p>Rating: 4.8 out of 5 stars (2,027 ratings)</p>
        <p>Amazon's Choice in Book Lights by Gritin</p>
        <p>10K+ bought in the past month</p>
        <p>Limited time deal</p>
        <p>$11.04 with 26 percent savings</p>
        <p>Typical price: $14.99</p>
        <p>Eligible for Return, Refund, or Replacement within 30 days of receipt</p>
        <p>Color: Black</p>
        <p>About this item:</p>
        <ul>
            <li>Unique Horizontal Design & Eye Protection</li>
            <li>3 Colors & 5 Brightness Levels</li>
            <li>360° Flexible Neck & Clipable Design</li>
            <li>USB C Rechargeable</li>
            <li>Lightweight & Best Gift</li>
        </ul>
        <div class="product-images-container">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71wmjz4HRiL._AC_SL1500_.jpg" class="product-image" alt="Product Image 1">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71eW6PZy7nL._AC_SL1500_.jpg" class="product-image" alt="Product Image 2">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/61Bn1tP9V2L._AC_SL1500_.jpg" class="product-image" alt="Product Image 3">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71z58Rc7lhL._AC_SL1500_.jpg" class="product-image" alt="Product Image 4">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/71xlW84hn6L._AC_SL1500_.jpg" class="product-image" alt="Product Image 5">
            <img src="https://m.media-amazon.com/images/W/MEDIAX_849526-T1/images/I/81Yos7uX74L._AC_SL1500_.jpg" class="product-image" alt="Product Image 6">
        </div>

        <a href="${affilliateLink}" class="button">Shop Now on Amazon</a>
        <p>For the best deals and prices, please respond to this email with the product name, and I'll find it for you! Feel free to reach out if you have any questions or need assistance.</p>
          <img src="https://ajial.onrender.com/api/v1/track?id=${companyEmail}" width="1" height="1" style="display:none;">
          </div>
            </body>
            </html>
        `
    };

    await transporter.sendMail(mailOptions);
};


// Define the path to your CSV file
const csvFilePath = './Gmail/testEmail.csv';

const getEmailArraysFromCSV = async (csvFilePath) => {
  var  emailArrays = [];

  // Read the CSV file and extract email addresses
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) =>{
      console.log('row:',row)
      const emails = Object.values(row);
      emailArrays.push(...emails);
    } )

    .on('end', () => {
      console.log('CSV file processed successfully.');
      console.log('Email arrays:', emailArrays);
      sendEmailsCampaign(emailArrays);
      // Call your email campaign function here with emailArrays
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
};




// Call the function to read email addresses from the CSV file
// getEmailArraysFromCSV(csvFilePath);




