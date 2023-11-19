import { commands, ExtensionContext, window, extensions, Uri } from "vscode";
import { CheckPanel } from './checkPanel';
import { logDucument } from './utils';
import { execSync } from 'child_process';

function excuteTool(context:ExtensionContext) {
	if(!logDucument(context)){
		return;
	}

	const currentWorkingDirectory = process.cwd();
	const targetDirectory = 'bin';
	try {
		// 切换到目标目录
		process.chdir(targetDirectory);
	  
		// 要执行的系统命令（在目标目录执行tool程序）
		const command = './tool ../settings.json > ./cache/log'; // 请根据你的实际情况替换为正确的命令
	  
		// 使用execSync同步执行系统命令
		const output = execSync(command, { encoding: 'utf-8' });
		console.log(`命令执行成功，输出:\n${output}`);
	  } catch (error) {
		if (error instanceof Error) {
			console.error(`执行命令时出错: ${error.message}`);
		}
	  } finally {
		// 切回原来的工作目录
		process.chdir(currentWorkingDirectory);
	}
	
}

export function activate(context:ExtensionContext) {
	// Add command to the extension context
	context.subscriptions.push(commands.registerCommand("ref_checker.Checker_Ref", () => {
		window.showWarningMessage('Please make sure you have set the settings.json\nfirst for this source file!');
		excuteTool(context);
		CheckPanel.render(context);
	}));
	context.subscriptions.push(commands.registerCommand("ref_checker.Settings", () => {
			const path = require('path');
			const settingsPath = path.join(context.extensionPath, './settings.json');
			const settingsUri = Uri.file(settingsPath);
			window.showTextDocument(settingsUri);

	}));
  }


export function deactivate() {}
