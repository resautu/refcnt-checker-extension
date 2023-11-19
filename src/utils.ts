import * as vscode from "vscode";
export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
const fs = require('fs');
// 读取JSON文件
const readJsonFile = (filePath: string): any => {
	const data = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(data);
};
  
  // 写入JSON文件
const writeJsonFile = (filePath: string, data: any): void => {
	const jsonString = JSON.stringify(data, null, 2);
	fs.writeFileSync(filePath, jsonString, 'utf-8');
};

const updateJsonValue = (filePath: string, newValue: string): void => {
	// 读取JSON文件
	const jsonData = readJsonFile(filePath);
  
	// 修改值
	if (jsonData && jsonData.ToolConfig && jsonData.ToolConfig.module) {
	  jsonData.ToolConfig.module = newValue;
	}
  
	// 写入JSON文件
	writeJsonFile(filePath, jsonData);
};


export function logDucument(context:vscode.ExtensionContext){
	
	const fs = require('fs');
	const path = require('path');

	const editor = vscode.window.activeTextEditor;
	
	if (editor) {
		if(editor?.document.languageId !== 'c'){
			vscode.window.showErrorMessage('Please open a C file!');
			return false;
		}
		const document = editor.document;
		const pluginPath = context.extensionPath;
		const filePath = path.join(pluginPath, './cache/src.c');
		fs.writeFileSync(filePath, document.getText());
		const jsonPath = path.join(pluginPath, './settings.json');
		updateJsonValue(jsonPath, filePath);
		return true;
	}
	vscode.window.showErrorMessage('Please open a C file!');
	return false;
}

function findLine(content: string, target: string){
	
	let lines = content.split('\n');
	let lineNum = 1;
	for (const line of lines){
		if (line.includes(target)){
			return lineNum;
		}
		lineNum++;
	}
}

export function writeLog(path: string, ducumentPath: string){
    const fs = require('fs');
	const content = fs.readFileSync(path, 'utf-8').replace(/\x1B\[[0-9;]*[mK]/g, '');
	const srcFile = fs.readFileSync(ducumentPath, 'utf-8');

	let lines = content.split('\n').filter((line: string) => line.trim().startsWith('<bugReport>'));
    let logInform = '';
	let beginLines = content.split('\n').filter((line: string) => line.trim().startsWith('<runOnModule>'));
	for (const line of beginLines){
		logInform += '<p class="inform-text">' + line + '</p>';
	}

	let hshMap = new Map<string, number | undefined>();
    for (const line of lines) {
		//从line中提取函数名称
		let buginfo : string = line;
		const match = buginfo.match(/Function:([a-zA-Z0-9_]+);/);
		//console.log(match);
		if (match){
			const funcName = match[1];
			let lineNum : number | undefined = 0;
			if(hshMap.has(funcName)){
				lineNum = hshMap.get(funcName);
			} else{
				lineNum = findLine(srcFile, funcName);
				hshMap.set(funcName, lineNum);
			}
			buginfo = buginfo.replace(/Line:\d+/, `Line:${lineNum}`);
		} else{
			buginfo = buginfo.replace(/Line:\d+/, `Line:count not find the line of Function!! `);
		
		}
        logInform += '<li class="error-text">' + buginfo + '</li>';
    }
	//console.log(logInform);
	return logInform;
}