function statistics() {
    const host = window.location.host;
    const href = window.location.href;
    const title = document.title;
    const time = new Date().toString();
    const data = { host, href, title, time };
    return data;

}
const cmd = {
    statistics: statistics
}


async function sendToBackground(data) {
    return new Promise((res, rej) => {
        chrome.runtime.sendMessage(data, function (response) {
            res(response);
        });
    });
}

//send to background when load complete
sendToBackground(statistics());

//send statistics with background ask
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        sendResponse(cmd[request.cmd]());
    });
