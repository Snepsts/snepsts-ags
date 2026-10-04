import { Children } from '../lib/common'
import { Gdk, Gtk } from 'ags/gtk4'
import Chart from '../components/Chart'
import { Accessor, createState } from 'ags'
import { PerformanceMonitor } from '../lib/hardware'

type Props = {
	children?: Children
}

const { VERTICAL, HORIZONTAL } = Gtk.Orientation

export default function DevPanel(props: Props) {
	const externalPanelPadding = 8

	const chartProps = {
		nodes: 10,
		pollingRate: 10,
		width: 100,
		height: 100,
	}

	const usageMonitor = new PerformanceMonitor(chartProps.nodes)

	const usageData: number[] = [69, 94, 54]

	const [minValue, setMinValue] = createState('0')
	const [maxValue, setMaxValue] = createState('100')

	const minimumGeneratedValue = minValue((val) => {
		const number = Number(val) || 0
		if (typeof number !== 'number') {
			return 0
		}

		if (number < 0) {
			return 0
		}

		return number
	})

	const maximumGeneratedValue = maxValue((val) => {
		const number = Number(val) || 100
		if (typeof number !== 'number') {
			return 100
		}

		if (number > 100) {
			return 100
		}

		return number
	})

	return (
		<box
			marginBottom={externalPanelPadding}
			marginTop={externalPanelPadding}
			marginEnd={externalPanelPadding}
			marginStart={externalPanelPadding}
			orientation={VERTICAL}
		>
			<box orientation={HORIZONTAL}>
				<box orientation={VERTICAL}>
					<label label="Minimum value generated (min 0)" />
					<entry placeholderText="0" text={minValue} onNotifyText={({ text }) => setMinValue(text)} />
					<label label="Maximum value generated (max 100)" />
					<entry placeholderText="100" text={maxValue} onNotifyText={({ text }) => setMaxValue(text)} />

					<Chart data={usageData} width={chartProps.width} height={chartProps.height} />
				</box>
			</box>
		</box>
	)
}
