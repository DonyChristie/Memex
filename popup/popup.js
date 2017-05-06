document.addEventListener('DOMContentLoaded', function () {
  //chrome.storage.local.clear();
  var record = document.getElementById("recordButton");
  record.addEventListener('click',onRecordClick);
  record.innerHTML = "Show Link Maker";
  
  var noteArea = document.getElementById("notes");
  noteArea.addEventListener("input", function(vars){
    var val = vars.srcElement.value;
    chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, doMemFuncUrl(updateMemory,val));
  });
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, doMemFuncUrl(loadFromMemory));
  displayConnections();
});

function createOption(text,value,callback,checked){
  var box = document.createElement("input");
  box.type = "checkbox";
  box.value = value;
  box.onclick = callback;
  box.checked = checked;
  var lab = document.createElement("label");
  lab.for = value;
  lab.innerHTML = text;
  var div = document.createElement("div");
  div.appendChild(box);
  div.appendChild(lab);
  return div;
}

function filterUrl(url){
  var ind1 = url.indexOf("?");
  ind1 = (ind1==-1)?url.length:ind1;
  var ind2 = url.indexOf("#");
  ind2 = (ind2==-1)?url.length:ind2;
  var ind = (ind1<ind2)?ind1:ind2;
  return url.substring(0,ind);
}

function updateLinkMaker() {
  updateActiveTabList();
  updateStoredConnections();
}
function activeTabSelect(cb){
  storedTabSelect(cb,updateStoredConnections);
}
function storedTabSelect(cb,callback = function(){}){
  chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function(currTab){
    url = currTab[0].url;
    cb = cb.srcElement;
    chrome.storage.local.get("conns", function (item) {
      var bigConn = item["conns"];
      bigConn = (bigConn===undefined)?{}:bigConn;
      conn = bigConn[url];
      conn = (conn===undefined)?[]:conn;
      if(cb.checked){
        if(conn.indexOf(cb.value)==-1){
          conn.push(cb.value);
        }
      } else {
        var i = conn.indexOf(cb.value);
        if(i  > -1){
          conn.splice(i,1);
        }
      }
      bigConn[url]=conn;
      item["conns"] = bigConn;
      chrome.storage.local.set(item,function(){callback();});
    });
  });
}
function displayConnections(){
  var connBox = document.getElementById("connectionList");
  connBox.innerHTML = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
    chrome.storage.local.get("conns", function (item) {
      var url = tabs[0].url;
      var bigConn = item["conns"];
      bigConn = (bigConn===undefined)?{}:bigConn;
      conns = bigConn[url];
      conns = (conns===undefined)?[]:conns;
      conns.forEach(function(conn,i,conns) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = conn;
        a.innerHTML = filterUrl(conn);
        li.appendChild(a);
        connBox.appendChild(li);
      });
      
    });
  });
}

function updateStoredConnections() {
  var oldConns = document.getElementById("linkOld");
  oldConns.innerHTML = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (results){
    chrome.storage.local.get("conns",function (items) {
      var bigConn = items["conns"];
      bigConn = (bigConn===undefined)?{}:bigConn;
      var connections = bigConn[results[0].url];
      connections = (connections === undefined)? []: connections;
      connections.forEach(function(conn,i, connections){
        var box = createOption(filterUrl(conn),conn,storedTabSelect,true);
        oldConns.appendChild(box);
      });
    });
  });
}

function updateActiveTabList(){
  var item = document.getElementById("linkSelect");
  item.innerHTML = "";
  chrome.tabs.query({},function (results){
  chrome.storage.local.get("conns",function (items) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (active){
    
    var bigConn = items["conns"];
    bigConn = (bigConn===undefined)?{}:bigConn;
    var conns = bigConn[active[0].url];
    
    
    results.forEach(function(res,i,results) {
      var box = createOption(res.title,res.url,activeTabSelect,(conns.indexOf(res.url)!=-1));
      item.appendChild(box);
    });
  }); }); });
}

function onRecordClick(){
  var record = document.getElementById("recordButton")
  var maker = document.getElementById("recordBox");
  if(record.innerHTML == "Show Link Maker"){
    updateLinkMaker();
    record.innerHTML = "Hide Link Maker";
    maker.style.display = "block";
  } else {
    record.innerHTML = "Show Link Maker";
    maker.style.display = "none";
  }
  displayConnections();
};

function updateMemory(url,other) {
  var val = other;
  console.log(other);
  return function(items) {
    var tmp = items[url];
    tmp = (tmp===undefined)?{}:tmp;
    tmp['note'] = val;
    items[url] = tmp;
    chrome.storage.local.set(items,function () {;});
  };
};

function loadFromMemory(url,other) {
  return function(items) {
    var tmp = items[url]
    tmp = (tmp===undefined)?{}:tmp;
    var note = tmp['note'];
    note = (note === undefined)? "Write a note here!":note;
    var noteArea = document.getElementById("notes");
    noteArea.innerHTML = note;
  };
};

function doMemFuncUrl(func,other){
  return function(tabs){
    var url = tabs[0].url;
    chrome.storage.local.get(url, func(url,other));
  };
};
