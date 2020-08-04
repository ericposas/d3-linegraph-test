import * as d3 from 'd3'
import './style.scss'
import * as random from 'random'


const doIt = () => {

	let w = 700
	let h = 500
	let margin = 20
	let tDuration = 1500

	let svg = d3.select('#svg')
	.attr('width', w).attr('height', h)
	.style('border', '1px solid black')

	const createData = (n) => (new Array(n).fill(1).map((elt, idx) => ([random.int(1, 100), random.int(1, 100), idx])).sort((a, b) => b[0] - a[0]))

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
		if (svg.selectAll('path')) {
			svg.selectAll('path').remove()
		}

		let path = svg.selectAll('path')
		.data([data], d => d)
		.enter().append('path')

		path
		.attr('d', lineMkr)
		.attr('fill', 'none')
		.attr('stroke', 'black')

		if (path && path.node()) {
			let totalLength = path.node().getTotalLength()

			path
			.attr('stroke-dasharray', totalLength + ' ' + totalLength)
			.attr('stroke-dashoffset', -totalLength)
			.transition().duration(tDuration)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0)
		}
	}

	const start = () => {
		// console.log(createData(10))
		let data = createData(20)

		let circles = circle_group
		.selectAll('circle')
		.data(data)

		circles.enter()
		.append('circle')
		.transition().duration(tDuration)
		.attr('cx', d => scaleX(d[0]))
		.attr('cy', d => scaleY(d[1]))
		.attr('r', 3)
		.attr('fill', 'red')

		drawPath(data)

		setTimeout(() => {
			delayed()
		}, 3000)
	}

	const restart = () => {
		let data = createData(35)

		let circles = circle_group
		.selectAll('circle')
		.data(data)

		circles.exit().remove()

		circles
		.data(data)
		.merge(circles)
		.transition().duration(tDuration)
		.attr('cx', d => scaleX(d[0]))
		.attr('cy', d => scaleY(d[1]))
		.attr('r', 3)
		.attr('fill', 'red')

		drawPath(data)

		setTimeout(() => {
			delayed()
		}, 3000)
	}

	const delayed = () => {
		let data = createData(random.int(10, 20))

		let circles = circle_group
		.selectAll('circle')
		.data(data)

		circles
		.exit().remove()

		circles
		.data(data)
		.merge(circles)
		.transition().duration(tDuration)
		.attr('fill', 'lightblue')
		.attr('cx', d => scaleX(d[0]))
		.attr('cy', d => scaleY(d[1]))

		drawPath(data)

		setTimeout(delayed2, 3000)
	}

	const delayed2 = () => {
		let data = createData(50)

		let circles = circle_group
		.selectAll('circle')
		.data(data)

		circles.enter().append('circle')
		.merge(circles)
		.transition().duration(tDuration)
		.attr('r', 3)
		.attr('fill', 'lightgreen')
		.attr('cx', d => scaleX(d[0]))
		.attr('cy', d => scaleY(d[1]))

		drawPath(data)

		setTimeout(restart, 3000)
	}

	start()

}

window.doIt = doIt
