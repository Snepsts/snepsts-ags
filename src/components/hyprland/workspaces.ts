const hyprland = await Service.import('hyprland')

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, make it a function
// then you can simply instantiate one by calling it

export function Workspaces() {
	const activeId = hyprland.active.workspace.bind('id')
	const workspaces = hyprland.bind('workspaces').as(ws =>
		ws.map(({ id }) =>
			Widget.Button({
				on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
				child: Widget.Label(`${id}`),
				class_name: activeId.as(i => `${i === id ? 'focused' : ''}`),
			})
		))

	return Widget.Box({
		class_name: 'workspaces',
		children: workspaces,
	})
}

export default {
	Workspaces
}