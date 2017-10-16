var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?gdv-online\.de/;


chrome.browserAction.onClicked.addListener(function (tab) {
    if (urlRegex.test(tab.url)) {
        chrome.tabs.sendMessage(tab.id, {text: 'get_record'}, processRecord);
    }
});

function processRecord(record) {
	copyToClipboard(record)
}


function copyToClipboard(text) {
  var $temp = document.createElement('textarea');
  document.body.append($temp);
  $temp.value = text;
  $temp.select();
  document.execCommand("copy");
  $temp.remove();
}
