import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import {getUri} from "./utils";

export class CheckPanel {
    public static currentPanel: CheckPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
      this._panel = panel;
      this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  
      this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
      this._setWebviewMessageListener(this._panel.webview);
    }
  
    public static render(extensionUri: Uri) {
      
      if (CheckPanel.currentPanel) {
        CheckPanel.currentPanel._panel.reveal(ViewColumn.One);
      } else {
        const panel = window.createWebviewPanel(
          "results of checker",
          "Ref_Checker Results",
          ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [
                Uri.joinPath(extensionUri, "out"), 
                Uri.joinPath(extensionUri, "assets"),
                Uri.joinPath(extensionUri, "modules"),
                Uri.joinPath(extensionUri, "cache")
            ],
          }
        );
  
        CheckPanel.currentPanel = new CheckPanel(panel, extensionUri);
      }
    }
  
    public dispose() {
      CheckPanel.currentPanel = undefined;
  
      this._panel.dispose();
  
      while (this._disposables.length) {
        const disposable = this._disposables.pop();
        if (disposable) {
          disposable.dispose();
        }
      }
    }
  
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
      const stylesUri = getUri(webview, extensionUri, ["assets", "checkform.css"]);
      const myImage = getUri(webview, extensionUri, ["assets", "1.png"]);
      const jsModule = getUri(webview, extensionUri, ["modules", "misc.js"]);
      const logPath = getUri(webview, extensionUri, ["cache", "log"]);
      return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Checker Result!</title>
            <link href="${stylesUri}" rel="stylesheet">
            <script src="${jsModule}"></script>
            <h1 class="text_color">Results of Ref-Cnt checker checker</h1>
          </head>
          <body>
            <script>writeLog(${logPath})</script>
            <div>
              <ul>
              <script>writeLog(${logPath})</script>
              </ul>
            </div>
                      <!--<vscode-button id="howdy">Howdy!</vscode-button>-->
            <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
          </body>
        </html>
      `;
    }
  
    private _setWebviewMessageListener(webview: Webview) {
      webview.onDidReceiveMessage(
        (message: any) => {
          const command = message.command;
          const text = message.text;
  
          switch (command) {
            case "hello":
              // Code that should run in response to the hello message command
              window.showInformationMessage(text);
              return;
            // Add more switch case statements here as more webview message commands
            // are created within the webview context (i.e. inside src/webview/main.ts)
          }
        },
        undefined,
        this._disposables
      );
    }
  }