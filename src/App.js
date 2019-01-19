import React, { Component } from 'react';
import _ from "underscore";
import { format } from "d3-format";
import { TimeSeries , TimeEvent } from 'pondjs';
import ChartContainer from "react-timeseries-charts/lib/components/ChartContainer";
import ChartRow from "react-timeseries-charts/lib/components/ChartRow";
import Charts from "react-timeseries-charts/lib/components/Charts";
import YAxis from "react-timeseries-charts/lib/components/YAxis";
import LineChart from "react-timeseries-charts/lib/components/LineChart";
import Baseline from "react-timeseries-charts/lib/components/Baseline";
import Legend from "react-timeseries-charts/lib/components/Legend";
import Resizable from "react-timeseries-charts/lib/components/Resizable";
import styler from "react-timeseries-charts/lib/js/styler";
import logo from './logo.svg';
import './App.css';


function buildPoints(num) {
  var dataFile = require('./response/response' + num + '.json');
    let points = [];
    for (let i = 0; i < dataFile.length; i++) {
        points.push([i, dataFile[i]['Pressure'], dataFile[i]['RPM'], dataFile[i]['Temperature']]);
    }
    return points;
}

const series= [];

series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(1)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(2)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(3)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(4)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(5)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(6)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(7)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(8)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(9)
}));
series.push(new TimeSeries({
    name: "DrillData",
    columns: ["time", "Pressure", "RPM", "Temperature"],
    points: buildPoints(10)
}));

const style = styler([
    { key: "Pressure", color: "steelblue", width: 2 },
    { key: "RPM", color: "#F68B24", width: 2 },
    { key: "Temperature", color: "#668B24", width: 2 }
]);


class CrossHairs extends React.Component {
    render() {
        const { x, y } = this.props;
        const style = { pointerEvents: "none", stroke: "#ccc" };
        if (!_.isNull(x) && !_.isNull(y)) {
            return (
                <g>
                    <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                    <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
                </g>
            );
        } else {
            return <g />;
        }
    }
}

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {timerange: series[props.response].range(), response: props.response, type: props.type,
                  tracker: null, x: null, y: null
    };
  }

  handleTrackerChanged = tracker => {
      if (!tracker) {
          this.setState({ tracker, x: null, y: null });
      } else {
          this.setState({ tracker });
      }
  };

  handleTimeRangeChange = timerange => {
      this.setState({ timerange });
  };

  handleMouseMove = (x, y) => {
      this.setState({ x, y });
};

  render() {
    const f = format("$,.2f");
    const range = this.state.timerange;
    let PressureValue, RPMValue, TempValue;
    if (this.state.tracker) {
        const index = series[this.state.response].bisect(this.state.tracker);
        const trackerEvent = series[this.state.response].at(index);
        PressureValue = `${f(trackerEvent.get("Pressure"))}`;
        RPMValue = `${f(trackerEvent.get("RPM"))}`;
        TempValue = `${f(trackerEvent.get("Temperature"))}`;
      }

    return (
      <div>
        <div className="row">
            <div className="col-md-12">
                <Resizable>
                    <ChartContainer
                        timeRange={range}
                        timeAxisStyle={{
                            ticks: {
                                stroke: "#AAA",
                                opacity: 0.25,
                                "stroke-dasharray": "1,1"
                                // Note: this isn't in camel case because this is
                                // passed into d3's style
                            },
                            values: {
                                fill: "#AAA",
                                "font-size": 12
                            }
                        }}
                        showGrid={true}
                        paddingRight={100}
                        maxTime={series[this.state.response].range().end()}
                        minTime={series[this.state.response].range().begin()}
                        timeAxisAngledLabels={true}
                        timeAxisHeight={65}
                        onTrackerChanged={this.handleTrackerChanged}
                        onBackgroundClick={() => this.setState({ selection: null })}
                        enablePanZoom={true}
                        onTimeRangeChanged={this.handleTimeRangeChange}
                        onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                        minDuration={1}
                    >
                        <ChartRow height="400">
                            <YAxis
                                id="y"
                                label="Units"
                                min={0}
                                max={100}
                                style={{
                                    ticks: {
                                        stroke: "#AAA",
                                        opacity: 0.25,
                                        "stroke-dasharray": "1,1"
                                        // Note: this isn't in camel case because this is
                                        // passed into d3's style
                                    }
                                }}
                                showGrid
                                hideAxisLine
                                width="60"
                                type="linear"
                                format="$,.2f"
                            />
                            <Charts>
                                <LineChart
                                    axis="y"
                                    breakLine={false}
                                    series={series[this.state.response]}
                                    columns={["Pressure", "RPM", "Temperature"]}
                                    style={style}
                                    interpolation="curveBasis"
                                    highlight={this.state.highlight}
                                    onHighlightChange={highlight =>
                                        this.setState({ highlight })
                                    }
                                    selection={this.state.selection}
                                    onSelectionChange={selection =>
                                        this.setState({ selection })
                                    }
                                />
                                <CrossHairs x={this.state.x} y={this.state.y} />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <span>
                    <Legend
                        type="line"
                        align="right"
                        style={style}
                        highlight={this.state.highlight}
                        onHighlightChange={highlight => this.setState({ highlight })}
                        selection={this.state.selection}
                        onSelectionChange={selection => this.setState({ selection })}
                        categories={[
                            { key: "Pressure", label: "Pressure", value: PressureValue },
                            { key: "RPM", label: "RPM", value: RPMValue },
                            { key: "Temperature", label: "Temperature", value: TempValue }
                        ]}
                    />
                </span>
            </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chart response='4' type='Pressure'/>
        <Chart response='5' type='Pressure'/>
        <Chart response='6' type='Pressure'/>
      </div>
    );
  }
}

export default App;
