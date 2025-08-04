# Snepsts AGS

Hi! I'm trying to make something dope but right now tbh it probably sucks. Here's where I store the source code for the thing that I want to be dope but probably sucks. Enjoy!

### Installation

`paru -S aylurs-gtk-shell-git`

Install core files:

`ags init`

> This installs a template AGS setup in ~/.config/ags, which is not needed. What _is_ needed is the /usr/share/ags/js install it creates

### Set up project for dev

Grab project:

`git clone git@github.com:Snepsts/snepsts-ags.git`

Install types:

`ags types -d snepsts-ags`

Enter directory:

`cd snepsts-ags`

Install deps:

`npm i`

### Running

`ags run app.ts`

> You can make it run in the background (i.e: an exec-once command) by adding an `&` to the end

> If you install it to .config/ags instead of path/to/dir/snepsts-ags, you can just run ags run --gtk4

### Extra

If you're on VSCode, I highly recommend you create `.vscode/settings.json` and put the following in it:
```JSON
{
	"editor.detectIndentation": false,
	"editor.tabSize": 2,
	"editor.insertSpaces": false,
	"editor.defaultFormatter": "dbaeumer.vscode-eslint",
	"typescript.tsdk": "node_modules/typescript/lib"
}
```

### A word from me

This is my custom AGS implementation. We trying out here.
