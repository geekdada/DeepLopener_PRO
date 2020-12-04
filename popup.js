var ispdf;
function winclose() {
  window.close();
}
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var url = tabs[0].url;
  if (!url.match(/chrome:\/\//)) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "ispdf" }, function (res) {
      if (res == true) {
        ispdf = true;
      } else {
        ispdf = false;
      }
      document.querySelector(".icon").innerHTML =
        "<img src=" + '"' + chrome.runtime.getURL("icon24.png") + '">';
      if (ispdf) {
        winclose();
      } else {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { message: "selectionmode" },
              function (res) {
                setTimeout(winclose, 15000);
              }
            );
          }
        );
      }
    });
  } else {
    winclose();
  }
});

document.querySelector("#pagetrans").onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "get_body_length" },
      function (len) {
        var conf = confirm(
          "Are you sure you want to translate this?\n\nIt costs " +
            len +
            " characters"
        );
        if (conf == true) {
          if (len > 4000) {
            var really = confirm(
              "CAUTION!\n\nIt costs about " + len / 400 + " JPY!"
            );
            if (really == true) {
              chrome.tabs.sendMessage(
                tabs[0].id,
                { message: "page_translate" },
                function () {}
              );
            }
          } else {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { message: "page_translate" },
              function () {}
            );
          }
          winclose();
        }
      }
    );
  });
};
