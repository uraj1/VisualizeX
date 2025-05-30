"use client"

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };
const BUCKET_NUMBER = 70;
const BUCKET_PADDING = 1;

type HistogramProps = {
  width: number;
  height: number;
  data: number[];
};

export const Histogram = ({ width, height, data }: HistogramProps) => {
  const axesRef = useRef<SVGSVGElement>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1000])
      .range([10, boundsWidth]);
  }, [boundsWidth]);

  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin<number, number>()
      .value((d) => d)
      .domain([0, 1000])
      .thresholds(xScale.ticks(BUCKET_NUMBER));
    return bucketGenerator(data);
  }, [data, xScale]);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length ?? 0));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [buckets, boundsHeight]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const allRects = buckets.map((bucket, i) => {
    if (!bucket) return null;
    return (
      <rect
        key={i}
        fill="#69b3a2"
        x={xScale(bucket.x0 ?? 0) + BUCKET_PADDING / 2} // Use optional chaining and nullish coalescing operator
        width={xScale(bucket.x1 ?? 0) - xScale(bucket.x0 ?? 0) - BUCKET_PADDING} // Use optional chaining and nullish coalescing operator
        y={yScale(bucket.length ?? 0)}
        height={boundsHeight - yScale(bucket.length ?? 0)}
      />
    );
  });  

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};
