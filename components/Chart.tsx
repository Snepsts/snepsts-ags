import { Children, convertRgbToCairo, hexToRgb } from '../lib/common'
import { Accessor } from 'ags'

const DEBUG = false

type Props = {
	width?: number
	height?: number
	nodes?: number
	data: Accessor<number[]> | number[]
	children?: Children
}

const margin = 4
const innerMargin = 4

// TODO: Make this reflective of the theme
const graphColor = '#515151'
const lineColor = '#f0544c'

export default function Chart(props: Props) {
	const { width, height, nodes, data } = props

	const points = nodes || 10

	return (
		<box>
			<box marginTop={margin} marginBottom={margin} marginStart={margin} marginEnd={margin}>
				<drawingarea
					$={(self) => {
						if (!Array.isArray(data)) {
							data.subscribe(() => self.queue_draw())
						}
						self.set_draw_func((area, cr, w, h) => {
							const areaWidth = (width || w) + innerMargin
							const areaHeight = (height || h) + innerMargin

							area.set_content_width(areaWidth)
							area.set_content_height(areaHeight)

							// draw the defining chart
							// for some reason, "0, 0" is top left???
							cr.moveTo(0, 0)
							cr.lineTo(0, areaHeight)
							cr.lineTo(areaWidth, areaHeight)
							cr.lineTo(areaWidth, 0)
							cr.lineTo(0, 0)

							// set line width and color
							const graphRgb = convertRgbToCairo(hexToRgb(graphColor))
							cr.setSourceRGB(graphRgb.r, graphRgb.g, graphRgb.b)
							cr.setLineWidth(2) // we set this to 2 because the lines at the edge seem to be thinner for some reason

							// draw
							cr.stroke()

							// usage marks
							const twoFive = areaHeight * 0.25
							const fifty = areaHeight * 0.5
							const sevenFive = areaHeight * 0.75
							if (DEBUG) {
								console.log(`25: ${twoFive}, 50: ${fifty}, 75: ${sevenFive}`)
							}
							cr.moveTo(0, twoFive)
							cr.lineTo(areaWidth, twoFive)
							cr.moveTo(0, fifty)
							cr.lineTo(areaWidth, fifty)
							cr.moveTo(0, sevenFive)
							cr.lineTo(areaWidth, sevenFive)

							// set color and width
							cr.setSourceRGB(graphRgb.r, graphRgb.g, graphRgb.b)
							cr.setLineWidth(1)

							cr.stroke()

							// TODO: Need to find a way to redraw just the next part during each data update, leaving the graph drawn
							// time to make graph
							const dataArr = Array.isArray(data) ? data : data.get()
							if (DEBUG) {
								console.log(dataArr)
							}
							let x = areaWidth
							const intervalWidth = areaWidth / (points - 1)
							let counter = 0
							cr.moveTo(areaWidth, areaHeight - (dataArr[dataArr.length - 1] / 100) * areaHeight)
							// we assume dataArr is a list of percentages as whole numbers, i.e: [94, 23, 54, 69]
							// we also assume the last item in the array is the most recent, so we work backwards
							for (let i = dataArr.length - 1; counter < points && i >= 0; i -= 1) {
								if (DEBUG) {
									console.log(`i: ${i}, counter: ${counter}, value: ${dataArr[i]}`)
								}
								const y = areaHeight - (dataArr[i] / 100) * areaHeight
								cr.lineTo(x, y)
								x -= intervalWidth
								counter++
							}

							// set color and line width
							const lineRgb = convertRgbToCairo(hexToRgb(lineColor))
							cr.setSourceRGB(lineRgb.r, lineRgb.g, lineRgb.b)
							cr.setLineWidth(2)

							cr.stroke()
						})
					}}
				/>
			</box>
		</box>
	)
}
