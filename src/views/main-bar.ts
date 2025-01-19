import { BatteryLabel } from 'src/components/core/battery'
import { Media } from 'src/components/core/media'
import { Volume } from 'src/components/core/volume'
import { SysTray } from 'src/components/core/system-tray'
import { Workspaces } from 'src/components/hyprland/workspaces'
import { ClientTitle } from 'src/components/hyprland/client-title'
import { Notification } from 'src/components/core/notification'
import { Clock } from 'src/components/core/clock'

// layout of the bar
function Left() {
	return Widget.Box({
		spacing: 8,
		children: [
			Workspaces(),
			ClientTitle(),
		],
	})
}

function Center() {
	return Widget.Box({
		spacing: 8,
		children: [
			Media(),
			Notification(),
		],
	})
}

function Right() {
	return Widget.Box({
		hpack: 'end',
		spacing: 8,
		children: [
			Volume(),
			BatteryLabel(),
			Clock(),
			SysTray(),
		],
	})
}

export function Bar(monitor = 0) {
	return Widget.Window({
		name: `bar-${monitor}`, // name has to be unique
		class_name: 'bar',
		monitor,
		anchor: ['top', 'left', 'right'],
		exclusivity: 'exclusive',
		child: Widget.CenterBox({
			start_widget: Left(),
			center_widget: Center(),
			end_widget: Right(),
		}),
	})
}

export default {
	Bar
}
