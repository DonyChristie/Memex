function ToggleRecording(rec) {
    var button = document.getElementById("recordButton");
    console.log(button);
    button.addEventListener('click', function tempFunc() {
        button.removeEventListener('click', tempFunc);
        ToggleRecording(!rec);
    });
    button.innerHTML = ((rec) ? "Stop" : "Start") + " Recording";
}
var rec = true;


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("recordButton").addEventListener('click',function(){onRecordClick();});
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        chrome.storage.local.get(url, function (items){
            var note = items['note'];
            note = (note === undefined)? "Write a note here!":note;
            var noteArea = document.getElementById("notes");
            noteArea.innerHTML = note;
        });
    });
    var noteArea = document.getElementById("notes");
    console.log(noteArea);
    noteArea.addEventListener("onkeyup",function(vars){
        console.log(vars);
        console.log("hello!");
    });
});


/*
chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function (tabs) {
    var url = tabs[0].url;
    chrome.storage.local.get(url, function (items){
        items['note'];
        note = (note === undefined)? "Write a note here!":note;
        var noteArea = document.getElementById("notes");
        noteArea.innerHTML = note;
    });
});
*/
