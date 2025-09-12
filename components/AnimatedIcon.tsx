import { interval } from 'ags/time'
import { Children } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'
import { createState } from 'ags'
import DynamicIcon from './DynamicIcon'

const DEBUG = true

type Props = {
	iconNames: MdiSvgName[]
	iconPollRateMs?: number
	children?: Children
}

export default function AnimatedIcon(props: Props) {
	const { iconNames } = props
	const [animationIndex, setAnimationIndex] = createState(0)

	const incrementAnimationIndex = () => {
		if (DEBUG) {
			console.log('Incrementing animation index!')
		}
		setAnimationIndex((v) => (v === iconNames.length - 1 ? 0 : v + 1))
	}

	const iconPollrateMs = props.iconPollRateMs ?? 1000
	interval(iconPollrateMs, incrementAnimationIndex)

	return <DynamicIcon iconNames={iconNames} activeIconIndex={animationIndex} />
}
