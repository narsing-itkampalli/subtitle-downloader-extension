# Subtitle Downloader Chrome Extension

**Subtitle Downloader** is a lightweight Chrome extension that automatically logs `.vtt` (WebVTT subtitle) files from the network requests of any website and allows users to download them directly — including those from child iframes. It’s especially helpful when streaming platforms load subtitles dynamically and don’t provide an easy download option.


## 🎯 Features

- 🔍 Detects `.vtt` subtitle files in network requests (including iframe requests).
- 🌐 Filters for English-language subtitle files (`eng` in URL).
- 📥 One-click download of subtitle files with clean, episode-aware filenames.
- 🧠 Parses the episode title and number from the page for better file naming.
- 💡 Works without needing to open Chrome DevTools.
- ⚙️ Keeps logging subtitle requests while the tab is open.


## 📦 Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (top-right corner).
4. Click **Load unpacked**.
5. Select the extension directory (where the `manifest.json` is located).


## 🚀 How to Use

1. Visit a website that loads subtitles (e.g., a video streaming site).
2. Click on the **Subtitle Downloader** extension icon in the Chrome toolbar.
3. If English `.vtt` subtitle files were detected in the current tab:
   - A table will appear listing available subtitle files.
   - Click the **Download** button to save the file with the appropriate episode name.
4. If no subtitle files were detected:
   - You’ll see a “No files found” message.
   - Try reloading the video or enabling subtitles, then reopen the extension popup.


## 🛠️ How It Works

- The extension uses the `webRequest` API in the background to monitor all outgoing requests.
- It filters requests that:
  - End with `.vtt`
  - Contain `'eng'` in the URL (to target English subtitles)
- The popup script queries the current tab’s DOM to extract the episode number and title (from `.ep-item.active`) to use as the subtitle filename.


## 🧩 Permissions Used

| Permission       | Why It’s Needed                                   |
|------------------|----------------------------------------------------|
| `webRequest`     | To detect subtitle file requests                  |
| `tabs`           | To identify the active tab                        |
| `scripting`      | To access DOM elements of the current tab         |
| `storage`        | (Reserved for future use, e.g., persistent logs)  |
| `activeTab`      | To allow injecting scripts into the current page  |
| `<all_urls>`     | To capture all subtitle requests across websites  |


## 📁 Project Structure

```

📂 Subtitle Downloader/
├── manifest.json
├── background.js         # Captures network requests
├── popup.html            # Popup UI
├── popup.js              # Handles DOM parsing & file download
├── style.css             # (Optional) UI styling
└── icon.png              # Extension icon

```


## 📝 Notes

- Subtitles must be loaded **after the tab is opened** for them to be captured.
- The extension only stores the **latest matching subtitle request** — modify `background.js` if you want to keep multiple.
- The `.ep-item.active` DOM selector may need adjustment depending on the site you are targeting.


## 🙋 Need Help?

If you have questions, ideas, or feature requests — feel free to open an issue or start a discussion!