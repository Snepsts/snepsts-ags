import { interval } from 'ags/time'
import { Children, getVisible } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'
import { Accessor, createState, onCleanup } from 'ags'
import DynamicIcon from './DynamicIcon'

const DEBUG = false

type Props = {
	iconNames: MdiSvgName[]
	iconPollRateMs?: number
	visible?: Accessor<boolean> | boolean
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

	const visible = getVisible(props.visible)

	const iconPollrateMs = props.iconPollRateMs ?? 1000
	const animationInterval = interval(iconPollrateMs, incrementAnimationIndex)
	onCleanup(() => animationInterval.cancel())

	return <DynamicIcon iconNames={iconNames} activeIconIndex={animationIndex} visible={visible} />
}
