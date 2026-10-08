<div align="center">

# 🌐 Speech Language Switcher

<img src="earth.png" alt="Speech Language Switcher" width="128" height="128">

<strong>Switch your VS Code speech language with a single click!</strong>

<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
<a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/VS%20Code-1.85.0+-blue.svg" alt="VS Code"></a>

---

**[Overview](#-overview) • [Features](#-features) • [Usage](#-usage) • [Languages](#-supported-languages) • [Contributing](#-contributing)**

---
</div>

## 🎯 Overview

A lightweight VS Code extension that provides quick access to switch the `accessibility.voice.speechLanguage` setting. Perfect for users who work in multiple languages or need to quickly adjust their speech accessibility settings.

> ✨ **Why use this extension?** If you're using Copilot with the VS Code Speech Plugin for multiple languages (e.g., German and English), the plugin's auto-detection often fails, requiring manual language switches. This extension provides a quick status bar icon to change speech languages effortlessly, instead of navigating through settings.

## ✨ Features

| 🚀 Quick Access | 🌍 Language Support |
| --- | --- |
| 🖱️ **Status Bar Icon** - One-click access via globe icon (right side, near Copilot) | 🗣️ **30+ Languages** - Comprehensive language support for speech synthesis |
| 📊 **Current Language Display** - Always see your active speech language | 🔄 **Instant Updates** - Changes apply immediately to your settings |
| ⚡ **Intuitive Interface** - Simple quick pick menu for language selection | 🎯 **Smart Detection** - Automatically loads your current language setting |

### Key Highlights

- ✅ **Zero Configuration** - Works out-of-the-box with no setup required
- 🎨 **Seamless Integration** - Positioned conveniently near the Copilot icon
- 🔒 **Persistent Settings** - Your language choice is saved in VS Code settings
- ⚡ **Lightweight** - Minimal performance impact on your editor

## 🚀 Usage

### Quick Pick Menu

1. **Click** the globe icon (🌐) in the status bar (right side, positioned near the Copilot icon)
2. **Select** your desired speech language from the quick pick menu
3. **Done!** The setting updates automatically and the status bar reflects your choice

### Keyboard Shortcuts

You can configure custom keyboard shortcuts to switch between languages quickly. Open your `keybindings.json` file (File > Preferences > Keyboard Shortcuts > Open Keyboard Shortcuts JSON) and add entries like this:

```json
{
  "key": "ctrl+alt+e",
  "command": "speechLanguageSwitch.switchToLanguage",
  "args": "en-US"
},
{
  "key": "ctrl+alt+d",
  "command": "speechLanguageSwitch.switchToLanguage",
  "args": "de-DE"
},
{
  "key": "ctrl+alt+f",
  "command": "speechLanguageSwitch.switchToLanguage",
  "args": "fr-FR"
}
```

Replace the `key` value with your preferred keyboard shortcut and the `args` value with any supported language code from the list below.

## 🌍 Supported Languages

The extension supports a comprehensive range of speech languages:

<details>
<summary>📋 Click to view all 30+ supported languages</summary>

### English Variants
- 🇺🇸 English (US) - `en-US`
- 🇬🇧 English (UK) - `en-GB`
- 🇦🇺 English (Australia) - `en-AU`
- 🇨🇦 English (Canada) - `en-CA`
- 🇮🇳 English (India) - `en-IN`

### European Languages
- 🇩🇪 German (Germany) - `de-DE`
- 🇨🇭 German (Switzerland) - `de-CH`
- 🇪🇸 Spanish (Spain) - `es-ES`
- 🇲🇽 Spanish (Mexico) - `es-MX`
- 🇫🇷 French (France) - `fr-FR`
- 🇨🇦 French (Canada) - `fr-CA`
- 🇮🇹 Italian - `it-IT`
- 🇳🇱 Dutch - `nl-NL`
- 🇵🇹 Portuguese (Portugal) - `pt-PT`
- 🇧🇷 Portuguese (Brazil) - `pt-BR`
- 🇵🇱 Polish - `pl-PL`
- 🇷🇺 Russian - `ru-RU`
- 🇹🇷 Turkish - `tr-TR`

### Nordic Languages
- 🇸🇪 Swedish - `sv-SE`
- 🇳🇴 Norwegian - `nb-NO`
- 🇩🇰 Danish - `da-DK`
- 🇫🇮 Finnish - `fi-FI`

### Asian Languages
- 🇯🇵 Japanese - `ja-JP`
- 🇰🇷 Korean - `ko-KR`
- 🇨🇳 Chinese (Simplified) - `zh-CN`
- 🇹🇼 Chinese (Traditional) - `zh-TW`
- 🇹🇭 Thai - `th-TH`
- 🇻🇳 Vietnamese - `vi-VN`
- 🇮🇳 Hindi - `hi-IN`

### Other Languages
- 🇨🇿 Czech - `cs-CZ`
- 🇸🇦 Arabic - `ar-SA`
- 🇮🇱 Hebrew - `he-IL`

</details>

## 🤝 Contributing

Want to contribute? We'd love your help!

### 🚀 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vscode-speech-language-switch.git
   cd vscode-speech-language-switch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   - Press `F5` or go to Run → Start Debugging
   - A new VS Code window will open with the extension loaded

4. **Build the extension**
   ```bash
   npm run compile
   ```

---

<div align="center">

⭐ Like Speech Language Switcher? A [star on GitHub](https://github.com/firsttris/vscode-speech-language-switch) helps others find it.<br>
🐛 [Report a bug](https://github.com/firsttris/vscode-speech-language-switch/issues/new?template=bug_report.md) · 💡 [Request a feature](https://github.com/firsttris/vscode-speech-language-switch/issues/new?template=feature_request.md)

<sub>License: <a href="LICENSE">MIT</a> · © Tristan Teufel and contributors</sub>

</div>
