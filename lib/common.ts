import { Accessor } from 'ags'
import { readFile, readFileAsync } from 'ags/file'
import GLib from 'gi://GLib?version=2.0'

const DEBUG = false

// NOTE: JSX.Element is an alias for GObject.Object
export type Children = JSX.Element | Array<JSX.Element>

export function getVisible(visible: Accessor<boolean> | boolean | undefined) {
	return visible === undefined ? true : visible
}

export function getSnepstsOsConfigDir() {
	return `${GLib.get_home_dir()}/.config/snepsts-os`
}

export function readConfFile(filePath: string) {
	let file: string | null = null
	try {
		file = readFile(filePath)
	} catch (err) {
		console.error(err)
		throw err
	}

	return getParsedConfObject(file)
}

export async function readConfFileAsync(filePath: string) {
	let file: string | null = null
	try {
		file = await readFileAsync(filePath)
	} catch (err) {
		console.error(err)
		throw err
	}

	return getParsedConfObject(file)
}

function getParsedConfObject(file: string) {
	const parsedEntries: string[][] = []
	const lines = file.split('\n')
	for (const line of lines) {
		const parsed = parseConfLine(line)
		if (parsed !== null) {
			parsedEntries.push(parsed)
		}
	}

	const parsedObject: { [key: string]: string } = {}
	for (const keyValue of parsedEntries) {
		parsedObject[keyValue[0]] = keyValue[1]
	}

	return parsedObject
}

function parseConfLine(confLine: string): string[] | null {
	if (confLine.trim() === '' || confLine[0] === '#') {
		if (DEBUG) {
			console.log('Empty or commented line detected, skipping')
		}
		return null
	}

	const parsed = confLine.split('=')
	if (parsed.length <= 1) {
		if (DEBUG) {
			console.log(`Parsed line: "${confLine}" not detected as a valid line, skipping.`)
		}
		return null
	}

	const returnValue = [parsed[0].trim(), parsed[1].trim()]
	if (DEBUG) {
		console.log(`Returning {${returnValue[0]}: ${returnValue[1]}}`)
	}
	return returnValue
}

const hexToNumberMap: { [key: string]: number } = {
	'0': 0,
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	a: 10,
	A: 10,
	b: 11,
	B: 11,
	c: 12,
	C: 12,
	d: 13,
	D: 13,
	e: 14,
	E: 14,
	f: 15,
	F: 15,
}

function convertHexToNumber(hexAsString: string) {
	if (DEBUG) {
		console.log(`Converting ${hexAsString} to number`)
	}
	let bigValue = hexToNumberMap[hexAsString[0]] ?? null
	if (bigValue === null) {
		if (DEBUG) {
			console.log('Big Value detected as wrong')
		}
		return 0
	}
	bigValue *= 16
	const littleValue = hexToNumberMap[hexAsString[1]] ?? null
	if (littleValue === null) {
		if (DEBUG) {
			console.log('Little Value detected as wrong')
		}
		return 0
	}
	return bigValue + littleValue
}

export function hexToRgb(hexString: string) {
	if (DEBUG) {
		console.log(`Converting ${hexString} to rgb value`)
	}

	if (hexString[0] !== '#' || hexString.length < 7) return { r: 0, g: 0, b: 0 }

	const r = convertHexToNumber(hexString.substring(1, 3))
	const g = convertHexToNumber(hexString.substring(3, 5))
	const b = convertHexToNumber(hexString.substring(5, 7))

	if (DEBUG) {
		console.log(`Converted ${hexString} to R: ${r}, G: ${g}, B: ${b}`)
	}

	return { r, g, b }
}

export function convertRgbToCairo(rgb: { r: number; g: number; b: number }) {
	return { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 }
}
