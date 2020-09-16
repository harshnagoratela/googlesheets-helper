'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const router = express.Router();

const addCommentsToGS = async (sheetId, client_email, private_key, newData ) => {
  
  try {	  
	    
	  //console.log("+++++++++++ before match = ",(private_key==storedpk))
	  private_key = private_key.split("\\n").join("\n")
	  //console.log("+++++ private_key ",private_key)
	  //console.log("+++++++++++ match = ",(private_key==private_key1))
	  //storedpk = storedpk.split("\\n").join("\n")
	  //console.log(">>>>>>>> ",(private_key1==storedpk))
	  const doc = new GoogleSpreadsheet(sheetId);
	  // use service account creds
	  await doc.useServiceAccountAuth({
		client_email,
		private_key
	  });
	  await doc.loadInfo(); // loads document properties and worksheets

	  const sheet = doc.sheetsByTitle["Comments"];  
	  
	  const jsonData = JSON.parse(newData);
	  
	  //console.log("++++++ newData ",newData)
	  //console.log("++++++ jsonData ",jsonData)
	
	  await sheet.addRow({
		"Comment": jsonData.Comment,
		"ContentItem": encodeURIComponent(jsonData.ContentItem),
		"PostedBy": jsonData.PostedBy,
		"PostedOn": jsonData.PostedOn
	  });
	  return true;
  } catch (error) {
	  console.log(error);
	return error;
  }
}

const registerUserToGS = async (sheetId, client_email, private_key, newRequest ) => {
  
  try {	  
	    
	  private_key = private_key.split("\\n").join("\n")
	  const doc = new GoogleSpreadsheet(sheetId);
	  // use service account creds
	  await doc.useServiceAccountAuth({
		client_email,
		private_key
	  });
	  await doc.loadInfo(); // loads document properties and worksheets

	  const sheet = doc.sheetsByTitle["Users"];  
	  
	  const jsonData = JSON.parse(newRequest);
	  
	  await sheet.addRow({
		"email": jsonData.email,
		"password": jsonData.password,
		"fullname": jsonData.fullname,
		"isActive": jsonData.isActive,
		"creationdate": jsonData.creationdate		
	  });
	  return true;
  } catch (error) {
	  console.log(error);
	return error;
  }
}

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Welcome to Google Sheets Helper via Netlify Functions!</h1>');
  res.end();
});
router.get('/addcomment', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>This serverless function will add a comment to googlesheets!</h1>');
  res.end();
});
router.post('/addcomment', async (req, res) => {
  //cors related changes
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  
  //console.log("*** request.body.privateKey ",req.body.privateKey);
  const result = await addCommentsToGS(req.body.sheetId,req.body.clientEmail,req.body.privateKey,req.body.newData);
  //const result = true;
  res.json({
    result
  })
});

router.get('/registeruser', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>This serverless function will add a comment to googlesheets!</h1>');
  res.end();
});
router.post('/registeruser', async (req, res) => {
  //cors related changes
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  
  //console.log("*** request.body.privateKey ",req.body.privateKey);
  const result = await registerUserToGS(req.body.sheetId,req.body.clientEmail,req.body.privateKey,req.body.newRequest);
  //const result = true;
  res.json({
    result
  })
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/.netlify/functions/googlesheet', router);  // path must route to lambda
app.use('/.netlify/functions/googlesheet/addcomment', router);  // path must route to lambda
app.use('/.netlify/functions/googlesheet/registeruser', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
