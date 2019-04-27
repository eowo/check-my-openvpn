import * as d3 from "d3";
import * as React from "react";
import styled from "styled-components";

const Graph = styled.div`
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

const margin = { top: 10, right: 10, bottom: 15, left: 40 };
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
  private clipPath: any;
  private prevKiB: number;
  private now: number;
  private lastKiB: number;
  private data: number[];
  private selector: string;
  private width: number;
  private height: number;

  constructor(props: Props) {
    super(props);
    this.selector = `#graph-${this.props.id}`;
    this.now = new Date(Date.now() - duration).getTime();
    this.data = Array(100).fill(0);
    this.prevKiB = 0;
    this.lastKiB = 0;

    this.setDimension = this.setDimension.bind(this);
  }

  public componentDidMount() {
    this.setup();
    this.tick();

    window.addEventListener("resize", this.setDimension);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.setDimension);
  }

  public shouldComponentUpdate({ bytes }: Props) {
    const KiB = bytes / 1024;

    this.lastKiB = KiB - (this.prevKiB === 0 ? KiB : this.prevKiB);
    this.prevKiB = KiB;

    return false;
  }

  public render() {
    return <Graph id={this.selector.substring(1)} color={this.props.color} />;
  }

  private setDimension() {
    ({ width: this.width, height: this.height } = getElementSize(
      this.selector
    ));

    this.width = this.width - margin.left - margin.right;
    this.height = this.height - margin.top - margin.bottom;
  }

  private setup() {
    const svg = d3
      .select(this.selector)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    this.setDimension();

    this.xScale = d3
      .scaleTime()
      .domain([this.now - (n - 2) * duration, this.now - duration])
      .range([0, this.width]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max<number, number>(this.data, (d) => d + 10)])
      .range([this.height, 0]);

    this.area = d3
      .area<number>()
      .x((d, i) => this.xScale(this.now - (n - 1 - i) * duration))
      .y0(this.height)
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

    this.clipPath = svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    this.xAxis = d3
      .axisBottom(this.xScale)
      .ticks(15)
      .tickSize(-this.height);
    this.yAxis = d3.axisLeft(this.yScale).ticks(5);

    g.append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + this.height + ")")
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
        this.data.push(this.lastKiB);
        this.now = new Date().getTime();

        this.yScale
          .domain([0, d3.max<number, number>(this.data, (d) => d + 10)])
          .range([this.height, 0]);
        this.xScale
          .domain([this.now - (n - 2) * duration, this.now - duration])
          .range([0, this.width]);

        this.clipPath.attr("width", this.width).attr("height", this.height);

        this.yAxisGroup.transition().call(this.yAxis);

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
