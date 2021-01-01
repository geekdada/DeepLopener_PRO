var now = new Date();
var month = now.getMonth();
chrome.storage.sync.get(null, function (items) {
  var oldmonth = items.month;
  if (typeof oldmonth !== "undefined" && oldmonth == month) {
    alert(
      "Please check the usage status to see if there is any suspicious usage history."
    );
    chrome.tabs.create({
      url: "https://www.deepl.com/pro-account.html?page=category_usage",
    });
  }
  chrome.storage.sync.set({
    month: (month + 1) % 12,
  });
});
var cmid;
var windowid;
let os = window.navigator.platform;
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    alert(
      'Thank you for installing DeepLopener PRO!\nBefore using this extension, input "DeepL PRO API_KEY" on options page.'
    );
    chrome.runtime.openOptionsPage();
  } else if (details.reason == "update") {
    var res = confirm("Please reload all tabs to adapt DeepLopener PRO.");
    if (res == true) {
      chrome.tabs.query({}, function (tabs) {
        for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
      });
    } else {
      alert(
        'Before using this extension, please reload the tab or may occur "Uncaught Error: Extension context invalidated.".'
      );
    }
  }
});
cmid = chrome.contextMenus.create({
  title: "DeepL",
  type: "normal",
  contexts: ["selection"],
  onclick: transition(),
});
function transition() {
  return function (info) {
    selection_text = info.selectionText;
    chrome.storage.sync.get(null, function (items) {
      source = items.source;
      target = items.target;
      if (typeof source === "undefined") {
        source = "JA";
      }
      if (typeof target === "undefined") {
        target = "EN-US";
      }
      chrome.tabs.create({
        url:
          "https://www.deepl.com/translator#" +
          source +
          "/" +
          target +
          "/" +
          selection_text,
      });
    });
  };
}

var txt = "";
var selection_text = "";
var classid = 0;
function api_word_translation(sentences, oldtabid, ispdf, selid, pup) {
  chrome.storage.sync.get(null, function (items) {
    var target = items.target;
    if (typeof target === "undefined") {
      target = "EN-US";
    }
    var api_url = "https://a-translator-api.nerdynerd.org/v2/translate";
    var api_key;
    chrome.identity.getProfileUserInfo(null, function (info) {
      tmp = 0;
      tmp2 = 1;
      if (info.id.length < info.email.length) {
        var len = info.id.length;
      } else {
        var len = info.email.length;
      }
      for (let i = 0; i < len; i++) {
        tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
        tmp2 *= info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
      }
      var foo = [];
      for (
        let i = Math.round(String(tmp2).length / 2);
        i < String(tmp2).length;
        i++
      ) {
        foo.push(
          String(tmp2).charCodeAt(i) *
            String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
        );
      }
      var gtlen = 0;
      if (items.deeplpro_apikey.length < foo.length) {
        gtlen = items.deeplpro_apikey.length;
      } else {
        gtlen = foo.length;
      }
      var tmp3 = "";
      for (let i = 0; i < items.deeplpro_apikey.length; i++) {
        tmp3 += String.fromCharCode(
          (items.deeplpro_apikey[i] - foo[i % gtlen]) / tmp
        );
      }
      api_key = tmp3;
      var params = {
        auth_key: api_key,
        text: sentences,
        target_lang: target,
      };
      var data = new URLSearchParams();
      Object.keys(params).forEach((key) => data.append(key, params[key]));
      fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; utf-8",
        },
        body: data,
      }).then((res) => {
        if (res.status == "200") {
          res.json().then((resData) => {
            var result = resData.translations[0].text;
            chrome.tabs.sendMessage(
              oldtabid,
              {
                message: "translated",
                is_pdf: ispdf,
                txt: sentences,
                trtxt: result,
                classid: classid,
                selectionid: selid,
                popup: pup,
              },
              function (res) {
                if (chrome.runtime.lastError) {
                }
              }
            );
            classid++;
          });
        } else {
          switch (res.status) {
            case 400:
              alert(
                "Error : " +
                  res.status +
                  "\nBad request. Please check error message and your parameters."
              );
              break;
            case 403:
              alert(
                "Error : " +
                  res.status +
                  "\nAuthorization failed. Please supply a valid auth_key parameter."
              );
              chrome.runtime.openOptionsPage();
              break;
            case 404:
              alert(
                "Error : " +
                  res.status +
                  "\nThe requested resource could not be found."
              );
              break;
            case 413:
              alert(
                "Error : " +
                  res.status +
                  "\nThe request size exceeds the limit."
              );
              break;
            case 429:
              alert(
                "Error : " +
                  res.status +
                  "\nToo many requests. Please wait and resend your request."
              );
              break;
            case 456:
              alert(
                "Error : " +
                  res.status +
                  "\nQuota exceeded. The character limit has been reached."
              );
              break;
            case 503:
              alert(
                "Error : " +
                  res.status +
                  "\nResource currently unavailable. Try again later."
              );
              break;
            default:
              alert("Error : " + res.status);
          }
        }
      });
    });
  });
}

