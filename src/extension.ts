import * as vscode from "vscode";

// Common speech languages supported by VS Code
const SPEECH_LANGUAGES = [
	{ label: "English (US)", value: "en-US" },
	{ label: "English (UK)", value: "en-GB" },
	{ label: "English (Australia)", value: "en-AU" },
	{ label: "English (Canada)", value: "en-CA" },
	{ label: "English (India)", value: "en-IN" },
	{ label: "German (Germany)", value: "de-DE" },
	{ label: "German (Switzerland)", value: "de-CH" },
	{ label: "Spanish (Spain)", value: "es-ES" },
	{ label: "Spanish (Mexico)", value: "es-MX" },
	{ label: "French (France)", value: "fr-FR" },
	{ label: "French (Canada)", value: "fr-CA" },
	{ label: "Italian (Italy)", value: "it-IT" },
	{ label: "Japanese (Japan)", value: "ja-JP" },
	{ label: "Korean (Korea)", value: "ko-KR" },
	{ label: "Portuguese (Brazil)", value: "pt-BR" },
	{ label: "Portuguese (Portugal)", value: "pt-PT" },
	{ label: "Chinese (Simplified, China)", value: "zh-CN" },
	{ label: "Chinese (Traditional, Taiwan)", value: "zh-TW" },
	{ label: "Russian (Russia)", value: "ru-RU" },
	{ label: "Dutch (Netherlands)", value: "nl-NL" },
	{ label: "Polish (Poland)", value: "pl-PL" },
	{ label: "Turkish (Turkey)", value: "tr-TR" },
	{ label: "Swedish (Sweden)", value: "sv-SE" },
	{ label: "Norwegian (Norway)", value: "nb-NO" },
	{ label: "Danish (Denmark)", value: "da-DK" },
	{ label: "Finnish (Finland)", value: "fi-FI" },
	{ label: "Czech (Czech Republic)", value: "cs-CZ" },
	{ label: "Hindi (India)", value: "hi-IN" },
	{ label: "Arabic (Saudi Arabia)", value: "ar-SA" },
	{ label: "Hebrew (Israel)", value: "he-IL" },
	{ label: "Thai (Thailand)", value: "th-TH" },
	{ label: "Vietnamese (Vietnam)", value: "vi-VN" },
];

let statusBarItem: vscode.StatusBarItem;
let extensionContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
	extensionContext = context;
	// Create status bar item on the right side with high priority (close to Copilot icon)
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100, // High priority to position it close to Copilot
	);

	statusBarItem.command = "speechLanguageSwitch.selectLanguage";
	statusBarItem.tooltip = "Switch Speech Language";

	// Set icon (using globe icon for language)
	statusBarItem.text = "$(globe)";

	// Update status bar to show current language
	updateStatusBar();

	statusBarItem.show();

	// Register the command
	const disposable = vscode.commands.registerCommand(
		"speechLanguageSwitch.selectLanguage",
		async () => {
			await selectLanguage();
		},
	);

	// Register command for direct language switching
	const switchToLanguageDisposable = vscode.commands.registerCommand(
		"speechLanguageSwitch.switchToLanguage",
		async (languageCode?: string) => {
			if (languageCode) {
				await switchToLanguage(languageCode);
			} else {
				// If no language code provided, show the picker
				await selectLanguage();
			}
		},
	);

	// Listen for configuration changes to update the status bar and keybindings
	const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
		(e) => {
			if (e.affectsConfiguration("accessibility.voice.speechLanguage")) {
				updateStatusBar();
			}
			if (e.affectsConfiguration("speechLanguageSwitch.shortcuts")) {
				registerDynamicKeybindings(context);
			}
		},
	);

	// Register dynamic keybindings based on user configuration
	registerDynamicKeybindings(context);

	context.subscriptions.push(
		statusBarItem,
		disposable,
		switchToLanguageDisposable,
		configChangeDisposable,
	);
}

