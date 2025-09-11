import { createBinding } from 'ags'
import batteryStore from '../stores/battery'
import Icon from '../components/Icon'

export default function Battery() {
	const batteryPercentage = createBinding(batteryStore, 'percentage')
	const batteryLabel = batteryPercentage((b) => `${b.toString()}%`)

	return (
		<box>
			<Icon iconName="battery-symbolic" /> <label label={batteryLabel} />
		</box>
	)
}
