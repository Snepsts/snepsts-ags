# Snepsts AGS

Hi! I'm trying to make something dope but right now tbh it probably sucks. Here's where I store the source code for the thing that I want to be dope but probably sucks. Enjoy!

### Installation

`paru -S aylurs-gtk-shell-git`

Install core files:

`ags init`

> This installs a template AGS setup in ~/.config/ags, which is not needed. What _is_ needed is the /usr/share/ags/js install it creates

> NOTE: It's possible it doesn't actually create the /usr/share/ags/js install and that is made by installing the arch package. Will figure out later.

Install the [Hyprland Astal library](https://aylur.github.io/astal/guide/libraries/hyprland).

### Set up project for dev

Grab project:

`git clone git@github.com:Snepsts/snepsts-ags.git`

Install types:

`ags types -d snepsts-ags`

Enter directory:

`cd snepsts-ags`

Install deps:

`npm i`

Run the script for setting up SVGs:

```bash
sh prepare-svg-files.sh
```

### Running

You may need to set this first if you installed the Hyprland Astal lib from source (if you did the meson commands)

`export GI_TYPELIB_PATH=/usr/local/lib/girepository-1.0`

> NOTE: You should check if $GI_TYPELIB_PATH already exists first, if so, modify as needed (i.e: appending :$GI_TYPELIB_PATH)

`ags run app.ts`

> You can make it run in the background (i.e: an exec-once command) by adding an `&` to the end

> If you install it to .config/ags instead of path/to/dir/snepsts-ags, you can just run ags run

### Extra

If you're on VSCode, I highly recommend you create `.vscode/settings.json` and put the following in it:

```JSON
{
	"editor.tabSize": 2,
	"editor.insertSpaces": false,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"typescript.tsdk": "node_modules/typescript/lib",
	"editor.formatOnSave": true
}
```

You'll want the ESLint and Prettier extensions as well. They're in both the default marketplace and the Open VSX Registry.

### A word from me

This is my custom AGS configuration. We trying out here.
