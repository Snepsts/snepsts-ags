import { interval } from 'ags/time'
import { Children } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'
import { createState, For } from 'ags'
import Icon from './Icon'

// const DEBUG = true

type Props = {
	iconNames: MdiSvgName[]
	iconPollRateMs?: number
	children?: Children
}

export default function AnimatedIcon(props: Props) {
	const { iconNames } = props

	const [iconNamesState] = createState(iconNames)
	const [animationIndex, setAnimationIndex] = createState(0)

	const incrementAnimationIndex = () => {
		console.log('Incrementing animation index!')
		setAnimationIndex((v) => (v === iconNames.length - 1 ? 0 : v + 1))
	}
	const iconPollrateMs = props.iconPollRateMs ?? 1000
	interval(iconPollrateMs, incrementAnimationIndex)

	return (
		<box>
			<For each={iconNamesState}>
				{(item, index) => (
					<box visible={animationIndex((v) => v === index.get())}>
						<Icon iconName={item} />
					</box>
				)}
			</For>
		</box>
	)
}
