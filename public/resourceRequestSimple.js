fetch('/fetchLookupHistory')
.then(response => response.json())
.then(json => {
    var result = JSON.stringify(json);
    console.log(result);
    var object = JSON.parse('{"lookups":['+result.substring(1, result.length-1)+']}');     
     
    element = document.getElementById("lookupResultsList");
    for (var result = 0; result < object.lookups.length; result++){
      var para = document.createElement("p");
      var node = document.createTextNode(object.lookups[result].hostname +": " + object.lookups[result].addr4);
      para.appendChild(node);
      element.appendChild(para);
    }
});