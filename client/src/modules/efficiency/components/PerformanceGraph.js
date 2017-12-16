import React from 'react'
import * as d3 from 'd3'

export class PerformanceGraph extends React.Component {
  constructor (props) {
    super(props)

    this.svgChart = null
    this.draw = this.draw.bind(this)
    this.renderChart = this.renderChart.bind(this)
  }

  componentDidMount () {
    const margin = {top: 10, right: 10, bottom: 10, left: 10}
    const width = this.props.width - margin.left - margin.right
    const height = (this.props.height * 0.7) - margin.top - margin.bottom
    const xScale = d3.scaleLinear().domain([0, (this.props.length * 60) - 1]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0])
    const line = d3.line()
      .x((d, i) => { return xScale(i) })
      .y((d) => { return yScale(d.y) })

    this.configs = {
      width,
      height,
      data: this.props.data,
      xScale,
      yScale,
      line,
      margin
    }

    this.draw(this.configs)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data !== this.props.data) {
      this.renderChart({
        ...this.configs,
        data: nextProps.data
      })
    }
  }

  draw (configs) {
    this.svgChart = d3.select('.perf-chart').append('svg')
      .attr('width', configs.width + configs.margin.left + configs.margin.right)
      .attr('height', configs.height + configs.margin.top + configs.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + configs.margin.left + ',' + configs.margin.top + ')')

    this.svgChart.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + configs.height + ')')
      .call(d3.axisBottom(configs.xScale)
        .ticks(10)
        .tickSize(-configs.height)
        .tickFormat(''))

    this.svgChart.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(configs.yScale)
        .ticks(10)
        .tickSize(-configs.width)
        .tickFormat(''))

    this.svgChart.append('path')
      .datum(configs.data)
      .attr('class', 'line')
      .attr('stroke', 'red')
      .attr('fill', 'none')
      .attr('d', configs.line)
  }

  renderChart (configs) {
    this.svgChart.select('.line')
      .attr('d', configs.line(configs.data))
  }

  render () {
    return (
      <div className="perf-chart">

      </div>
    )
  }
}

export default PerformanceGraph
