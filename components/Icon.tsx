import { Children } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'

const DEBUG = true

type Props = {
	iconName: MdiSvgName
	children?: Children
}

export default function Icon(props: Props) {
	const { iconName } = props

	if (DEBUG) {
		console.log('Rendering SVG Icon with name ' + iconName)
	}

	return <image icon_name={iconName}></image>
}
