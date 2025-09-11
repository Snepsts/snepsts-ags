import { Gtk } from 'ags/gtk4'
import { createState } from 'ags'
import { createPoll } from 'ags/time'
import Icon from '../components/Icon'

export default function TimeDate() {
	const time = createPoll('', 3000, 'date')

	const dayTime = time((t) => {
		const date = new Date(t)

		const hours = date.getHours()
		const readableHours = hours % 12 === 0 ? 12 : hours % 12
		const readablePaddedHours = readableHours < 10 ? `0${readableHours}` : readableHours
		const minutes = date.getMinutes()
		const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
		const isMorning = hours < 12

		return `${readablePaddedHours}:${paddedMinutes} ${isMorning ? 'AM' : 'PM'}`
	})

	const dateTime = time((t) => {
		const date = new Date(t)

		const month = date.getMonth()
		const readableMonth = month < 10 ? `0${month}` : month
		const day = date.getDate()
		const readableDay = day < 10 ? `0${day}` : day
		const year = `${date.getFullYear()}`.substring(2)

		return `${readableMonth}/${readableDay}/${year}`
	})

	const [showDate, setShowDate] = createState(false)

	// below, we need the box orientation of HORIZONTAL since without that box
	// with that setting, then only the bottom box gets displayed
	return (
		<button class="label-button" onClicked={() => setShowDate(!showDate.get())}>
			<box orientation={Gtk.Orientation.HORIZONTAL}>
				<box visible={showDate}>
					<Icon iconName="calendar-symbolic" /> <label label={dateTime} />
				</box>
				<box visible={showDate((v) => !v)}>
					<Icon iconName="clock-outline-symbolic" /> <label label={dayTime} />
				</box>
			</box>
		</button>
	)
}
