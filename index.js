require('dotenv').config();
const express = require('express');
const dns = require('node:dns');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const registry = new Map();

app.post("/api/shorturl", (req,res) => {
  const {url} = req.body;
  console.log(url);
  let parsed;
  try {
    parsed = new URL(url);
  }catch{
    res.json({error: "invalid url"});
    return;
  }

  // Apparently the assignment thinks a URL is only valid if you can download
  // the resource it refers to.
  dns.lookup(parsed.host, (err, result) => {
    if(err !== null){
      res.json({error: "invalid url"});
      return;
    }

    const next_id = registry.size;
    registry.set(next_id, url);
  
    res.json({
      original_url: url,
      short_url: next_id,
    })
  });
});

app.get("/api/shorturl/:short", (req,res) => {
  const url = registry.get(Number(req.params.short));
  res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

