import * as d3 from 'd3'
import './style.scss'
import * as random from 'random'
import * as colors from 'css-color-names'

// console.log(
// 	Object.entries(colors.default)
// )

const doIt = () => {

	let w = 700
	let h = 500
	let margin = 10
	let tDuration = 1000
	let delay = 4500

	let svg = d3.select('#svg')
	.attr('width', w).attr('height', h)
	.style('border', '1px solid black')
	.style('background', 'black')
	
	const createData = (n) => (new Array(n).fill(1).map((elt, idx) => ([random.int(1, 100), random.int(1, 100), idx])).sort((a, b) => b[0] - a[0]))

	const getRandColor = () => Object.entries(colors.default)[random.int(0, 148)][0]

	let dataLen = 0

	let scaleX = d3.scaleLinear()
	.domain([0, 100])
	.range([margin, w - margin])

	let scaleY = d3.scaleLinear()
	.domain([0, 100])
	.range([margin, h - margin])

	let circle_group = d3.select('#svg')

	let lineMkr = d3.line()
	.x(d => scaleX(d[0]))
	.y(d => scaleY(d[1]))

	const drawPath = data => {
		if (svg.selectAll('path')) svg.selectAll('path').remove()

		let lineClr = getRandColor()

		let path = svg.selectAll('path')
		.data([data], d => d) // we wrap data in brackets here to include the entire
		// data set for a single element; otherwise, we will end up appending
		// n number of paths, which we don't want
		.enter().append('path')

		path
		.attr('d', lineMkr)
		.attr('fill', 'none')
		.attr('stroke', lineClr)

		if (path && path.node()) {
			let totalLength = path.node().getTotalLength()

			path
			.attr('stroke-dasharray', totalLength + ' ' + totalLength)
			.attr('stroke-dashoffset', -totalLength)
			.transition().delay(tDuration).duration(tDuration)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0)
		}
	}

	const start = () => {
		let data = createData(random.int(10, 100))
		let dotClr = getRandColor()

		let circles = circle_group
		.selectAll('circle')
		.data(data)

		if (data.length > dataLen) {
			circles.enter()
			.append('circle')
			.merge(circles)
			.transition().duration(tDuration)
			.attr('cx', d => scaleX(d[0]))
			.attr('cy', d => scaleY(d[1]))
			.attr('r', 3)
			.attr('fill', dotClr)
		} else {
			circles.exit()
			.remove()
			.merge(circles)
			.transition().duration(tDuration)
			.attr('cx', d => scaleX(d[0]))
			.attr('cy', d => scaleY(d[1]))
			.attr('r', 3)
			.attr('fill', dotClr)
		}

		dataLen = data.length

		drawPath(data)

		setTimeout(start, delay)
	}

	start()

}

window.doIt = doIt
