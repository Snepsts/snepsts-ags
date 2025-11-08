import { Accessor } from 'ags'
import { Children, getVisible } from '../lib/common'
import { MdiSvgName } from '../lib/mdi-svg'

const DEBUG = false

type Props = {
	iconName: MdiSvgName
	classStr?: string
	pixelSize?: number
	visible?: Accessor<boolean> | boolean
	children?: Children
}

export default function Icon(props: Props) {
	const { iconName, classStr, pixelSize } = props

	if (DEBUG) {
		console.log(`Rendering SVG Icon with name ${iconName} and class ${classStr}`)
	}

	const visible = getVisible(props.visible)

	return <image icon_name={iconName} class={classStr} pixelSize={pixelSize} visible={visible}></image>
}
