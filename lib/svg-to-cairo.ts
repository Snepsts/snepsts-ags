import { Gtk } from 'ags/gtk4'
import giCairo from 'cairo'

interface GtkCairoDrawFuncArgs {
	area: Gtk.DrawingArea
	cr: giCairo.Context
	width: number
	height: number
}

// SVG -> Cairo
// NOTE: There are a total of 20 SVG path commands
// They're split up into 6 types, so I'll list them by that
// Type: MoveTo
// M -> move to (absolute position) || m -> move to (relative to current position)
// Type: LineTo
// L -> line to (absolute) || l -> line to (relative)
// H -> (absolute) || h -> (relative)
// V -> (absolute) || v -> (relative)
// Type: Cubic Bezier curve
// C -> (absolute) || c -> (relative)
// S -> (absolute) || s -> (relative)
// Type: Quadratic Bezier curve
// Q -> (absolute) || q -> (relative)
// T -> (absolute) || t -> (relative)
// Type: Elliptical arc curve
// A -> arc (absolute) || a -> arc (relative)
// Type: ClosePath
// Z -> close path (absolute) || z -> close path (relative)

// for this function
export function setCairoPathFromSvgPath(
	svgPath: string,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: { DEBUG: boolean } = { DEBUG: false }
) {
	if (opts.DEBUG) {
		console.log('Called setCairoPathFromSvgPath with the following args:')
		console.log(svgPath)
		console.log(gtkDrawFuncArgs)
	}

	const commands = getCommandsFromPath(svgPath)
	let previousCommand = ''
	for (const command of commands) {
		parseCommand(command, gtkDrawFuncArgs, { ...opts, previousCommand })
		previousCommand = command
	}
}

// splits a path into commands, which can be sequentially run to draw the svg
const commandLetters = 'MmLlHhVvCcSsQqTtAaZz'.split('')
function getCommandsFromPath(path: string) {
	const commands: string[] = []

	let currentCommand = ''
	for (const letter of path) {
		if (commandLetters.includes(letter)) {
			if (currentCommand !== '') {
				commands.push(currentCommand)
			}
			currentCommand = ''
		}

		currentCommand += letter
	}

	if (currentCommand !== '') {
		commands.push(currentCommand)
	}

	return commands
}

function getArgString(args: ParsedArgs) {
	let argString = ''

	for (const argSet of args) {
		argString += `${argSet} `
	}

	return argString
}

type ParsedArgs = number[][]

// we assume the following about an argString
// argString is a space delimited set of arg(s)
// an arg is comma delimited if an arg is a pair
function getArgsFromArgString(argString: string) {
	const argList = argString.split(' ')
	const args: ParsedArgs = []

	for (const argSet of argList) {
		args.push(argSet.split(',').map((arg) => Number(arg)))
	}

	return args
}

interface MoveToOpts {
	DEBUG: boolean
	isRelative?: boolean
}

interface LineToOpts {
	DEBUG: boolean
	isRelative?: boolean
	isVertical?: boolean
	isHorizontal?: boolean
}

interface BezierCurveOpts {
	DEBUG: boolean
	isRelative?: boolean
	isSmooth?: boolean
	previousCommand?: string
	previousCommandArgString?: string
}

interface ArcCurveOpts {
	DEBUG: boolean
	isRelative?: boolean
}

type CommandOpts = MoveToOpts | LineToOpts | BezierCurveOpts | ArcCurveOpts

