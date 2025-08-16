import { createPoll } from 'ags/time'

export default function TimeDate() {
	const time = createPoll('', 5000, 'date')

	const displayTime = time((t) => {
		const date = new Date(t)

		const hours = date.getHours()
		const readableHours = hours % 12
		const readablePaddedHours = readableHours < 10 ? `0${readableHours}` : readableHours
		const minutes = date.getMinutes()
		const isMorning = hours < 12
		const dayTime = `${readablePaddedHours}:${minutes} ${isMorning ? 'AM' : 'PM'}`

		const month = date.getMonth()
		const day = date.getDate()
		const year = date.getFullYear()

		const dateTime = `${month}/${day}/${year}`

		return `${dayTime} ${dateTime}`
	})

	return <label label={displayTime} />
}
