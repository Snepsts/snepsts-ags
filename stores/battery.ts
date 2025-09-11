import GObject, { register, property } from 'ags/gobject'
import Battery from 'gi://AstalBattery'

@register()
class BatteryStore extends GObject.Object {
	@property(Boolean) isCharging = false
	@property(Number) percentage = 0
	@property(Boolean) isFull = false
}

const battery = Battery.get_default()
const batteryStore = new BatteryStore()

function initBattery() {
	batteryStore.isCharging = battery.charging
	setPercentage()
}

initBattery()

battery.connect('notify::charging', () => {
	batteryStore.isCharging = battery.charging
})

function setPercentage() {
	const percentage = Math.round(battery.percentage * 100)
	batteryStore.percentage = percentage
	batteryStore.isFull = percentage === 100
}

battery.connect('notify::percentage', () => {
	setPercentage()
})

export default batteryStore
