import * as vscode from "vscode";
export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
export function logDucument(context:vscode.ExtensionContext){
	const fs = require('fs');
	const path = require('path');

	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const pluginPath = context.extensionPath;
		const filePath = path.join(pluginPath, './cache/src.c');
		fs.writeFileSync(filePath, document.getText());
		}
}