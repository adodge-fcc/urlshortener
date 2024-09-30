require('dotenv').config();
const express = require('express');
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
  try {
    new URL(url)
  }catch{
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

app.get("/api/shorturl/:short", (req,res) => {
  const url = registry.get(Number(req.params.short));
  res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
