import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import "../index.css";
import "./mainboard.css";

const MARGIN = { top: 60, right: 50, bottom: 80, left: 50 };
const BAR_PADDING = 0.2;
const PLOT_LAYOUT = { width: 600, height: 500 };

const Barplot = ({ width, height, data }) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [tooltipContent, setTooltipContent] = useState("");
    const tooltipRef = useRef();

    const [hoverPart, setHoverPart] = useState(null);

    // Show tooltip
    const showTooltip = (event, data) => {
        setTooltipContent(
            `${data.date}\n Done:  ${data.done}% \n Not done:  ${data.notdone}%`
        );
        const tooltipEl = tooltipRef.current;
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = `${event.pageX + 10}px`;
        tooltipEl.style.top = `${event.pageY + 10}px`;
    };

    // Hide tooltip
    const hideTooltip = () => {
        tooltipRef.current.style.opacity = 0;
    };

    const xScale = d3
        .scaleBand()
        .domain(data.map((data) => data.day))
        .range([0, boundsWidth])
        .padding(BAR_PADDING);

    const yScale = d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]);

    const stackedBars = data.map((d, i) => {
        const x = xScale(d.day);
        const heightDone = yScale(0) - yScale(d.done);
        const heightNotDone = yScale(0) - yScale(d.notdone);

        return (
            <g key={i}>
                {/* Bar for 'done', placed at the bottom */}
                <rect
                    x={x}
                    y={boundsHeight - heightDone}
                    width={xScale.bandwidth()}
                    height={heightDone}
                    style={{
                        fill: "var(--color-primary)",
                        opacity: hoverPart === "notdone" ? 0 : 1,
                    }}
                    onMouseOver={() => setHoverPart("done")}
                    onMouseOut={() => setHoverPart(null)}
                />
                {/* Bar for 'notdone', stacked on top of 'done' */}
                <rect
                    x={x}
                    y={boundsHeight - heightDone - heightNotDone}
                    width={xScale.bandwidth()}
                    height={heightNotDone}
                    style={{
                        fill: "var(--color-secondary)",
                        opacity: hoverPart === "done" ? 0 : 0.35,
                    }}
                    onMouseOver={() => setHoverPart("notdone")}
                    onMouseOut={() => setHoverPart(null)}
                />
            </g>
        );
    });

    return (
        <div>
            <svg width={width} height={height}>
                <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                    {stackedBars.map((bar, index) => (
                        <g
                            key={index}
                            onMouseOver={(event) =>
                                showTooltip(event, data[index])
                            }
                            onMouseOut={hideTooltip}
                        >
                            {bar}
                        </g>
                    ))}
                    <line
                        x1={0}
                        y1={boundsHeight}
                        x2={boundsWidth}
                        y2={boundsHeight}
                        className="x-axis-line"
                    />
                </g>
            </svg>
            <div className="tooltip" ref={tooltipRef}>
                {tooltipContent}
            </div>
        </div>
    );
};

const Stats = ({ statsData }) => {
    const [plotWidth, setPlotWidth] = useState(window.innerWidth * 0.9);

    useEffect(() => {
        // function to update the plot width
        const updatePlotWidth = () => {
            setPlotWidth(window.innerWidth * 0.9);
        };

        // update plot width when the window resizes
        window.addEventListener("resize", updatePlotWidth);

        // set the initial plot width
        updatePlotWidth();

        // remove the event listener
        return () => {
            window.removeEventListener("resize", updatePlotWidth);
        };
    }, []);
    const computedData = statsData.map((stats, index) => {
        const done = Math.ceil(
            (stats.numberCompletedTasks / stats.numberListedTasks) * 100
        );
        const notdone = 100 - done;

        return {
            day: `${index + 1}`,
            date: stats.formattedDate,
            done: done,
            notdone: notdone,
        };
    });

    return (
        <div className="barplot">
            <Barplot
                width={plotWidth}
                height={PLOT_LAYOUT.height}
                data={computedData}
            />
        </div>
    );
};

export default Stats;
