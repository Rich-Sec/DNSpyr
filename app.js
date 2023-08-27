const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

const server = http.createServer(app);
const dns = require('node:dns');
const { Resolver } = require('node:dns');
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

// Add a DNS Server
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
    if (dnsServerSet == true){
        console.log(req.body.recordType);
        resolver.resolve(req.body.hostname, req.body.recordType, (err, addr) => {
        if (err){
          console.log(err);
          res.redirect('../');
          return;
        }
        lookupResults = addr;
        console.log(lookupResults);
        res.redirect('../');
        })
      } else{
        res.redirect('../');
        return;
      }
});

app.get('/fetchLookupHistory', (req, res) =>{
    var lastLookup = lookupHistory.slice(-2);
    res.send(lastLookup);
});

app.get('/fetchLookupResults'), (req, res) =>{
    res.send(lookupResults);
}

server.listen(3000);