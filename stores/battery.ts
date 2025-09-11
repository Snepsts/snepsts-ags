import GObject, { register, property } from 'ags/gobject'
import Battery from 'gi://AstalBattery'

@register()
class BatteryStore extends GObject.Object {
	@property(Boolean) isCharging = false
	@property(Number) percentage = 0
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
	batteryStore.percentage = Math.round(battery.percentage * 100)
}

battery.connect('notify::percentage', () => {
	setPercentage()
})

export default batteryStore
