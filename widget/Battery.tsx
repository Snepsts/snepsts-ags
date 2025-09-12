import { createBinding, With } from 'ags'
import batteryStore from '../stores/battery'
import Icon from '../components/Icon'
import AnimatedIcon from '../components/AnimatedIcon'
import { getBatteryStateIconIndex, batteryStateIconNames, chargingIconNames } from '../lib/battery'
import DynamicIcon from '../components/DynamicIcon'

export default function Battery() {
	const batteryPercentage = createBinding(batteryStore, 'percentage')
	const batteryLabel = batteryPercentage((b) => `${b.toString()}%`)
	const batteryIsCharging = createBinding(batteryStore, 'isCharging')
	const isFull = createBinding(batteryStore, 'isFull')
	const activeDynamicIconIndex = batteryPercentage((batteryLevel) => getBatteryStateIconIndex(batteryLevel))

	return (
		<box>
			<box>
				<With value={batteryIsCharging}>
					{(value) =>
						value ? (
							<box>
								<With value={isFull}>
									{(value) =>
										value ? ( // if is full, just show a battery charged symbolic
											<Icon iconName="battery-charging-symbolic" />
										) : (
											// else, show animated charging icon
											<AnimatedIcon iconNames={chargingIconNames} />
										)
									}
								</With>
							</box>
						) : (
							<DynamicIcon iconNames={batteryStateIconNames} activeIconIndex={activeDynamicIconIndex} />
						)
					}
				</With>
			</box>
			<label label={batteryLabel} marginStart={4} />
		</box>
	)
}
