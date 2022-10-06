// Saves options to chrome.storage
function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}

var show_rules_clicked = false;

function show_yara_rules() {
    if (!show_rules_clicked) {
        var container = document.getElementById("rules_container");
        var iframe = document.createElement("iframe");
        iframe.width = 500;
        iframe.height = 500;
        container.appendChild(iframe);
        iframe.src = new URL(chrome.runtime.getURL('./rules.html'));
        console.log("clicked");
        show_rules_clicked = true;
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
save_options);
document.getElementById('show_rules').addEventListener('click', show_yara_rules);