async function selectLanguage() {
	const config = vscode.workspace.getConfiguration();
	const currentLanguage = config.get<string>(
		"accessibility.voice.speechLanguage",
		"en-US",
	);

	// Get language history from global state
	const history = extensionContext.globalState.get<string[]>(
		"languageHistory",
		[],
	);

	// Create quick pick items with current language marked
	const quickPickItems = SPEECH_LANGUAGES.map((lang) => ({
		label: lang.label,
		description: lang.value === currentLanguage ? "$(check) Current" : "",
		value: lang.value,
	}));

	// Sort by history - recently used languages at the top
	quickPickItems.sort((a, b) => {
		const aIndex = history.indexOf(a.value);
		const bIndex = history.indexOf(b.value);

		// If both in history, sort by most recent (lower index = more recent)
		if (aIndex !== -1 && bIndex !== -1) {
			return aIndex - bIndex;
		}
		// If only a is in history, it goes first
		if (aIndex !== -1) {
			return -1;
		}
		// If only b is in history, it goes first
		if (bIndex !== -1) {
			return 1;
		}
		// Neither in history, keep original order
		return 0;
	});

	const selected = await vscode.window.showQuickPick(quickPickItems, {
		placeHolder: "Select speech language",
		matchOnDescription: true,
	});

	if (selected) {
		try {
			// Update the setting globally
			await config.update(
				"accessibility.voice.speechLanguage",
				selected.value,
				vscode.ConfigurationTarget.Global,
			);

			// Update history - add to front, remove duplicates, keep last 10
			const newHistory = [
				selected.value,
				...history.filter((v) => v !== selected.value),
			].slice(0, 10);
			await extensionContext.globalState.update("languageHistory", newHistory);

			// Update status bar
			updateStatusBar();
		} catch (error) {
			vscode.window.showErrorMessage(
				`Failed to update speech language: ${error}`,
			);
		}
	}
}

async function switchToLanguage(languageCode: string) {
	try {
		// Validate the language code
		const lang = SPEECH_LANGUAGES.find((l) => l.value === languageCode);
		if (!lang) {
			vscode.window.showWarningMessage(
				`Unknown language code: ${languageCode}`,
			);
			return;
		}

		const config = vscode.workspace.getConfiguration();
		await config.update(
			"accessibility.voice.speechLanguage",
			languageCode,
			vscode.ConfigurationTarget.Global,
		);

		// Update history
		const history = extensionContext.globalState.get<string[]>(
			"languageHistory",
			[],
		);
		const newHistory = [
			languageCode,
			...history.filter((v) => v !== languageCode),
		].slice(0, 10);
		await extensionContext.globalState.update("languageHistory", newHistory);

		// Update status bar
		updateStatusBar();

		// Show brief confirmation
		vscode.window.setStatusBarMessage(
			`Speech language switched to ${lang.label}`,
			3000,
		);
	} catch (error) {
		vscode.window.showErrorMessage(
			`Failed to switch speech language: ${error}`,
		);
	}
}

function registerDynamicKeybindings(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("speechLanguageSwitch");
	const shortcuts = config.get<Record<string, string>>("shortcuts", {});

	// Note: VS Code doesn't support dynamic keybindings registration via API
	// Instead, we'll provide instructions to users on how to set up keybindings manually
	// Users can set keybindings in their keybindings.json like:
	// {
	//   "key": "ctrl+alt+e",
	//   "command": "speechLanguageSwitch.switchToLanguage",
	//   "args": "en-US"
	// }

	// For now, we'll just validate the configured shortcuts
	for (const [languageCode, keybinding] of Object.entries(shortcuts)) {
		const lang = SPEECH_LANGUAGES.find((l) => l.value === languageCode);
		if (!lang) {
			console.warn(
				`Invalid language code in shortcuts configuration: ${languageCode}`,
			);
		}
	}
}

function updateStatusBar() {
	const config = vscode.workspace.getConfiguration();
	const currentLanguage = config.get<string>(
		"accessibility.voice.speechLanguage",
		"en-US",
	);

	// Find the language label
	const lang = SPEECH_LANGUAGES.find((l) => l.value === currentLanguage);
	const langLabel = lang
		? lang.label.split(" ")[0]
		: currentLanguage.split("-")[0].toUpperCase();

	// Update status bar with icon and short language code
	statusBarItem.text = `$(globe) ${langLabel}`;
}

export function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
