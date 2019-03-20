import * as d3 from "d3";
import * as React from "react";
import styled from "styled-components";

const Graph = styled.div`
  display: inline-block;
  color: #9e9e9e;
  width: 100%;

  .line {
    fill: none;
    stroke: gray;
    stroke-width: 2px;
  }
  .area {
    fill: ${(props: { color: string }) => props.color};
    opacity: 0.75;
  }
  .axis-x .tick line {
    stroke: none;
  }
`;

const n = 100;
const duration = 1000;

interface Props {
  id: string;
  bytes: number;
  color: string;
}

export class PathTransitionGraph extends React.Component<Props> {
  private transition: d3.Transition<HTMLElement, {}, null, undefined>;
  private area: d3.Area<number>;
  private line: d3.Line<number>;
  private xScale: d3.ScaleTime<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private xAxis: any;
  private yAxis: any;
  private yAxisGroup: any;
  private prevBytes: number;
  private now: number;
  private lastBytes: number;
  private data: number[];
  private selector: string;

  constructor(props: Props) {
    super(props);
    this.selector = `#graph-${this.props.id}`;
    this.now = new Date(Date.now() - duration).getTime();
    this.data = Array(100).fill(0);
    this.prevBytes = 0;
    this.lastBytes = 0;
  }

  public componentDidMount() {
    this.setup();
    this.tick();
  }

  public shouldComponentUpdate({ bytes }: Props) {
    bytes = bytes / 1024;

    this.prevBytes = this.prevBytes === 0 ? bytes : this.prevBytes;
    this.lastBytes = bytes - this.prevBytes;
    this.prevBytes = bytes;

    return false;
  }

  public render() {
    return <Graph id={this.selector.substring(1)} color={this.props.color} />;
  }

  private setup() {
    const margin = { top: 10, right: 20, bottom: 10, left: 40 };

    const svg = d3
      .select(this.selector)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    let { width, height } = getElementSize(this.selector);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    this.xScale = d3
      .scaleTime()
      .domain([this.now - (n - 2) * duration, this.now - duration])
      .range([0, width]);

    this.yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max<number, number>(this.data, (d) => d + 10)]);

    this.area = d3
      .area<number>()
      .x((d, i) => this.xScale(this.now - (n - 1 - i) * duration))
      .y0(height)
      .y1((d) => this.yScale(d))
      .curve(d3.curveBasis);

    this.line = d3
      .line<number>()
      .x((d, i) => this.xScale(this.now - (n - 1 - i) * duration))
      .y((d) => this.yScale(d))
      .curve(d3.curveBasis);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    this.xAxis = d3
      .axisBottom(this.xScale)
      .ticks(15)
      .tickSize(-height);
    this.yAxis = d3.axisLeft(this.yScale).ticks(5);

    g.append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(this.xAxis);

    this.yAxisGroup = g
      .append("g")
      .attr("class", "axis-y")
      .call(this.yAxis);

    this.yAxisGroup
      .append("text")
      .attr("y", 0)
      .attr("x", 20)
      .attr("dy", "0.5em")
      .attr("fill", "currentColor")
      .style("text-anchor", "end")
      .text("KiB");

    this.transition = d3
      .transition(`transition-${this.props.id}`)
      .duration(duration)
      .ease(d3.easeLinear);

    g.append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .datum(this.data)
      .attr("class", "area");

    g.append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .datum(this.data)
      .attr("class", "line");
  }

  private tick() {
    this.transition = this.transition
      .each(() => {
        this.data.push(this.lastBytes);
        this.now = new Date().getTime();
        this.yScale.domain([0, d3.max<number, number>(this.data, (d) => d + 10)]);
        this.yAxisGroup.transition().call(this.yAxis);

        this.xScale.domain([
          this.now - (n - 2) * duration,
          this.now - duration
        ]);

        d3.select(`${this.selector} .line`)
          .attr("d", this.line)
          .attr("transform", null)
          .transition(this.transition)
          .attr(
            "transform",
            `translate(${this.xScale(this.now - (n - 1) * duration)})`
          );

        d3.select(`${this.selector} .axis-x`)
          .transition(this.transition)
          .call(this.xAxis);

        d3.select(`${this.selector} .area`)
          .attr("d", this.area)
          .attr("transform", null)
          .transition(this.transition)
          .attr(
            "transform",
            `translate(${this.xScale(this.now - (n - 1) * duration)})`
          );

        this.data.shift();
      })
      .transition()
      .on(`start.${this.props.id}`, () => this.tick());
  }
}

const getElementSize = (
  selector: string
): { width: number; height: number } => {
  const { width, height } = d3
    .select<SVGElement, SVGElement>(selector)
    .node()
    .getBoundingClientRect();
  return { width, height };
};
