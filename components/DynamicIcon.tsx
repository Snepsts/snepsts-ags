import { Children } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'
import { Accessor, createState, For } from 'ags'
import Icon from './Icon'

type Props = {
	iconNames: MdiSvgName[]
	activeIconIndex: Accessor<number>
	children?: Children
}

export default function DynamicIcon(props: Props) {
	const { activeIconIndex, iconNames } = props

	const [iconNameState] = createState(props.iconNames)
	const activeIcon = activeIconIndex((iconIndex) =>
		iconIndex >= iconNames.length ? iconNames[0] : iconNames[iconIndex]
	)

	return (
		<box>
			<For each={iconNameState}>
				{(iconName) => (
					<box visible={activeIcon((activeIconName) => activeIconName === iconName)}>
						<Icon iconName={iconName} />
					</box>
				)}
			</For>
		</box>
	)
}
