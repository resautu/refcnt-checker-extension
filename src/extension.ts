import { commands, ExtensionContext, window, extensions } from "vscode";
import { CheckPanel } from './checkPanel';
import { logDucument } from './utils';

export function activate(context:ExtensionContext) {
	// Add command to the extension context
	context.subscriptions.push(commands.registerCommand("ref_checker.Checker_Ref", () => {
		logDucument(context);
		CheckPanel.render(context);
	}));
  }


export function deactivate() {}
