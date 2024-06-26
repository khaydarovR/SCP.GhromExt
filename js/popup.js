const API_URL = "https://2694285-em19977.twc1.net/";
const saveBtn = document.getElementById("saveTok");
const injectBtn = document.getElementById("inject");
const tok = document.getElementById("tok");

tryLoadToken();
function tryLoadToken() {
  const oldToken = localStorage.getItem("bos-token");
  if (oldToken) {
    tok.value = oldToken;
    console.log("token loaded from localstorage");
  }
}

saveBtn.addEventListener("click", () => {
  localStorage.setItem("bos-token", tok.value);
});

injectBtn.addEventListener("click", () => {
  console.log(tok.value);
  chrome.tabs.query({ active: true }, (tabs) => {
    const tab = tabs[0];
    if (tab) {
      getRecFromApi(tab.url).then((r) => {
        r.json().then((data) => {
          if (data.pw && data.login) {
            console.log("Injecting login and password ...");
            injectScriptToTab(tab.id, data.login, data.pw);
          } else {
            alert(data[0]);
          }
        });
      });
    } else {
      alert("Нет активных вкладок");
    }
  });
});

function injectScriptToTab(tabId, l, p) {
  chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      func: injectToForm,
      args: [l, p],
    })
    .then(() => console.log("injected a function"));
}
function changeBackgroundColor() {
  document.body.style.backgroundColor = "red";
}
function injectToForm(l, p) {
  const loginField = document.querySelectorAll("input")[0];
  const passwordField = document.querySelectorAll("input")[1];

  if (loginField && passwordField) {
    loginField.value = l;
    passwordField.value = p;
  } else {
    alert("Поле для заполнения не найден");
  }
  alert("Логин и пароль успешно получены\n" + l + " : " + p);
}

function getRecFromApi(forRes) {
  const t = localStorage.getItem("bos-token");
  console.log("fetch... ");
  return fetch(`${API_URL}api/Record/ReadMatch`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": t,
      "For-Res": forRes,
    },
    //JSON.stringify({key1: 'value1', key2: 'value2'})
  });
}
