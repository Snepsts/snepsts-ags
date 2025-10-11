import { exec } from 'ags/process'

const DEBUG = false

// /proc/stat spits out cpu<index> info
// need to add up all busy time - idle time

export interface ProcInfoCpuOutput {
	id: string
	user: number
	nice: number
	system: number
	idle: number
	iowait: number
	irq: number
	softirq: number
}

export interface CpuThreadInfo {
	thread: number
	usage: number // a percentage, will be between 0-100
}

interface CpuUsageInfo {
	usage: number
	threads: CpuThreadInfo[]
}

export function getCpuUsageInfo(procInfoCache: ProcInfoCpuOutput[]) {
	// if there is no cache, this is a first time run
	let firstTime = false
	if (procInfoCache.length === 0 || procInfoCache[0].user === 0) {
		firstTime = true
	}

	const cpuUsageInfo: CpuUsageInfo = { usage: 0, threads: [] }

	const procInfo = getProcStatCpuInfo()

	if (firstTime) {
		return { cpuUsageInfo, cache: procInfo }
	}

	const cpuToPerfMap: { [id: string]: ProcInfoCpuOutput } = {}
	const cpuToPerfMapCache: { [id: string]: ProcInfoCpuOutput } = {}

	for (const procLine of procInfo) {
		cpuToPerfMap[procLine.id] = procLine
	}

	for (const procLineCache of procInfoCache) {
		cpuToPerfMapCache[procLineCache.id] = procLineCache
	}

	// the logic for this is simple: any time not spend idle is busy time
	// (note I am not an expert, this could be wrong lol)
	// TODO: Usage is always a little higher than reported in bashtop, investigate
	for (const cpuToPerfKey in cpuToPerfMap) {
		const entry = cpuToPerfMap[cpuToPerfKey]
		const cacheEntry = cpuToPerfMapCache[cpuToPerfKey]

		const user = entry.user - cacheEntry.user
		const nice = entry.nice - cacheEntry.nice
		const system = entry.system - cacheEntry.system
		const idle = entry.idle - cacheEntry.idle
		const iowait = entry.iowait - cacheEntry.iowait
		const irq = entry.irq - cacheEntry.irq
		const softirq = entry.softirq - cacheEntry.softirq

		const totalTime = user + nice + system + idle + iowait + irq + softirq
		const busyTime = user + nice + system + iowait + irq + softirq

		const usage = Math.round((busyTime / totalTime) * 100)

		if (DEBUG) {
			console.log(`Busy time: ${busyTime}, total time: ${totalTime}, usage: ${usage}`)
		}

		if (entry.id === 'cpu') {
			cpuUsageInfo.usage = usage
		} else {
			// cpu#
			const threadInfo: CpuThreadInfo = { thread: Number(entry.id.at(3)), usage }
			cpuUsageInfo.threads.push(threadInfo)
		}
	}

	return { cpuUsageInfo, cache: procInfo }
}

// we're assuming /proc/info has the following output:
// cpu  ###### # #### ####### ### #### ### # # #
// cpu0 ###### # #### ####### ### #### ### # # #
// etc
function getProcStatCpuInfo() {
	const cpuInfo: ProcInfoCpuOutput[] = []

	const procInfoOutput = exec('cat /proc/stat')
	const outputByLine = procInfoOutput.split('\n')

	for (const line of outputByLine) {
		if (!line.startsWith('cpu')) {
			// only cpu lines are needed
			continue
		}

		const outputSplit = line.split(' ').filter((x) => x !== '')
		const procInfoCpu: ProcInfoCpuOutput = {
			id: outputSplit[0],
			user: Number(outputSplit[1]),
			nice: Number(outputSplit[2]),
			system: Number(outputSplit[3]),
			idle: Number(outputSplit[4]),
			iowait: Number(outputSplit[5]),
			irq: Number(outputSplit[6]),
			softirq: Number(outputSplit[7]),
		}

		cpuInfo.push(procInfoCpu)
	}

	return cpuInfo
}
