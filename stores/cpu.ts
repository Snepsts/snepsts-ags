import { interval } from 'ags/time'
import { readConfFile, getSnepstsOsConfigDir } from '../lib/common'
import GObject, { register, property } from 'ags/gobject'
import { getCpuUsageInfo, ProcInfoCpuOutput, CpuThreadInfo, CpuUsageInfo } from '../lib/cpu'
import { PerformanceMonitor } from '../lib/hardware'

// TODO: make perfMonitor history configurable
const perfMonitor = new PerformanceMonitor<CpuUsageInfo>(10)

const defaultCpuThreadInfo: CpuThreadInfo[] = [{ thread: 0, usage: 0 }]

@register()
class CpuStore extends GObject.Object {
	@property(Number) cores = 0
	@property(Number) threads = 0
	@property(String) name = 'N/A'
	@property(Boolean) initializing = true
	@property(Array<CpuThreadInfo>) threadUsage = defaultCpuThreadInfo
	@property(Number) totalUsage = 0
	// TODO: How to do the below???
	// @property(PerformanceMonitor<CpuUsageInfo>) performanceMonitor = perfMonitor
}

const cpuStore = new CpuStore()

function initCpuStore() {
	try {
		const confVars = readConfFile(`${getSnepstsOsConfigDir()}/hw/cpu/cpu.conf`)
		cpuStore.cores = Number(confVars['cores']) || 0
		cpuStore.threads = Number(confVars['threads']) || 0
		cpuStore.name = confVars['name'] || 'N/A'
	} catch (err) {
		console.error('Failed to initialize CPU Store')
		console.error(err)
	} finally {
		cpuStore.initializing = false
	}
}

initCpuStore()

// TODO: make cpu perf interval configurable

let procCache: ProcInfoCpuOutput[] = []
interval(2000, () => {
	const { cpuUsageInfo, cache } = getCpuUsageInfo(procCache)
	cpuStore.totalUsage = cpuUsageInfo.usage
	cpuStore.threadUsage = cpuUsageInfo.threads
	procCache = cache
})

export default cpuStore
