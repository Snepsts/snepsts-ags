import { Children } from '../lib/common'
// import { MdiSvgName } from '../lib/mdi-svg'
import Icon from '../components/Icon'
import cpuStore from '../stores/cpu'
import { createBinding } from 'ags'

// type HardwareMonitorType = 'cpu' | 'gpu'
type Props = {
	// hwMonitorType: HardwareMonitorType
	children?: Children
}

export default function CpuBarMonitor(props: Props) {
	const cpuUsage = createBinding(cpuStore, 'totalUsage')
	const cpuUsageLabel = cpuUsage((cu) => `${cu.toString()}%`)

	return (
		<box>
			<Icon iconName="memory-symbolic" />
			<label label={cpuUsageLabel} marginStart={4} />
		</box>
	)
}
