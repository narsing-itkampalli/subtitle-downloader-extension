let requestLog = [];

chrome.webRequest.onCompleted.addListener(
    (details) => {
        const entry = {
            url: details.url,
            method: details.method,
            statusCode: details.statusCode,
            type: details.type,
            time: new Date().toLocaleTimeString(),
            tabId: details.tabId,
            frameId: details.frameId,
            parentFrameId: details.parentFrameId
        };
        if (entry.url.startsWith('http') && entry.url.endsWith(".vtt") && entry.url.includes('eng')) {
            requestLog = [entry];
        }

        // Optional: limit log size
        if (requestLog.length > 500) requestLog.shift();
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

// Allow popup to fetch logs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "get-logs") {
        sendResponse(requestLog);
    }
});
