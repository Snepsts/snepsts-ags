# Snepsts AGS

Hi! I'm trying to make something dope but right now tbh it probably sucks. Here's where I store the source code for the thing that I want to be dope but probably sucks. Enjoy!

### Installation

`paru -S aylurs-gtk-shell`

Set up types:

`ags --init -c ~/.config/ags/config.js`

> NOTE: you might need a dummy config.js to generate the types. The types folder will go in this repo. I believe in you.

### Running

`ags -c ~/.config/ags/config.js`

> You can make it run in the background (i.e: an exec-once command) by adding an `&` to the end

### Extra

If you wanna dev the way I do on this repo, create `.vscode/settings.json` and put the following in it:
```JSON
{
	"editor.detectIndentation": false,
	"editor.tabSize": 2,
	"editor.insertSpaces": false,
	"editor.defaultFormatter": "dbaeumer.vscode-eslint"
}
```

### A word from me

This is my custom implementation of ags to setup a cool, functional system UI. Intended to be used with Hyprland. Inspired by end-4's dotfiles.

TODO: Maybe only have .confg/ags have outputted files from ts project and have ts project live in a diff folder
