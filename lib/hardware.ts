import GObject, { getter, register } from 'ags/gobject'

@register()
export class PerformanceMonitor<T> extends GObject.Object {
	_history: T[] = []
	_historyLimit: number

	constructor(limit: number) {
		super()
		this._historyLimit = limit
	}

	addToHistory(entry: T) {
		if (this._history.length >= this._historyLimit) {
			this._history.shift()
		}

		this._history.push(entry)
		this.notify('history')
	}

	@getter(Array<T>)
	get history() {
		return this._history
	}

	@getter(Number)
	get historyLimit() {
		return this._historyLimit
	}
}
