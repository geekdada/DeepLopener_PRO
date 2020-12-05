function save_options() {
  chrome.extension.isAllowedIncognitoAccess(function (allowed) {
    if (document.querySelector("#deeplpro_apikey").value == undefined) {
      document.querySelector("#deeplpro_apikey").value = "";
    }
    chrome.storage.sync.set(
      {
        target: document.querySelector("#target").value,
        iconflag: document.querySelector("#iconflag").value,
        hoverflag: document.querySelector("#hoverflag").value,
        deeplpro_apikey: document.querySelector("#deeplpro_apikey").value,
      },
      function () {
        var save = document.querySelector("#message");
        save.textContent = "Saved!";
        setTimeout(function () {
          save.textContent = "";
        }, 1500);
      }
    );
  });
  chrome.tabs.query({}, function (tabs) {
    for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
  });
}

function restore_options() {
  chrome.storage.sync.get(
    {
      target: "EN-US",
      iconflag: "Enable",
      hoverflag: "Enable",
      deeplpro_apikey: "",
    },
    function (items) {
      document.querySelector("#target").value = items.target;
      document.querySelector("#iconflag").value = items.iconflag;
      document.querySelector("#hoverflag").value = items.hoverflag;
      document.querySelector("#deeplpro_apikey").value = items.deeplpro_apikey;
    }
  );
}

function api_test() {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.storage.sync.set(
    {
      target: document.querySelector("#target").value,
      iconflag: document.querySelector("#iconflag").value,
      hoverflag: document.querySelector("#hoverflag").value,
      deeplpro_apikey: document.querySelector("#deeplpro_apikey").value,
    },
    function () {
      var save = document.querySelector("#message");
      save.textContent = "Saved!";
      setTimeout(function () {
        save.textContent = "";
      }, 1500);
      chrome.storage.sync.get(null, function (items) {
        var target = items.target;
        var api_key = items.deeplpro_apikey;
        if (typeof target === "undefined") {
          target = "EN-US";
        }
        var api_url = "https://api.deepl.com/v2/translate";
        var params = {
          auth_key: api_key,
          text: "認証成功",
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
              document.querySelector("#apitestm").style.color = "";
              document.querySelector("#apitestm").innerText =
                resData.translations[0].text + "!";
            });
          } else {
            document.querySelector("#apitestm").style.color = "red";
            switch (res.status) {
              case 400:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nBad request. Please check error message and your parameters.";
                break;
              case 403:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nAuthorization failed. Please supply a valid auth_key parameter.";
                break;
              case 404:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nThe requested resource could not be found.";
                break;
              case 413:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nThe request size exceeds the limit.";
                break;
              case 429:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nToo many requests. Please wait and resend your request.";
                break;
              case 456:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nQuota exceeded. The character limit has been reached.";
                break;
              case 503:
                document.querySelector("#apitestm").innerText =
                  "Error : " +
                  res.status +
                  "\nResource currently unavailable. Try again later.";
                break;
              default:
                document.querySelector("#apitestm").innerText =
                  "Error : " + res.status;
            }
          }
        });
      });
    }
  );
}

document.querySelector(".icon").innerHTML =
  '<p>Translation icon:(When "Enable",translation icon <img src=' +
  '"' +
  chrome.runtime.getURL("icon24.png") +
  '"' +
  "> is displayed.)";
document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
document.querySelector("#apitest").addEventListener("click", api_test);
