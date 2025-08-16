import app from 'ags/gtk4/app'
import { Astal, Gdk } from 'ags/gtk4'
import HyprWorkspaces from './HyprWorkspaces'
import TimeDate from './TimeDate'

export default function Bar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

	return (
		<window
			visible
			name="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<HyprWorkspaces $type="start" gdkmonitor={gdkmonitor} />
				{/* <button
					$type="start"
					onClicked={() => execAsync('echo hello').then(console.log)}
					hexpand
					halign={Gtk.Align.CENTER}
				>
					<label label="Welcome to AGS!" />
				</button> */}
				<box $type="center" />
				<box $type="end" marginEnd={16}>
					<TimeDate />
				</box>
			</centerbox>
		</window>
	)
}
