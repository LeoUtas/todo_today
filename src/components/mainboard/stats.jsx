import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import "../../index.css";
import "./mainboard.css";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.2;

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

    const getDayOfYear = (dateString) => {
        const date = new Date(dateString);
        const start = new Date(date.getFullYear(), 0, 0);
        const diff =
            date -
            start +
            (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const xScale = d3
        .scaleLinear()
        .domain([0, 365]) // Setting domain from 0 to 365
        .range([0, boundsWidth]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]);

    const stackedBars = data.map((d, i) => {
        const x = xScale(getDayOfYear(d.date));
        const heightDone = yScale(0) - yScale(d.done);
        const heightNotDone = yScale(0) - yScale(d.notdone);

        // Calculate the bar width
        const barWidth = boundsWidth / 365 - BAR_PADDING;

        return (
            <g key={i}>
                {/* Bar for 'done', placed at the bottom */}
                <rect
                    x={x}
                    y={boundsHeight - heightDone}
                    width={barWidth}
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
                    width={barWidth}
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

                    <text
                        x={boundsWidth / 2} // middle of the x-axis
                        y={boundsHeight + 25} // 20px below the x-axis
                        textAnchor="middle" // Center the text
                        className="x-axis-text"
                    >
                        Your 365 days
                    </text>
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
    const [plotHeight, setPlotHeight] = useState(window.innerHeight * 0.9);

    useEffect(() => {
        // function to update the plot width & height
        const updatePlotSize = () => {
            setPlotWidth(window.innerWidth * 0.9);
            setPlotHeight(window.innerHeight * 0.4);
        };

        // update plot width when the window resizes
        window.addEventListener("resize", updatePlotSize);
        window.addEventListener("resize", updatePlotSize);

        // set the initial plot size
        updatePlotSize();

        // remove the event listener
        return () => {
            window.removeEventListener("resize", updatePlotSize);
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
                height={plotHeight}
                data={computedData}
            />
        </div>
    );
};

export default Stats;
