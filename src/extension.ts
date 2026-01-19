import * as vscode from 'vscode';

// Common speech languages supported by VS Code
const SPEECH_LANGUAGES = [
    { label: 'English (US)', value: 'en-US' },
    { label: 'English (UK)', value: 'en-GB' },
    { label: 'English (Australia)', value: 'en-AU' },
    { label: 'English (Canada)', value: 'en-CA' },
    { label: 'English (India)', value: 'en-IN' },
    { label: 'German (Germany)', value: 'de-DE' },
    { label: 'German (Switzerland)', value: 'de-CH' },
    { label: 'Spanish (Spain)', value: 'es-ES' },
    { label: 'Spanish (Mexico)', value: 'es-MX' },
    { label: 'French (France)', value: 'fr-FR' },
    { label: 'French (Canada)', value: 'fr-CA' },
    { label: 'Italian (Italy)', value: 'it-IT' },
    { label: 'Japanese (Japan)', value: 'ja-JP' },
    { label: 'Korean (Korea)', value: 'ko-KR' },
    { label: 'Portuguese (Brazil)', value: 'pt-BR' },
    { label: 'Portuguese (Portugal)', value: 'pt-PT' },
    { label: 'Chinese (Simplified, China)', value: 'zh-CN' },
    { label: 'Chinese (Traditional, Taiwan)', value: 'zh-TW' },
    { label: 'Russian (Russia)', value: 'ru-RU' },
    { label: 'Dutch (Netherlands)', value: 'nl-NL' },
    { label: 'Polish (Poland)', value: 'pl-PL' },
    { label: 'Turkish (Turkey)', value: 'tr-TR' },
    { label: 'Swedish (Sweden)', value: 'sv-SE' },
    { label: 'Norwegian (Norway)', value: 'nb-NO' },
    { label: 'Danish (Denmark)', value: 'da-DK' },
    { label: 'Finnish (Finland)', value: 'fi-FI' },
    { label: 'Czech (Czech Republic)', value: 'cs-CZ' },
    { label: 'Hindi (India)', value: 'hi-IN' },
    { label: 'Arabic (Saudi Arabia)', value: 'ar-SA' },
    { label: 'Hebrew (Israel)', value: 'he-IL' },
    { label: 'Thai (Thailand)', value: 'th-TH' },
    { label: 'Vietnamese (Vietnam)', value: 'vi-VN' }
];

let statusBarItem: vscode.StatusBarItem;
let extensionContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    // Create status bar item on the right side with high priority (close to Copilot icon)
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100 // High priority to position it close to Copilot
    );
    
    statusBarItem.command = 'speechLanguageSwitch.selectLanguage';
    statusBarItem.tooltip = 'Switch Speech Language';
    
    // Set icon (using globe icon for language)
    statusBarItem.text = '$(globe)';
    
    // Update status bar to show current language
    updateStatusBar();
    
    statusBarItem.show();
    
    // Register the command
    const disposable = vscode.commands.registerCommand(
        'speechLanguageSwitch.selectLanguage',
        async () => {
            await selectLanguage();
        }
    );
    
    // Listen for configuration changes to update the status bar
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('accessibility.voice.speechLanguage')) {
            updateStatusBar();
        }
    });
    
    context.subscriptions.push(statusBarItem, disposable, configChangeDisposable);
}

async function selectLanguage() {
    const config = vscode.workspace.getConfiguration();
    const currentLanguage = config.get<string>('accessibility.voice.speechLanguage', 'en-US');
    
    // Get language history from global state
    const history = extensionContext.globalState.get<string[]>('languageHistory', []);
    
    // Create quick pick items with current language marked
    let quickPickItems = SPEECH_LANGUAGES.map(lang => ({
        label: lang.label,
        description: lang.value === currentLanguage ? '$(check) Current' : '',
        value: lang.value
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
        placeHolder: 'Select speech language',
        matchOnDescription: true
    });
    
    if (selected) {
        try {
            // Update the setting globally
            await config.update(
                'accessibility.voice.speechLanguage',
                selected.value,
                vscode.ConfigurationTarget.Global
            );
            
            // Update history - add to front, remove duplicates, keep last 10
            const newHistory = [selected.value, ...history.filter(v => v !== selected.value)].slice(0, 10);
            await extensionContext.globalState.update('languageHistory', newHistory);
            
            // Update status bar
            updateStatusBar();
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to update speech language: ${error}`
            );
        }
    }
}

function updateStatusBar() {
    const config = vscode.workspace.getConfiguration();
    const currentLanguage = config.get<string>('accessibility.voice.speechLanguage', 'en-US');
    
    // Find the language label
    const lang = SPEECH_LANGUAGES.find(l => l.value === currentLanguage);
    const langLabel = lang ? lang.label.split(' ')[0] : currentLanguage.split('-')[0].toUpperCase();
    
    // Update status bar with icon and short language code
    statusBarItem.text = `$(globe) ${langLabel}`;
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
