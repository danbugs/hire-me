import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { MainPanel } from './MainPanel';
import { SidebarProvider } from './SidebarProvider';
import { TokenManager } from './TokenManager';

export function activate(context: vscode.ExtensionContext) {
	TokenManager.globalState = context.globalState;

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"hire-me-sidebar",
		sidebarProvider
	  )
	);

	context.subscriptions.push(vscode.commands.registerCommand('hire-me.main', () => {
		MainPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand("hire-me.authenticate", () => {
		  try {
			authenticate(() => {});
		  } catch (err) {
			console.log(err);
		  }
		})
	  );
	

}

export function deactivate() {}
