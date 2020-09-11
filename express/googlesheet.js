'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();

const addCommentsToGS = async () => {
  const SHEET_ID = '1Ih1zCWbF2Jlxwpc8KXEEvpptkoGK3u4XrxTuYTKJyFM';
  const private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbh/gXIW6g/w2t\nc42yQZZWDNmQYUpagfRCjABK+vtnK9fl9ZELq0qpJqeAMfr8+dhprK5o6wlAAykj\nmbShOovtHKvE3ASjYC0+vfRhpdKixhbNEwGfpld7CqenROIJE4Cw7E33ccqHesoe\nuKaOo+DIOB4mlu2mbbEgRC6nMsmWP7cl1vkpPZSnC/rq6V12OarEVPxL7MKP4KAS\nCrbsUYHd1T7+f7YhT03N5u5JDPBfraObofGrI/SPEcDvoSUqdf30qGIFwjKerpny\nZDg4P7i5/PJuDZ34HvfFdbK2tx0n4EJDG5ef6gG7LjRIGn9zNz+fNXj+KkMgq5or\nRdOemD+9AgMBAAECggEAC3m7TN2bH4biF/esL0hWks/M57G9/jKTdquExAODtCeQ\nfPei9ZT0Y8ml1zgY2DyJArcKgVRCMPZqvSU0pia/N0YDyHkhYHqSrAvw8Zl+EqOC\nACyUVJa94qa1GwrikJ/fQW6WDBlZw6hELIMcSu79gVhepSNCsqJqTMKrHIwLQqog\nY0DXJGd0h3xnSs1Pjth8pfPPy8tFkPqLwa4pODk3tNwlc5xCHoxz6dMXejuVq9xT\ntJ4reJHaIORJJces6Y+p5fNkyZV7cXnvKv1KNn8X8xRd6monbsC3BtbSI6tirevc\n5rkeDa/XHJ3UxRv8XZGWiVXvMAKRL0o/dw+4Suh4wwKBgQDJyELyeu0LrHCcMLUK\nuz2r0js2Czi4dKeDTDrtejXC/ncOpE09q82ejurBSz63swtScjdsMI6ttiyz3dgA\nlgV4VuI17n0Okk7DuLIBPGjE4Sk4vlzX87X54B+pLkW/BzEsAnztOQroTGrUmF1p\nNKTxbGHcnGy/PIV0xbSMHEWBlwKBgQDFUkof+WGBpkz5mQEiyIj67ONWTT80UGx0\nFpQnPPwQSvrahSX20JbPckkOxV3HMk/o3pAhwBQdYYP67vWakxXjQ6bYNLECHWbR\nR4QlDDxCbg2eD+9b2O/mLNDIrge6+KhfadV/qWYBc8uxD6fVBGrbt0na6LOvJvcR\nPGwEG38LywKBgEmsDIVrzFCOzS65ueAJLSMmxuecgUEXlnGhy4IZNLfVILL/2hPC\nPni9xYh9aJC5llCr0wB1WiKieP/S56KPI8AkOMNoJ9DCKm/bZ2J8I+R+MQa+ujc+\njBqHcgfbFSwB/DoNTn9ubEUUYYztdG2NAwwCfliF5E6OUkuoQ5tEVzxRAoGAQFnG\n3MiamQqgHeJdMXfO3G528YU9sJTt2aonZOiJl9KsHqm/qM9772lpFA0fuT/aOaqj\nvK4EoVRVE3fs1x1SzQwaFHaSp4rpJiU5nk9wM4XqoPq3Z+/GxP0mldvTn5FKb9t3\nCiw3nQ+jhToC1QCczMzopCCxwNRnTNK0s144P6MCgYEAjhMu1cIZLeplqLvHYvL4\nokt68zfQgLOcOKm1Jhov+5PIHOOhhXWd0QA/qS10+cPFAXn2wbQL3Ax3fidQRg3S\nW1XQATEB8wYazFTsWWIing8cuIWawaWdiqQfaswgR20b5xDrr2NRdFdf3foJxl70\n8xsbbqthWLc/pJe61Bd838k=\n-----END PRIVATE KEY-----\n";
  const client_email = "hyper-sheet-service-account@hyper-4fa6c.iam.gserviceaccount.com";

  const { GoogleSpreadsheet } = require('google-spreadsheet');
  const doc = new GoogleSpreadsheet(SHEET_ID);
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email,
    private_key,
  });
  await doc.loadInfo(); // loads document properties and worksheets
  console.log("******* doc  ", doc);

  const sheet = doc.sheetsByTitle["Comments"];
  console.log("***** sheet ", sheet);

  await sheet.addRow({
    "Comment": "testcomment" + (Math.random() * 10000),
    "ContentItem": "testcoetnitem" + (Math.random() * 10000),
    "PostedBy": "testposteby" + (Math.random() * 10000),
    "PostedOn": "testpostedon" + (Math.random() * 10000)
  });

  // read rows
  const rows = await sheet.getRows();
  return rows;
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
router.post('/addcomment', (req, res) => {
  //cors related changes
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')

  const rows = addCommentsToGS();

  res.json({
    result: "Method called successfully",
    rows
  })
});

router.post('/removethisnow', function (req, res) {
  //cors related changes
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')

  axios.post("https://api.gumroad.com/v2/licenses/verify?product_permalink=" + req.query.product_permalink + "&license_key=" + req.query.license_key)
    .then(response => {
      console.log(response.data)
      res.json(response.data)
    })
    .catch(err => {
      console.log(err.response.data);
      res.json(err.response.data)
    })
});

app.use(bodyParser.json());
app.use('/.netlify/functions/googlesheet', router);  // path must route to lambda
app.use('/.netlify/functions/googlesheet/addcomment', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
