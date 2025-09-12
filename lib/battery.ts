import { MdiSvgName } from './mdi-svg'

export const chargingIconNames: MdiSvgName[] = [
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

export const batteryStateIconNames: MdiSvgName[] = [
	'battery-alert-symbolic', // 0 - 8
	'battery-10-symbolic', // 9 - 18
	'battery-20-symbolic', // 19 - 27
	'battery-30-symbolic', // 28 - 36
	'battery-40-symbolic', // 37 - 45
	'battery-50-symbolic', // 46 - 54
	'battery-60-symbolic', // 55 - 63
	'battery-70-symbolic', // 64 - 72
	'battery-80-symbolic', // 73 - 81
	'battery-90-symbolic', // 82 - 90
	'battery-symbolic', // 91 - 100
]

export function getBatteryStateIconIndex(batteryLevel: number) {
	if (batteryLevel >= 55) {
		// upper half
		if (batteryLevel >= 73) {
			// upper upper quarter (ish)
			if (batteryLevel >= 91) {
				return 10
			} else if (batteryLevel >= 82) {
				return 9
			} else {
				return 8
			}
		} else {
			// upper lower quarter (ish)
			if (batteryLevel >= 64) {
				return 7
			} else {
				return 6
			}
		}
	} else {
		// lower half
		if (batteryLevel >= 28) {
			// upper lower quarter
			if (batteryLevel >= 46) {
				return 5
			} else if (batteryLevel >= 37) {
				return 4
			} else if (batteryLevel >= 28) {
				return 3
			}
		} else {
			// lower lower quarter
			if (batteryLevel >= 19) {
				return 2
			} else if (batteryLevel >= 9) {
				return 1
			} else {
				return 0
			}
		}
	}

	return 0
}
