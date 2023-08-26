const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

const server = http.createServer(app);
const dns = require('node:dns');
const { Resolver } = require('node:dns');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

var dnsServers = [];
var lookupHistory = [];
var lookupResults = [];

app.get('/', function(req,res){
  res.sendFile('index.html');
});

// Add a DNS Server
app.post('/add', function(req,res){
    dnsServers.push(req.body.dnsIP);
    console.log(`New DNS Server Added: ${req.body.dnsIP}`);
    res.redirect('../');
});

app.post('/lookup', (req, res) =>{
    dns.lookup(req.body.hostname, (err, addr) => {
      if (err){
        console.log(err);
        res.redirect('../');
        return;
      }
    lookupHistory.push(req.body.hostname);
    lookupHistory.push(addr);
    res.redirect('../');
    });
});

app.post('/adv_lookup', (req, res) =>{
    console.log(req.body.recordType);
    console.log(req.body.hostname);
    dns.resolve(req.body.hostname, req.body.recordType, (err, addr) => {
      if (err){
        console.log(err);
        res.redirect('../');
        return;
      }
      lookupResults = addr;
      console.log(lookupResults);
      res.redirect('../');
    })
});

app.get('/fetchLookupHistory', (req, res) =>{
    var lastLookup = lookupHistory.slice(-2);
    res.send(lastLookup);
});

app.get('/fetchLookupResults'), (req, res) =>{
    res.send(lookupResults);
}

server.listen(3000);