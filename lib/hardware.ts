export class PerformanceMonitor<T> {
	history: T[] = []
	historyLimit: number

	constructor(limit: number) {
		this.historyLimit = limit
	}

	addToHistory(entry: T) {
		if (this.history.length >= this.historyLimit) {
			this.history.shift()
		}

		this.history.push(entry)
	}
}
