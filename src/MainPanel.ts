import * as vscode from "vscode";
import { apiBaseUrl } from "./contants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";

export class MainPanel {
    public static currentPanel: MainPanel | undefined;

    public static readonly viewType = "main";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (MainPanel.currentPanel) {
            MainPanel.currentPanel._panel.reveal(column);
            MainPanel.currentPanel._update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            MainPanel.viewType,
            "Hire Me!",
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,

                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, "media"),
                    vscode.Uri.joinPath(extensionUri, "out/compiled"),
                ],
            }
        );

        MainPanel.currentPanel = new MainPanel(panel, extensionUri);
    }

    public static kill() {
        MainPanel.currentPanel?.dispose();
        MainPanel.currentPanel = undefined;
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        MainPanel.currentPanel = new MainPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        MainPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        const webview = this._panel.webview;

        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "get-token": {
                    await webview.postMessage({
                      type: "token",
                      value: TokenManager.getToken(),
                    });
                    break;
                  }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out/compiled", "Main.js")
        );

        const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri,
            "media",
            "reset.css"
        ));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri,
            "media",
            "vscode.css"
        ));

        const nonce = getNonce();

        return `<!DOCTYPE html>
		<html lang="en">
            <head>
                <meta charset="UTF-8">
                    <!--
                        Use a content security policy to only allow loading images from https or from our extension directory,
                        and only allow scripts that have a specific nonce.
                    -->
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesResetUri}" rel="stylesheet">
                <link href="${stylesMainUri}" rel="stylesheet">
                <link href="" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                    const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
                </script>
            </head>
            <body>
            </body>
            <script src="${scriptUri}" nonce="${nonce}">
		</html>`;
    }
}