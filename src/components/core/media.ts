const mpris = await Service.import('mpris')

export function Media() {
	// TODO: Remove need for stupid hack below
	const hackMpris = { ...mpris, disconnect: () => {}, connect: () => 0}
	const label = Utils.watch('', hackMpris, 'player-changed', () => {
		if (mpris.players[0]) {
			const { track_artists, track_title } = mpris.players[0]
			return `${track_artists.join(', ')} - ${track_title}`
		} else {
			return 'Nothing is playing'
		}
	})

	return Widget.Button({
		class_name: 'media',
		on_primary_click: () => mpris.getPlayer('')?.playPause(),
		on_scroll_up: () => mpris.getPlayer('')?.next(),
		on_scroll_down: () => mpris.getPlayer('')?.previous(),
		child: Widget.Label({ label }),
	})
}

export default {
	Media
}
