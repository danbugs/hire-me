import * as vscode from 'vscode';
import { MainPanel } from './MainPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"hire-me-sidebar",
		sidebarProvider
	  )
	);

	context.subscriptions.push(vscode.commands.registerCommand('hire-me.helloWorld', () => {
		MainPanel.createOrShow(context.extensionUri);
	}));

}

export function deactivate() {}
