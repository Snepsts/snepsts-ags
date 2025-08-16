import Hyprland from 'gi://AstalHyprland'
import { Gdk } from 'ags/gtk4'

export function getGdkMonitorName(gdkmonitor: Gdk.Monitor) {
	return gdkmonitor.connector
}

export function getMonitorName(monitor: Hyprland.Monitor) {
	return monitor.name
}

export function getCurrentMonitor(hyprland: Hyprland.Hyprland, gdkmonitor: Gdk.Monitor) {
	return hyprland.monitors.find((monitor) => getMonitorName(monitor) === getGdkMonitorName(gdkmonitor))
}

type WorkspacesByMonitor = { [id: string]: Hyprland.Workspace[] }

export function getWorkspacesByMonitor(workspaces: Hyprland.Workspace[]) {
	const monitorToWorkspacesMap: WorkspacesByMonitor = {}
	for (const workspace of workspaces) {
		const workspaceMonitor = getMonitorName(workspace.monitor)
		if (!monitorToWorkspacesMap[workspaceMonitor]) {
			monitorToWorkspacesMap[workspaceMonitor] = []
		}

		monitorToWorkspacesMap[workspaceMonitor].push(workspace)
	}

	return monitorToWorkspacesMap
}

export interface HyprMonitor {
	monitor: string
	workspaces: Hyprland.Workspace[]
}

export function getHyprMonitors(workspacesByMonitor: WorkspacesByMonitor): HyprMonitor[] {
	const hyprMonitors: HyprMonitor[] = []

	for (const monitor in workspacesByMonitor) {
		hyprMonitors.push({
			monitor,
			workspaces: [...workspacesByMonitor[monitor]]
				.filter((workspace) => workspace.clients.length > 0 || workspace.monitor.activeWorkspace.id === workspace.id) // empty, unfocused workspaces get deleted anyway
				.sort((first, second) => first.id - second.id), // pre-sort the workspaces by ID
		})
	}

	return hyprMonitors.sort((first, second) => first.workspaces[0].id - second.workspaces[0].id)
}

export function getHyprMonitorsFromWorkspaces(workspaces: Hyprland.Workspace[]) {
	const workspacesByMonitor = getWorkspacesByMonitor(workspaces)
	return getHyprMonitors(workspacesByMonitor)
}