// we assume the following about a passed in command:
// the first char is a letter mapping to a command
// the rest are the arguments to said command
// the arguments are split via spaces and/or commas
function parseCommand(
	command: string,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: { DEBUG: boolean; previousCommand: string } = { DEBUG: false, previousCommand: '' }
) {
	if (opts.DEBUG) {
		console.log('Called parseCommand with the following args:')
		console.log('Command: ' + command)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const [svgCommand, argString] = [command.slice(0, 1), command.slice(1)]
	const [previousCommand, previousCommandArgString] = [opts.previousCommand.slice(0, 0), opts.previousCommand.slice(1)]
	const args = getArgsFromArgString(argString)

	console.log('svgCommand: ' + svgCommand)

	const newOpts: CommandOpts = { ...opts }
	switch (svgCommand) {
		// move to
		case 'm':
			newOpts.isRelative = true
		case 'M':
			runMoveTo(args, gtkDrawFuncArgs, newOpts)
			break
		// line to
		case 'l':
			newOpts.isRelative = true
		case 'L':
			runLineTo(args, gtkDrawFuncArgs, newOpts)
			break
		case 'h':
			newOpts.isRelative = true
		case 'H':
			runLineTo(args, gtkDrawFuncArgs, { ...newOpts, isHorizontal: true })
			break
		case 'v':
			newOpts.isRelative = true
		case 'V':
			runLineTo(args, gtkDrawFuncArgs, { ...newOpts, isVertical: true })
			break
		// Cubic Bezier Curve
		case 'c':
			newOpts.isRelative = true
		case 'C':
			runCubicBezierCurve(args, gtkDrawFuncArgs, { ...newOpts })
			break
		case 's':
			newOpts.isRelative = true
		case 'S':
			runCubicBezierCurve(args, gtkDrawFuncArgs, {
				...newOpts,
				isSmooth: true,
				previousCommand,
				previousCommandArgString,
			})
			break
		// Quadratic Bezier Curve
		case 'q':
			newOpts.isRelative = true
		case 'Q':
			runQuadraticBezierCurve(args, gtkDrawFuncArgs, { ...newOpts })
			break
		case 't':
			newOpts.isRelative = true
		case 'T':
			runQuadraticBezierCurve(args, gtkDrawFuncArgs, {
				...newOpts,
				isSmooth: true,
				previousCommand,
				previousCommandArgString,
			})
			break
		// Elliptical Arc Curve
		case 'A':
		case 'a':
			runEllipticalArcCurve(args, gtkDrawFuncArgs, opts)
			break
		// Close Path
		case 'Z':
		case 'z':
			runClosePath(args, gtkDrawFuncArgs, opts)
			break
	}
}

// IMPORTANT: Negative values:
// * Negative angles run anti-clockwise
// * absolute negative x and y values are interpreted as negative coordinates
// * relative negative x moves left, relative negative y moves up

// Type: MoveTo
// Note: after the initial coordinate pair, additional coordinate pairs
// are interpreted as parameter(s) for implicit absolute line to command(s)
function runMoveTo(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: MoveToOpts = { DEBUG: false, isRelative: false }
) {
	if (opts.DEBUG) {
		console.log('Called runMoveTo with the following args:')
		console.log(`args: ${args}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const moveToCommand = opts.isRelative ? 'relMoveTo' : 'moveTo'
	const lineToCommand = opts.isRelative ? 'relLineTo' : 'lineTo'

	const { area, cr, width, height } = gtkDrawFuncArgs
	const [x, y] = args[0]

	if (opts.DEBUG) {
		console.log(`Running ${opts.isRelative ? 'relMoveTo' : 'moveTo'} with x: ${x} and y: ${y}`)
	}

	cr[moveToCommand](x, y)

	for (let i = 1; i < args.length; i++) {
		const [lineToX, lineToY] = args[i]
		if (opts.DEBUG) {
			console.log(
				`Detected implicit ${opts.isRelative ? 'relative' : 'absolute'} line to in move command, running ${lineToCommand} with x: ${lineToX} and y: ${lineToY}`
			)
		}
		cr[lineToCommand](lineToX, lineToY)
	}
}

// Type: LineTo
// L -> line to (absolute) || l -> line to (relative)
// H -> (absolute) || h -> (relative)
// V -> (absolute) || v -> (relative)
function runLineTo(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: LineToOpts = {
		DEBUG: false,
		isRelative: false,
		isHorizontal: false,
		isVertical: false,
	}
) {
	if (opts.DEBUG) {
		console.log('Called runLineTo with the following args:')
		console.log(`args: ${args}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const { area, cr, width, height } = gtkDrawFuncArgs
	const [x, y] = args[0]
	const lineToCommand = opts.isRelative ? 'relLineTo' : 'lineTo'

	if (opts.isHorizontal || opts.isVertical) {
		let newX = 0
		let newY = 0
		const [currentX, currentY] = cr.getCurrentPoint()
		if (opts.isHorizontal) {
			newX = x
			newY = currentY
		} else {
			newX = currentX
			newY = x
		}
		if (opts.DEBUG) {
			console.log(`Running ${lineToCommand} with x: ${newX} and y: ${newY}`)
		}
		cr[lineToCommand](newX, newY)
	} else {
		if (opts.DEBUG) {
			console.log(`Running ${lineToCommand} with x: ${x} and y: ${y}`)
		}
		cr[lineToCommand](x, y)
	}
}

// TODO: This could be wrong
function getReflection(first: number[], second: number[]) {
	let reflectionX = 0
	let reflectionY = 0

	const [x, y] = first
	const [x2, y2] = second

	const xDistance = x - x2
	reflectionX = x2 - xDistance
	const yDistance = y - y2
	reflectionY = y2 - yDistance

	return [reflectionX, reflectionY]
}

// TODO: If this doesn't work, we may need to run *move to* for start x/start y at beginning of func
// TODO: If this doesn't work, we may need to run *move to* for end x/end y at end of func
// TODO: Also, I'm a Cartesian dumbass, so it's super possible I have params mixed up
// CONT: So also look more into the math definitions of these at https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d#cubic_b%C3%A9zier_curve
// this looks smart: https://stackoverflow.com/questions/18814022/what-is-the-difference-between-cubic-bezier-and-quadratic-bezier-and-their-use-c

// TODO: IT IS VERY LIKELY I OVER COMPLICATED THIS SCRIPT SLIGHTLY
// FIRST THING IF THIS DOESN'T WORK:
// SWAP curveX WITH endX and curveY with endY AND lastEndPoint needs to be changed to .length instead of .length - 1

// Type: Cubic Bezier curve
// C -> (absolute) || c -> (relative)
// S -> (absolute) || s -> (relative)
function runCubicBezierCurve(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: BezierCurveOpts = { DEBUG: false, isRelative: false, isSmooth: false }
) {
	if (opts.DEBUG) {
		console.log('Called runCubicBezierCurve with the following args:')
		console.log(`args: ${args}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const { area, cr, width, height } = gtkDrawFuncArgs
	const curveToCommand = opts.isRelative ? 'relCurveTo' : 'curveTo'

	const getTripletPairs = (index: number, prevPairList?: ParsedArgs) => {
		const tripletPairList: ParsedArgs = []

		// simple path
		if (!opts.isSmooth) {
			tripletPairList.push(args[index])
			tripletPairList.push(args[index + 1])
			tripletPairList.push(args[index + 2])
			return tripletPairList
		}

		// is smooth
		const cubicBezierCommands = 'cCsS'.split('')
		const previousCommand = opts.previousCommand ?? ''
		if (prevPairList !== undefined || (previousCommand !== '' && cubicBezierCommands.includes(previousCommand))) {
			// if previous command was a cubic bezier curve, the start point is the
			// reflection of the last command's end point about current point
			const previousArgs =
				prevPairList !== undefined ? prevPairList : getArgsFromArgString(opts.previousCommandArgString ?? '')
			const lastEndPoint = previousArgs[previousArgs.length - 1] // get the second last pair from the previous command
			tripletPairList.push(getReflection(lastEndPoint, cr.getCurrentPoint()))
		} else {
			// else, the start point is the same as the curve starting point (current position)
			tripletPairList.push(cr.getCurrentPoint())
		}

		tripletPairList.push(args[index])
		tripletPairList.push(args[index + 1])

		return tripletPairList
	}

	let tripletPairs = getTripletPairs(0)
	const [startX, startY] = tripletPairs[0]
	const [endX, endY] = tripletPairs[1] // TODO: Are these swapped with curve?
	const [curveX, curveY] = tripletPairs[2] // TODO: read above

	cr[curveToCommand](startX, startY, curveX, curveY, endX, endY)

	// run implicits
	for (let i = opts.isSmooth ? 2 : 3; i < args.length; i += opts.isSmooth ? 2 : 3) {
		const implicitTripletPairs = getTripletPairs(i, tripletPairs)
		const [implicitStartX, implicitStartY] = implicitTripletPairs[0]
		const [implicitEndX, implicitEndY] = implicitTripletPairs[1] // TODO: are these swapped with curve?
		const [implicitCurveX, implicitCurveY] = implicitTripletPairs[2]
		cr[curveToCommand](implicitStartX, implicitStartY, implicitCurveX, implicitCurveY, implicitEndX, implicitEndY)
		tripletPairs = implicitTripletPairs
	}
}

function getQuadraticDegreeElevation(
	currentX: number,
	currentY: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	const args: ParsedArgs = []

	args.push([(2.0 / 3.0) * x1 + (1.0 / 3.0) * currentX, (2.0 / 3.0) * y1 + (1.0 / 3.0) * currentY])
	args.push([(2.0 / 3.0) * x1 + (1.0 / 3.0) * x2, (2.0 / 3.0) * y1 + (1.0 / 3.0) * y2])
	args.push([y1, y2])

	return args
}

// function quadratic(x1: number, y1: number, x2: number, y2: number, cr: giCairo.Context) {
// 	const currentPos = cr.getCurrentPoint()
// 	const x0 = currentPos[0]
// 	const y0 = currentPos[1]

// 	cr.curveTo(
// 		(2.0 / 3.0) * x1 + (1.0 / 3.0) * x0,
// 		(2.0 / 3.0) * y1 + (1.0 / 3.0) * y0,
// 		(2.0 / 3.0) * x1 + (1.0 / 3.0) * x2,
// 		(2.0 / 3.0) * y1 + (1.0 / 3.0) * y2,
// 		y1,
// 		y2
// 	)
// }

// Type: Quadratic Bezier curve
// Q -> (absolute) || q -> (relative)
// T -> (absolute) || t -> (relative)
function runQuadraticBezierCurve(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: BezierCurveOpts = { DEBUG: false, isRelative: false, isSmooth: false }
) {
	if (opts.DEBUG) {
		console.log('Called runQuadraticBezierCurve with the following args:')
		console.log(`args: ${args}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const { area, cr, width, height } = gtkDrawFuncArgs
	const curveToCommand = opts.isRelative ? 'relCurveTo' : 'curveTo'

	const getDuoPairs = (index: number, prevPairList?: ParsedArgs) => {
		const duoPairList: ParsedArgs = []

		// simple path
		if (!opts.isSmooth) {
			duoPairList.push(args[index])
			duoPairList.push(args[index + 1])
			return duoPairList
		}

		// is smooth
		const quadraticBezierCommands = 'qQtT'.split('')
		const previousCommand = opts.previousCommand ?? ''
		if (prevPairList !== undefined || (previousCommand !== '' && quadraticBezierCommands.includes(previousCommand))) {
			// if previous command was a quadratic bezier curve, the control point is the
			// reflection of the last command's control point about current point
			// TODO: Unlike cubic (it's possible this affects cubic as well) it is likely that
			// we'll need to adjust previousArgs logic here since control point is calculated in tT cases
			const previousArgs =
				prevPairList !== undefined ? prevPairList : getArgsFromArgString(opts.previousCommandArgString ?? '')
			const lastEndPoint = previousArgs[previousArgs.length - 1] // get the second last pair from the previous command
			duoPairList.push(getReflection(lastEndPoint, cr.getCurrentPoint()))
		} else {
			// else, the start point is the same as the curve starting point (current position)
			duoPairList.push(cr.getCurrentPoint())
		}

		duoPairList.push(args[index])

		return duoPairList
	}

	let duoPairs = getDuoPairs(0)
	const [currentX, currentY] = cr.getCurrentPoint()
	const [controlPointX, controlPointY] = duoPairs[0]
	const [curveX, curveY] = duoPairs[1]

	const quadraticToCubicArgs = getQuadraticDegreeElevation(
		currentX,
		currentY,
		controlPointX,
		controlPointY,
		curveX,
		curveY
	)

	// TODO: It is possible the order of args needs to change
	const [cubicX, cubicY] = quadraticToCubicArgs[0]
	const [cubicX2, cubicY2] = quadraticToCubicArgs[2]
	const [cubicX3, cubicY3] = quadraticToCubicArgs[3]
	cr[curveToCommand](cubicX, cubicY, cubicX2, cubicY2, cubicX3, cubicY3)

	// run implicits
	for (let i = opts.isSmooth ? 1 : 2; i < args.length; i += opts.isSmooth ? 1 : 2) {
		const implicitDuoPairs = getDuoPairs(i, duoPairs)
		const [implicitControlX, implicitControlY] = implicitDuoPairs[0]
		const [implicitCurveX, implicitCurveY] = implicitDuoPairs[1]
		const [implicitCurrentX, implicitCurrentY] = cr.getCurrentPoint()

		const implicitQuadraticToCubicArgs = getQuadraticDegreeElevation(
			implicitCurrentX,
			implicitCurrentY,
			implicitControlX,
			implicitControlY,
			implicitCurveX,
			implicitCurveY
		)

		const [implicitCubicX, implicitCubicY] = implicitQuadraticToCubicArgs[0]
		const [implicitCubicX2, implicitCubicY2] = implicitQuadraticToCubicArgs[1]
		const [implicitCubicX3, implicitCubicY3] = implicitQuadraticToCubicArgs[2]

		cr[curveToCommand](
			implicitCubicX,
			implicitCubicY,
			implicitCubicX2,
			implicitCubicY2,
			implicitCubicX3,
			implicitCubicY3
		)
		duoPairs = implicitDuoPairs
	}
}

interface SvgArcParameterSet {
	rx: number
	ry: number
	xAxisRotation: number
	largeArcFlag: number
	sweepFlag: number
	x: number
	y: number
}

function degreesToRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function drawCairoArcFromSvgArcParameterSet(
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	paramSet: SvgArcParameterSet,
	opts: ArcCurveOpts = { DEBUG: false, isRelative: false }
) {
	const { area, cr, width, height } = gtkDrawFuncArgs

	// docs say to save and restore when doing rotate and scale operations
	cr.save()

	const [arcStartX, arcStartY] = cr.getCurrentPoint()
	const [arcEndX, arcEndY] = opts.isRelative
		? [arcStartX + paramSet.x, arcStartY + paramSet.y]
		: [paramSet.x, paramSet.y]

	const mx = (arcStartX + arcEndX) / 2
	const my = (arcStartY + arcEndY) / 2

	const dx = arcEndX - arcStartX
	const dy = arcEndY - arcStartY
	const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

	const angle = Math.atan2(dy, dx)

	const radius = paramSet.largeArcFlag === 1 ? Math.max(paramSet.rx, paramSet.ry) : Math.min(paramSet.rx, paramSet.ry)

	const cx = mx - (paramSet.rx * dy) / d
	const cy = my + (paramSet.ry * dx) / d

	// NOTE: if this doesn't work correctly, it may need to be scaled with width/height???
	cr.scale(paramSet.rx, paramSet.ry) // NOTE: This might need to be messed around with
	cr.rotate(degreesToRadians(paramSet.xAxisRotation)) // NOTE: Same

	// NOTE: These are stubbed to always draw quarter circles
	const startAngle = 0
	const endAngle = 90

	// NOTE: this might not work
	const arcCommand = paramSet.sweepFlag === 1 ? 'arc' : 'arcNegative'
	cr[arcCommand](cx, cy, radius, startAngle, endAngle)

	// docs say to save and restore when doing rotate and scale operations
	cr.restore()

	cr.moveTo(arcEndX, arcEndY) // NOTE: idk if this is how it's supposed to work
}

// TODO: This probably doesn't fully work yet
// TODO: It is possible this one needs a bit of a diff paradigm since there is no relArc
// TODO: There is negativeArc and arc
// TODO: I left off here, since the elliptical curve inputs in SVG path are diff from Cairo arc

// Type: Elliptical arc curve
// A -> arc (absolute) || a -> arc (relative)
function runEllipticalArcCurve(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: ArcCurveOpts = { DEBUG: false, isRelative: false }
) {
	if (opts.DEBUG) {
		console.log('Called runEllipticalArcCurve with the following args:')
		console.log(`args: ${getArgString(args)}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const getParameterSet = (index: number): SvgArcParameterSet => {
		const [rx, ry] = args[index] // x and y radius of the ellipse
		// const [ry] = args[index + 1] // y radius of the ellipse
		const [xAxisRotation] = args[index + 1] // rotation in degrees of the ellipse relative to x axis
		const [largeArcFlag, sweepFlag] = args[index + 2] // 0 = small arc, 1 = large arc
		// const [sweepFlag] = args[index + 4] // 0 = counter clockwise, 1 = clockwise
		const [x, y] = args[index + 3] // coordinate to draw the arc to (if relative, current point x shifted by x and current point y shifted by y)

		return { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y }
	}

	const { area, cr, width, height } = gtkDrawFuncArgs
	const paramSet = getParameterSet(0)

	// drawCairoArcFromSvgArcParameterSet(gtkDrawFuncArgs, paramSet, opts)

	// implicit arcs
	for (let i = 6; i < args.length; i += 6) {
		const implicitParamSet = getParameterSet(i)
		// drawCairoArcFromSvgArcParameterSet(gtkDrawFuncArgs, implicitParamSet, opts)
	}
}

// Type: ClosePath
// Z -> close path (absolute) || z -> close path (relative)
function runClosePath(
	args: ParsedArgs,
	gtkDrawFuncArgs: GtkCairoDrawFuncArgs,
	opts: { DEBUG: boolean } = { DEBUG: false }
) {
	if (opts.DEBUG) {
		console.log('Called runClosePath with the following args:')
		console.log(`args: ${args}`)
		console.log(gtkDrawFuncArgs)
		console.log(opts)
	}

	const { cr } = gtkDrawFuncArgs

	cr.closePath()
}

export default { setCairoPathFromSvgPath }
