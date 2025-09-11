import Hyprland from 'gi://AstalHyprland'
import GObject, { register, property } from 'ags/gobject'
import { getHyprMonitorsFromWorkspaces, HyprMonitor } from '../lib/hyprland'

const defaultHyprMonitor: HyprMonitor = { monitor: 'N/A', workspaces: [] }

@register()
class HyprlandStore extends GObject.Object {
	@property(Array<HyprMonitor>) hyprMonitors = [defaultHyprMonitor]
	@property(Boolean) isMultiMonitor = true
}

const hyprland = Hyprland.get_default()
const hyprlandStore = new HyprlandStore()

// there are monitor-added and monitor-removed listeners that we can use to re-calculate monitors
// but since monitors are only used for workspaces atm, it's possible focused-workspace is all we'll need

function setHyprMonitors() {
	const hyprMonitors = getHyprMonitorsFromWorkspaces(hyprland.get_workspaces())
	hyprlandStore.hyprMonitors = hyprMonitors
	hyprlandStore.isMultiMonitor = hyprMonitors.length > 1
}

setHyprMonitors()

// the following event fires when a workspace is added (via switching to it)
// OR when just changing active workspaces
// it should be a very good candidate for computing the workspaces
hyprland.connect('notify::focused-workspace', () => {
	setHyprMonitors()
})

export default hyprlandStore
