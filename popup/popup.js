function ToggleRecording(rec) {
    console.log(rec);
    var button = document.getElementById("recordButton");
    console.log(button);
    button.addEventListener('click', function tempFunc() {
        button.removeEventListener('click', tempFunc);
        ToggleRecording(!rec);
    });
    button.innerHTML = ((rec) ? "Start" : "Stop") + " Recording";
}
function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}
document.addEventListener('DOMContentLoaded', function () {
    var record = document.getElementById("recordButton");
    record.addEventListener('click', function tempFunc() {
        record.removeEventListener('click', tempFunc);
        ToggleRecording(true);
    });
});
