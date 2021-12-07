function Data() {
	var date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours()
	let miuite = date.getMinutes()
	let wordMounth = null
	let timestrap = null
	hour >= 0 && hour <= 5 
	? timestrap = '凌晨'
	: hour > 5 && hour < 11
	? timestrap = '清晨'
	: hour > 10 && hour < 13
	? timestrap = '中午'
	: hour > 12 && hour < 18
	? timestrap = '下午'
	: hour > 17 && hour < 19
	? timestrap = '傍晚'
	: hour > 18 && hour < 23
	? timestrap = '晚上'
	: hour > 22 && hour < 24
	? timestrap = '深夜'
	: ''
	if (day < 10) {
		day = '0' + day
	}
	if (miuite < 10) {
		miuite = '0'+miuite
	}
	month === 1
	? wordMounth = 'January'
	: month === 2
	? wordMounth = 'February'
	: month === 3
	? wordMounth = 'March'
	: month === 4
	? wordMounth = 'April'
	: month === 5
	? wordMounth = 'May'
	: month === 6
	? wordMounth = 'June'
	: month === 7
	? wordMounth = 'July'
	: month === 8
	? wordMounth = 'August'
	: month === 9
	? wordMounth = 'September'
	: month === 10
	? wordMounth = 'October'
	: month === 11
	? wordMounth = 'November'
	: month === 12
	? wordMounth = 'December'
	: ''
	return {year,month,day,hour,miuite,timestrap,wordMounth}
}

export default Data
