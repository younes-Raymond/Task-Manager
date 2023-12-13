const app = require('./app');
const express = require('express')
const path = require('path');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || 4000;
const nodemailer = require('nodemailer');

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







const ListOfCompanies = ['youneshero436@gmail.com', 
'info@abrimex.com',
'info@acces-cible.org',
'reception@accestravail.qc.ca',
'info@lesacados.org',
'info@adnemploi.com',
'info@aimcroitqc.org',
'info@alac.qc.ca',
'info@AllianceCT.ca',
'info@alphabellechasse.com',
'reception@midi40.com',
'info@ape.qc.ca',
'admin@atmprq.com',
// start in just one company
'communication@aslm.ca', 
'edufort@aslm.ca',
'rchartier@aslm.ca',
'amcalice@aslm.ca',
'memadore@aslm.ca',
// end in just one company
'info@boisurbain.org',
'info@bae.qc.ca',
'info@ea-cd.ca',
'admin@atmprq.com',
'info@boisurbain.org',
'info@toncec.ca',
'info@carrefouremploilotbiniere.com',
'administration@cje-abc.qc.ca',
'info@cje-arthabaska.ca',
'info@cjechateauguay.org',
'acton@cjejohnson.org',
'info@cjeae.qc.ca',
'info@cjea.org',
'info@cjecn.qc.ca',
'cjel@cjelislet.qc.ca',
'info@cjedm.qc.ca',
'info@cjevg.qc.ca',
'info@cjemirabel.ca',
'info@cje-pierredesaurel.com',
'info@cje-rdp.org',
'cplourde@cjedesbleuets.ca',
'info@cjemoulins.org',
//start one company
'asbestos@cjerichmond.qc.ca',
'richmond@cjerichmond.qc.ca',
'warwick@cjerichmond.qc.ca',
// end one company 
'info@cjeso-mtl.org',
'info@cjeoptionemploi.org',
'info-stremi@cjehuntingdon.org',
'info@cjehuntingdon.org',
'info@cjemaskinonge.qc.ca',
'cjepapineau@cjepapineau.qc.ca',
'emploi@cjesh.org',
'cje@cjestlaurent.org',
'info@cjevs.org',
'info@cjeanjou.com',
'carrefour@cjeb-s.ca',
'info@cje-centrenord.com',
'reception@cjecc.org',
//start one company 
'direction@cjenicbec.org',
'coordination_liaison@cjenicbec.org',
'administration@cjenicbec.org',
'anadeau@cjenicbec.org',
'agentmilieu@cjenicbec.org',
'jcossette@cjenicbec.org',
'jdesmarais_godon@cjenicbec.org',
'conseilleremploi2@cjenicbec.org',
'ppowers@cjenicbec.org',
'crheault@cjenicbec.org',
'slarocque@cjenicbec.org',
'migrationny@cjenicbec.org',
'immigration@cjenicbec.org',
'mboisvert@cjenicbec.org',
'agentplaceauxjeunes@cjenicbec.org',
'eimbeault@cjenicbec.org',
//start one company
'CJE@CJENICBEC.ORG',
//end one company
'cje.st-jean@cje-isj.com',
'cje.marieville@cje-isj.com',
'cje.farnham@cje-isj.com',
'cje@cje-sherbrooke.qc.ca',
'cje@cjebeauce-sud.com',
'info@cjecdn.qc.ca',
'info@moncje.com',
// start one company
'accueil@cjed.qc.ca',
'cjehsp@cjed.qc.ca',
'ce.portcartier@cjed.qc.ca',
//end one company 
'info@cjeouestile.qc.ca',
'info@cjeo.qc.ca',
'info@cjejamesie.ca',
'claudie@cjejamesie.ca',
'nicolas@cjejamesie.ca',
'info@cjejamesie.ca',
'christine@cjejamesie.ca',
'info@cjemontmagny.com',
'accueil@cjecotedegaspe.ca',
'cje-manic@cjemanic.com',
'cje@portneufplus.com',
'info@cjetemiscouata.qc.ca',
'info@cjeverdun.org',
'cjed@cgocable.ca',
'accueil@cjet.qc.ca',
'cjehm@cjehm.org',
'info@cjela.qc.ca',
'info@cjeetchemins.ca',

];




const sendEmail = async () => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: 'raymondyounes2@gmail.com',
        pass: "qxjfzpqyrinhmqza",
      },
    });

    //Loop through each company in ListOfCompanies
    // for (let i = 0; i < ListOfCompanies.length; i++ ) {
    //     const companyEmail = ListOfCompanies[i];

          // setup email data


    let mailOptions = {
        from: 'raymondyounes2@gmail.com',
        to: 'youneshero436@gmail.com',
        subject: 'Job Application',
        html: `<p>Dear Hiring Manager,</p>
               <p>I am writing to express my interest in the open position at your company. Please find my cover letter attached for your consideration.</p>
               <p>Best regards,</p>
               <p>Younes Raymond</p>
               <img src="https://ajial.onrender.com/track" width="1" height="1" style="display:none;">`,
        attachments: [
          {
            filename: 'cover_letter.txt',
            content: 'Dear Hiring Manager,\nI am writing to express my interest in the open position at your company. Please find my cover letter attached for your consideration.\nBest regards,\nJohn Doe',
          },
          {
            filename: 'resume.pdf',
            path: './web developer -resume.pdf', // Replace with the actual path to your PDF file
          },
        ],
      };

    // }    
  
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return { success: true, message: 'Message sent successfully!' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error occurred, message not sent.' };
    }
  };
  

// Uncomment the line below to test sending the email
sendEmail();
