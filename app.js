const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

const server = http.createServer(app);
const dns = require('node:dns');
const { Resolver } = require('node:dns');
const { lookup } = require('dns');
const resolver = new Resolver();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

var dnsServers = [];
var lookupHistory = [];
var lookupResults = [];
var dnsServerSet = false;

app.get('/', function(req,res){
  res.sendFile('index.html');
});

app.post('/add', function(req,res){
    try{
      var temp = [];
      temp.push(req.body.dnsIP);
      resolver.setServers(temp);
    } catch (ERR_INVALID_IP_ADDRESS){
      if (req.body.clear == 'on'){
          console.log("Clearing DNS Server List...");
          dnsServers = [];
          res.redirect('../');
          return;
      } else {
          console.log("Invalid IP :(");
          res.redirect('../');
          return;
      }
    }
    dnsServers.push(req.body.dnsIP);
    resolver.setServers(dnsServers);
    dnsServerSet = true;
    console.log(`New DNS Server Added: ${resolver.getServers()}`);
    res.redirect('../');
});

// Fix output
app.post('/lookup', (req, res) =>{
    dns.lookup(req.body.hostname, (err, addr) => {
      if (err){
        console.log(err);
        res.redirect('../');
        return;
      }
    var lookupResult = {hostname: req.body.hostname, addr4: addr}
    lookupHistory.push(lookupResult)
    res.redirect('../');
    });
});

// To-Do: Allow users to implement reverse DNS lookups
app.post('/adv_lookup', (req, res) =>{
    if (dnsServerSet == true){
        console.log(req.body.recordType);
        resolver.resolve(req.body.hostname, req.body.recordType, (err, result) => {
        if (err){
          console.log(err);
          res.redirect('../');
          return;
        }
        lookupResults = result;
        lookupResults.push(req.body.recordType)
        console.log(lookupResults);
        res.redirect('../');
        })
      } else{
        res.redirect('../');
        return;
      }
});

// To-Do: Add function to list DNS servers

// To-Do: Add file upload function that allows users to upload a list of DNS servers they want to use

// To-Do: Add file upload function that allows users to enter a list of hostnames they want to resolve

app.get('/fetchLookupHistory', (req, res) =>{
    res.send(lookupHistory);
});

app.get('/fetchLookupResults', (req, res) =>{
    res.send(lookupResults);
    console.log(lookupResults);
});

server.listen(3000);