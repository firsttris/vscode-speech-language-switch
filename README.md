# Speech Language Switcher

A VS Code extension that allows you to quickly switch the `accessibility.voice.speechLanguage` setting via a convenient status bar icon.

## Features

- **Status Bar Icon**: Quick access to language switching via a globe icon in the status bar (positioned on the right side, near the Copilot icon)
- **Language Selection**: Choose from 30+ supported speech languages through an intuitive quick pick menu
- **Current Language Display**: The status bar shows your current speech language
- **Automatic Settings Update**: Changes are immediately applied to your VS Code settings

## Usage

1. Click the globe icon ($(globe)) in the status bar on the right side
2. Select your desired speech language from the quick pick menu
3. The setting is automatically updated and the status bar reflects the change

## Supported Languages

The extension supports a wide range of languages including:
- English (US, UK, Australia, Canada, India)
- German (Germany, Switzerland)
- Spanish (Spain, Mexico)
- French (France, Canada)
- Italian, Japanese, Korean
- Portuguese (Brazil, Portugal)
- Chinese (Simplified, Traditional)
- Russian, Dutch, Polish, Turkish
- Swedish, Norwegian, Danish, Finnish
- Czech, Hindi, Arabic, Hebrew
- Thai, Vietnamese

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Testing

Press `F5` to open a new VS Code window with the extension loaded.

## Requirements

VS Code 1.85.0 or higher

## License

MIT
