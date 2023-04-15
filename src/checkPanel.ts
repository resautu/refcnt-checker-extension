import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext } from "vscode";
import {getUri, writeLog} from "./utils";

export class CheckPanel {
    public static currentPanel: CheckPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private extensionPath: String = './';
    private constructor(panel: WebviewPanel, extensionUri: Uri, extensionPath: string) {
      this._panel = panel;
      this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
      this.extensionPath = extensionPath;
      this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
      this._setWebviewMessageListener(this._panel.webview);
    }
  
    public static render(context:ExtensionContext) {
      
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
                Uri.joinPath(context.extensionUri, "out"), 
                Uri.joinPath(context.extensionUri, "assets"),
                Uri.joinPath(context.extensionUri, "modules"),
                Uri.joinPath(context.extensionUri, "cache")
            ],
          }
        );
  
        CheckPanel.currentPanel = new CheckPanel(panel, context.extensionUri, context.extensionPath);
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
      const path = require('path');

      const stylesUri = getUri(webview, extensionUri, ["assets", "checkform.css"]);
      const myImage = getUri(webview, extensionUri, ["assets", "1.png"]);
      const jsModule = getUri(webview, extensionUri, ["modules", "misc.js"]);
      const logPath = path.join(this.extensionPath, './cache/log');
      //console.log(logPath);
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
            <div>
              <ul>` 
              + writeLog(logPath) + 
              /*html*/`
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