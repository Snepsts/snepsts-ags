import { Children, getVisible } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'
import { Accessor, createState, For } from 'ags'
import Icon from './Icon'

type Props = {
	iconNames: MdiSvgName[]
	activeIconIndex: Accessor<number>
	visible?: Accessor<boolean> | boolean
	children?: Children
}

export default function DynamicIcon(props: Props) {
	const { activeIconIndex, iconNames } = props

	const [iconNameState] = createState(props.iconNames)
	const activeIcon = activeIconIndex((iconIndex) =>
		iconIndex >= iconNames.length ? iconNames[0] : iconNames[iconIndex]
	)

	const visible = getVisible(props.visible)

	return (
		<box visible={visible}>
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
