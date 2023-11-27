# refcnt-checker-extension

<center>
    <h1>Author</h1>
    <p align="center">
   &#128512 <a href="https://github.com/ziqiwww" target="_blank">ziqiwww@NJU</a> <br>
      &#128512 <a href="https://github.com/resautu" target="_blank">resautu@NJU</a> <br>
       &#128512<span>Chengyao Hou@NJU</span> <br>
</p>
</center>


## Repository of tool and algorithm

https://github.com/ziqiwww/refcountChecker  

## Project file structure   

```
refcnt-checker-extension
|───assets
|-  |checkform.css //Extending stylesheets files
|-	|...
|───cache //place log information and target code source files
|-	|src.c
|-	|...
|-	|log
|───modules
|-	|... //place function file
|───src
|-	|───test
|-	|checkPanel.ts //report of check result panel
|-	|extension.ts //extension main file
|-	|utils.ts //utils function
|...
```

## Preliminary idea

- use vscode api to get source code files
- The frontend activate backend to use clang to compile source code files to llvm IR
- The backend checks ref-cnt through llvm pass and puts the information in a log file
- The frontend reads the log file and present it on vscode webview
- Below is the flow chart:
- <img src="./README.assets/image-20230416214618652.png" alt="image-20230416214618652" style="zoom:50%;" />

## Current front-end progress

finish code frame and can get source files and can present log, also there has a simply webview of vscode(The current style is not indicative of the final product)

![image-20230416215852233](./README.assets/image-20230416215852233.png)

## Usage method

### Install:

You can simply download .vsix file from release.

Take Linux as an example, you can just use command as below in your terminal:

```shell
code --install-extension refcnt-checker-0.0.1.vsix
```

And then you can enjoy your ref-cnt checker life.

### Environment：

```shell
llvm version:16.0
unix operation system(for example: linux, MAC)
```

#### Usage:

- You can just use shortcut key: Ctrl+Shift+p in vscode to get command line

- Before you check a source file first, you need to change settings.json file first. Of course, you needn't to find settings.json in your messy file system. You can just use command below in vecode command line:

  ```shell
  ref_checker.Settings
  ```

  Then you will be surprised to see settings.json will pop up, and modify content for your source file specifically, like entry, check model(inter or intra).

- Then you can just use command below to check your file.

  ```shell
  ref_checker.Checker_Ref
  ```

  And wait for minutes, check reporter will be presented.

## Acknowledge

If you like out work, please click a star for us. Your support is the greatest encouragement to us!

