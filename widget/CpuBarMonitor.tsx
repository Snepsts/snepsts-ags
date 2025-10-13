import { Children } from '../lib/common'
// import { MdiSvgName } from '../lib/mdi-svg'
import Icon from '../components/Icon'
import cpuStore from '../stores/cpu'
import { createBinding } from 'ags'
import { Gtk } from 'ags/gtk4'

// type HardwareMonitorType = 'cpu' | 'gpu'
type Props = {
	// hwMonitorType: HardwareMonitorType
	children?: Children
}

const { VERTICAL } = Gtk.Orientation

export default function CpuBarMonitor(props: Props) {
	const cpuUsage = createBinding(cpuStore, 'totalUsage')
	const cpuUsageLabel = cpuUsage((cu) => `${cu.toString()}%`)
	const cpuInfoLabel = `${cpuStore.cores} Cores, ${cpuStore.threads} Threads`

	const boxPadding = 8

	return (
		<menubutton class="button-style">
			<box>
				<Icon iconName="memory-symbolic" />
				<label label={cpuUsageLabel} marginStart={4} />
			</box>
			<popover>
				<box
					orientation={VERTICAL}
					marginBottom={boxPadding}
					marginTop={boxPadding}
					marginEnd={boxPadding}
					marginStart={boxPadding}
				>
					<label label={cpuStore.name} marginBottom={4} />
					<label label={cpuInfoLabel} />
				</box>
			</popover>
		</menubutton>
	)
}
