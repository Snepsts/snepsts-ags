import { Accessor } from 'ags'

// NOTE: JSX.Element is an alias for GObject.Object
export type Children = JSX.Element | Array<JSX.Element>

export function getVisible(visible: Accessor<boolean> | boolean | undefined) {
	return visible === undefined ? true : visible
}
