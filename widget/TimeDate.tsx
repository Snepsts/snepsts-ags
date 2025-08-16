import { createState, With } from 'ags'
import { createPoll } from 'ags/time'

export default function TimeDate() {
	const time = createPoll('', 3000, 'date')

	const dayTime = time((t) => {
		const date = new Date(t)

		const hours = date.getHours()
		const readableHours = hours % 12
		const readablePaddedHours = readableHours < 10 ? `0${readableHours}` : readableHours
		const minutes = date.getMinutes()
		const isMorning = hours < 12

		return `${readablePaddedHours}:${minutes} ${isMorning ? 'AM' : 'PM'}`
	})

	const dateTime = time((t) => {
		const date = new Date(t)

		const month = date.getMonth()
		const day = date.getDate()
		const year = date.getFullYear()

		return `${month}/${day}/${year}`
	})

	const [showDate, setShowDate] = createState(false)

	return (
		<button class="label-button" onClicked={() => setShowDate(!showDate.get())}>
			<With value={showDate}>
				{(shouldShowDate) => (shouldShowDate ? <label label={dateTime} /> : <label label={dayTime} />)}
			</With>
		</button>
	)
}
