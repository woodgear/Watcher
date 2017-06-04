console.log("watcher dog background is ok");
const INTERVAL = 10000;
// const confifg = chrome.extension.getURL('config.js');
const config = { apiAddress: 'http://127.0.0.1:9527/api' }
class Api {
    static async post(data) {
        const url = `${config.apiAddress}/report`;
        return new Promise((res, rej) => {
            fetch(url, {
                method: 'post',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(data)
            })
                .then((response) => {
                    res(response.json());
                }).catch((e) => {
                    rej(e);
                });
        });
    }
}
async function reportToServer(data) {
    try {
        const res = await Api.post({ type: 'chrome', content: data });
    } catch (e) {
        console.log("err", e);
    }
}

function ask() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        tabs.map(function (tab) {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { cmd: "statistics" }, function (response) {
                    reportToServer(response);
                });
            }
        });
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        reportToServer(request);
    });


setInterval(ask, INTERVAL);
