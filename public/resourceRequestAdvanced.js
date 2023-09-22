var node;
var object;
var result = 0;
var resourceType;
var para = document.createElement("p");


fetch('/fetchLookupResults')
  .then(response => response.json())
  .then(json => {
      result = JSON.stringify(json);
      object = JSON.parse('{"lookups":['+result.substring(1, result.length-1)+']}');
      element = document.getElementById("advLookupResultsList");
      console.log(object.lookups.length);
      console.log(object.lookups);
      for (var result = 0; result < object.lookups.length; result++){
        para = document.createElement("p");
        resourceType = object.lookups[result].type;
        if (resourceType == 'A'){
              node = document.createTextNode(`IPv4: ${object.lookups[result].address}`);
        } else if (resourceType == 'AAAA') {
              node = document.createTextNode(`IPv6: ${object.lookups[result].address}`);      
        } else if (resourceType == 'MX') {
              node = document.createTextNode(`MX: ${object.lookups[result].exchange}`);
        } else if (resourceType == 'NS') {
              node = document.createTextNode(`NS: ${object.lookups[result].value}`)
        } else if (resourceType == 'TXT'){
              node = document.createTextNode(`TXT: ${object.lookups[result].entries}`);
        } else if (resourceType == 'SOA'){
              node = document.createTextNode(`SOA: ${object.lookups[result].hostmaster}`);
        }
        para.appendChild(node);
        element.appendChild(para);
      }
  });