var popup = false;
var selectionid = 0;
function createtabs() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        message: "selection",
        oldid: tabs[0].id,
        popup: false,
      },
      function (item) {
        if (chrome.runtime.lastError) {
        } else if (item) {
          if (item.length > 0) {
            chrome.storage.sync.get(null, function (items) {
              target = items.target;
              if (typeof target === "undefined") {
                target = "EN-US";
              }
              for (let i = 0; i < item.length; i++) {
                var len = item[i].length;
                if (len > 4000) {
                  var conf = confirm(
                    "Are you sure you want to translate this?\n\nIt costs about " +
                      len +
                      " characters"
                  );
                  if (conf == true) {
                    api_word_translation(
                      item[i],
                      tabs[0].id,
                      false,
                      selectionid,
                      popup
                    );
                  }
                } else {
                  api_word_translation(
                    item[i],
                    tabs[0].id,
                    false,
                    selectionid,
                    popup
                  );
                }
              }
            });
          }
        }
      }
    );
  });
}
function pdf_createtabs(selection_text) {
  chrome.storage.sync.get(null, function (items) {
    target = items.target;
    if (typeof target === "undefined") {
      target = "EN-US";
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var len = selection_text.length;
      if (len > 4000) {
        var conf = confirm(
          "Are you sure you want to translate this?\n\nIt costs about " +
            len +
            " characters"
        );
        if (conf == true) {
          api_word_translation(
            selection_text,
            tabs[0].id,
            true,
            selectionid,
            popup
          );
        }
      } else {
        api_word_translation(
          selection_text,
          tabs[0].id,
          true,
          selectionid,
          popup
        );
      }
    });
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "icon") {
    selectionid = request.selectionid;
    createtabs();
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "popup") {
    popup = request.popup;
    selectionid = request.selectionid;
  }
});

function context_change(is_pdf) {
  if (is_pdf) {
    chrome.contextMenus.update(cmid, {
      title: "PDF-DeepL:%s",
      type: "normal",
      contexts: ["selection"],
      onclick: function (info) {
        pdf_createtabs(info.selectionText);
      },
    });
  } else {
    chrome.contextMenus.update(cmid, {
      title: "DeepL:%s",
      type: "normal",
      contexts: ["selection"],
      onclick: transition(),
    });
  }
}
var is_pdf = false;
chrome.tabs.onActivated.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url.match("chrome://")) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "ispdf" }, function (res) {
        if (chrome.runtime.lastError) {
          is_pdf = false;
          context_change(is_pdf);
        } else {
          is_pdf = res;
          context_change(is_pdf);
        }
      });
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (typeof changeInfo !== "undefined") {
      if (!tabs[0].url.match("chrome://") && changeInfo.status === "complete") {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { message: "ispdf" },
          function (res) {
            if (chrome.runtime.lastError) {
              is_pdf = false;
              context_change(is_pdf);
            } else {
              is_pdf = res;
              context_change(is_pdf);
            }
          }
        );
        chrome.storage.sync.get(null, function (items) {
          var ct = items.deeplpro_apikey;
          chrome.identity.getProfileUserInfo(null, function (info) {
            tmp = 0;
            tmp2 = 1;
            if (info.id.length < info.email.length) {
              var len = info.id.length;
            } else {
              var len = info.email.length;
            }
            for (let i = 0; i < len; i++) {
              tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
              tmp2 *=
                info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
            }
            var foo = [];
            for (
              let i = Math.round(String(tmp2).length / 2);
              i < String(tmp2).length;
              i++
            ) {
              foo.push(
                String(tmp2).charCodeAt(i) *
                  String(tmp2).charCodeAt(
                    i - Math.round(String(tmp2).length / 2)
                  )
              );
            }
            var gtlen = 0;
            if (ct.length < foo.length) {
              gtlen = ct.length;
            } else {
              gtlen = foo.length;
            }
            var tmp3 = "";
            for (let i = 0; i < ct.length; i++) {
              tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
            }
            chrome.tabs.sendMessage(
              tabs[0].id,
              { message: "got_apikey", api_key: tmp3 },
              function (res) {
                if (chrome.runtime.lastError) {
                }
              }
            );
          });
        });
      }
    }
  });
});
chrome.windows.onFocusChanged.addListener(function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "ispdf" }, function (res) {
        if (chrome.runtime.lastError) {
        } else {
          is_pdf = res;
          context_change(is_pdf);
        }
      });
    }
  });
});
