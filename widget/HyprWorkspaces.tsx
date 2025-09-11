// import { createPoll } from 'ags/time'
import { createBinding, createState, For } from 'ags'
import { Gdk, Gtk } from 'ags/gtk4'
import Hyprland from 'gi://AstalHyprland'
import { Children } from '../lib/common'
import { getCurrentMonitor } from '../lib/hyprland'
import hyprlandStore from '../stores/hyprland'
import Icon from '../components/Icon'

type Props = {
	gdkmonitor: Gdk.Monitor
	children?: Children
}

const hyprland = Hyprland.get_default()

export default function HyprWorkspaces(props: Props) {
	const { gdkmonitor } = props

	const monitor = getCurrentMonitor(hyprland, gdkmonitor)

	if (!monitor) {
		throw new Error('Could not find Hyprland monitor')
	}

	const { HORIZONTAL } = Gtk.Orientation
	const hyprMonitors = createBinding(hyprlandStore, 'hyprMonitors')

	function getWorkspaceClass(workspace: Hyprland.Workspace) {
		if (hyprland.get_focused_workspace().id === workspace.id) {
			return 'workspace-focused'
		} else if (workspace.get_monitor().get_active_workspace().id === workspace.id) {
			return 'workspace-active'
		}

		return 'workspace-inactive'
	}

	function getWorkspaceIcon(workspace: Hyprland.Workspace) {
		if (hyprland.get_focused_workspace().id === workspace.id) {
			return 'record-circle-symbolic'
		}

		return 'record-circle-outline-symbolic'
	}

	return (
		<box orientation={HORIZONTAL} class="hyprland-workspaces" spacing={8}>
			<For each={hyprMonitors}>
				{(hyprMonitor) => {
					const [workspaces] = createState(hyprMonitor.workspaces)
					return (
						<box orientation={HORIZONTAL} class="hyprland-workspace-monitor" spacing={8}>
							<For each={workspaces}>
								{(workspace) => <Icon iconName={getWorkspaceIcon(workspace)} classStr={getWorkspaceClass(workspace)} />}
							</For>
						</box>
					)
				}}
			</For>
		</box>
	)
}
