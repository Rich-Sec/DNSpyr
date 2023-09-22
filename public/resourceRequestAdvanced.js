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
      numOfObjects = object.lookups.length;
      queryType = object.lookups[object.lookups.length-1];
      element = document.getElementById("lookupResultsList");

      if (queryType == 'ANY'){
            for (result; result < numOfObjects; result++){
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
                  } else if (resourceType == 'CNAME'){
                        node == document.createTextNode(`CNAME: ${object.lookups[result].value}`);
                  }
            }
      } else if (queryType == 'A'){
            node = document.createTextNode(`IPv4: ${object.lookups[0]}`);
      } else if (queryType == 'AAAA'){
            node = document.createTextNode(`AAAA: ${object.lookups[0]}`);
      }
      para.appendChild(node);
      element.appendChild(para);
});