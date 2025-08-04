function showSubtitles(title) {
    title = title.episode.name ? `Episode ${title.episode.number} - ${title.episode.name}` : title.pageTitle;

    chrome.runtime.sendMessage({ type: "get-logs" }, (logs) => {
        const tbody = document.querySelector("tbody");
        const titleEl = document.querySelector('.title');

        tbody.innerHTML = '';
        titleEl.innerHTML = title;

        logs = logs.reverse().filter(log => {
            return log.url.startsWith('http') && log.url.endsWith(".vtt") && log.url.includes('eng');
        });

        logs = Array.from(new Set(logs.map(log => log.url)));

        if (!logs.length) {
            tbody.append(noFileFound());
        } else {
            logs.forEach(log => {
                tbody.append(fileTr(log, title));
            });
        }
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
            // This runs in the context of the page
            const title = document.querySelector('.ep-item.active')?.innerText;
            const episode = {
                number: 0,
                name: ''
            };

            if (title) {
                const match = /^eps\s*(\d+):\n*(.*?)$/gi.exec(title);
                if (match) {
                    episode.number = match[1];
                    episode.name = match[2];
                }
            }

            return {
                pageTitle: document.title,
                episode
            };
        }
    }, (results) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

        showSubtitles(results[0].result);
    });
});

async function downloadExternalVTT(url, filename) {
    try {
        const response = await fetch(url, { mode: 'cors' });

        if (!response.ok) throw new Error('Fetch failed with status ' + response.status);

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.warn("Download failed, opening in new tab:", error);
        window.open(url, '_blank');
    }
}

function fileTr(link, name) {
    const fileName = link.split('/').pop();
    const a = el('a', 'Download');
    a.href = link;
    a.classList.add('download-btn');
    a.setAttribute('download', `${name}.vtt`);

    a.onclick = (e) => {
        e.preventDefault();
        downloadExternalVTT(link, `${name}.vtt`);
    }

    return el('tr', el('td', fileName), el('td', a));
}

function noFileFound() {
    const td = el('td', 'No files found.');
    td.setAttribute('colspan', '2');
    td.classList.add('no-files');
    return el('tr', td)
}

function el(tagName, ...children) {
    const element = document.createElement(tagName);
    children.forEach(child => element.append(child));
    return element;
}