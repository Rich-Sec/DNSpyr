const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const server = http.createServer(app);
const dns = require('node:dns');
const { Resolver } = require('node:dns');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

var dnsServers = [];
var lookupHistory = [];

app.get('/', function(req,res){
  res.sendFile('index.html');
});

// Add a DNS Server
app.post('/add', function(req,res){
    dnsServers.push(req.body.dnsIP);
    console.log(`New DNS Server Added: ${req.body.dnsIP}`);
    res.redirect('../')
});

app.post('/lookup', (req, res) =>{
    dns.lookup(req.body.hostname, (err, addr) => {
      if (err){
        console.log(err);
        return;
      }
    lookupHistory.push(req.body.hostname);
    lookupHistory.push(addr);
    res.redirect('../');
    });
});

app.get('/fetchLookupHistory', (req, res) =>{
    res.send(lookupHistory);
});

server.listen(3000);