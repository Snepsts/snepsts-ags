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
