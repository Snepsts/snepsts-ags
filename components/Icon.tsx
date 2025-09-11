import { Children } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'

const DEBUG = true

type Props = {
	iconName: MdiSvgName
	classStr?: string
	children?: Children
}

export default function Icon(props: Props) {
	const { iconName, classStr } = props

	if (DEBUG) {
		console.log('Rendering SVG Icon with name ' + iconName + ' and class ' + classStr)
	}

	return <image icon_name={iconName} class={classStr}></image>
}
