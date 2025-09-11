import { createBinding, With } from 'ags'
import batteryStore from '../stores/battery'
import Icon from '../components/Icon'
import AnimatedIcon from '../components/AnimatedIcon'
import { MdiSvgName } from '../lib/mdi-svg'

export default function Battery() {
	const batteryPercentage = createBinding(batteryStore, 'percentage')
	const batteryLabel = batteryPercentage((b) => `${b.toString()}%`)
	const batteryIsCharging = createBinding(batteryStore, 'isCharging')
	const isFull = createBinding(batteryStore, 'isFull')

	const animatedIconNames: MdiSvgName[] = [
		'battery-charging-10-symbolic',
		'battery-charging-20-symbolic',
		'battery-charging-30-symbolic',
		'battery-charging-40-symbolic',
		'battery-charging-50-symbolic',
		'battery-charging-60-symbolic',
		'battery-charging-70-symbolic',
		'battery-charging-80-symbolic',
		'battery-charging-90-symbolic',
		'battery-charging-100-symbolic',
	]

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
											<AnimatedIcon iconNames={animatedIconNames} />
										)
									}
								</With>
							</box>
						) : (
							<Icon iconName="battery-symbolic" />
						)
					}
				</With>
			</box>
			<label label={batteryLabel} marginStart={4} />
		</box>
	)
}
