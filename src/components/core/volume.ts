const audio = await Service.import('audio')

// TODO: Figure out why this doesn't seem to be reactive, or even accurate off the rip
export function Volume() {
	const icons = {
		101: 'overamplified',
		67: 'high',
		34: 'medium',
		1: 'low',
		0: 'muted',
	}

	function getIcon() {
		const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(threshold =>
			threshold <= audio.speaker.volume * 100
		) || 0

		return `audio-volume-${icons[icon]}-symbolic`
	}

	// TODO: Remove need for stupid hack below
	const speakerHack = { ...audio.speaker, disconnect: () => {}, connect: () => 0 }
	const icon = Widget.Icon({
		icon: Utils.watch(getIcon(), speakerHack, getIcon),
	})

	const slider = Widget.Slider({
		hexpand: true,
		draw_value: false,
		on_change: ({ value }) => audio.speaker.volume = value,
		setup: self => self.hook(audio.speaker, () => {
			self.value = audio.speaker.volume || 0
		}),
	})

	return Widget.Box({
		class_name: 'volume',
		css: 'min-width: 180px',
		children: [icon, slider],
	})
}

export default {
	Volume
}
