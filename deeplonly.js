console.log("deeplonly.js loaded");

function hoge() {
  let target = document.getElementsByClassName(
    "lmt__textarea lmt__target_textarea lmt__textarea_base_style"
  )[0];

  if (!target) {
    setTimeout(hoge, 100);
  } else {
    if (target.value == "") {
      setTimeout(hoge, 100);
    } else {
      return target.value; //get translated text
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.text == "get_translated") {
    var translatedtext = hoge();
    sendResponse(translatedtext);
  }
  sendResponse();
  return true;
});
