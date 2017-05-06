document.addEventListener('DOMContentLoaded', function () {
  var record = document.getElementById("recordButton");
  record.addEventListener('click',onRecordClick);
  record.innerHTML = "Show Link Maker";
  
  var select = document.getElementById("linkSelect");
  select.addEventListener('click',multiselect);
  
  var noteArea = document.getElementById("notes");
  noteArea.addEventListener("input",function(vars){
    var val = vars.srcElement.value;
    chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, doMemFuncUrl(updateMemory,val));
  });
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, doMemFuncUrl(loadFromMemory));
});

function updateLinkMaker() {
  var item = document.getElementById("linkSelect");
  item.innerHTML = "";
  chrome.tabs.query({},function (results){
    for(i in results){
      var option = document.createElement("option");
      option.text = results[i].title;
      option.value = results[i].url;
      item.add(option);
    };
  });
  
  var oldConns = document.getElementById("connectionList");
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (results){
    chrome.storage.local.get("connections",function (items) {
      connections = items[results[0].url];
      connections = (connections === undefined)? []: connections;
      for(i in connections){
        var option = document.createElement("option");
        option.text = results[i];
        option.value = results[i];
        oldConns.add(option);
      }
    });
  });
}


function multiselect(e){
    var el = e.target;
    e.preventDefault();
    // toggle selection
    if (el.hasAttribute('selected')) el.removeAttribute('selected');
    else el.setAttribute('selected', '');

    // hack to correct buggy behavior
    var select = el.parentNode.cloneNode(true);
    el.parentNode.parentNode.replaceChild(select, el.parentNode);

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
};

function updateMemory(url,other) {
  var val = other[0];
  return function(items) {
    items[url]['note'] = val;
    chrome.storage.local.set(items,function () {console.log(tmp);});
  };
};

function loadFromMemory(url,other) {
  return function(items) {
    var note = items[url]['note'];
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
