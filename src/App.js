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
import EventMarker from "react-timeseries-charts/lib/components/EventMarker";
import styler from "react-timeseries-charts/lib/js/styler";
import logo from './logo.svg';
import './App.css';


class DisplayData extends Component{
  render() {
    return (
      <div class="container-fluid">
        <div class="row">

          <div class="col">
            <div class="btn-group-vertical">
              <button type="button" class="btn btn-secondary">Dataset 1</button>
              <button type="button" class="btn btn-secondary">Dataset 2</button>
              <button type="button" class="btn btn-secondary">Dataset 3</button>
              <button type="button" class="btn btn-secondary">Dataset 4</button>
              <button type="button" class="btn btn-secondary">Dataset 5</button>
              <button type="button" class="btn btn-secondary">Dataset 6</button>
              <button type="button" class="btn btn-secondary">Dataset 7</button>
              <button type="button" class="btn btn-secondary">Dataset 8</button>
            </div>
          </div>

          <div class="col-4">
            Additional Data
          </div>

          <div class="col-6">
            <Chart response='4' type='Pressure'/>
          </div>

        </div>
      </div>
    );
  }
}

const NullMarker = props => {
    return <g />;
};

class Chart extends Component {
  constructor(props) {
    super(props);
    const temperaturePoints = [];
    const pressurePoints = [];
    const rpmPoints = [];
    var dataFile = require('./response/response' + props.response + '.json');
    for (let i = 0; i < dataFile.length; i++) {
        temperaturePoints.push([i, dataFile[i]['Temperature']]);
        pressurePoints.push([i, dataFile[i]['Pressure']]);
        rpmPoints.push([i, dataFile[i]['RPM']]);
    }
    const tempSeries = new TimeSeries({
      name: "Temperature",
      columns: ["time", "Temperature"],
      points: temperaturePoints
    });
    const pressureSeries = new TimeSeries({
        name: "Pressure",
        columns: ["time", "Pressure"],
        points: pressurePoints
    });
    const rpmSeries = new TimeSeries({
        name: "RPM",
        columns: ["time", "RPM"],
        points: rpmPoints
    });

    const scheme = {
        temp: "#CA4040",
        pressure: "#9467bd",
        rpm: "#987951",
    };

    const style = styler([
        { key: "temp", color: "#CA4040" },
        { key: "pressure", color: "#9467bd" },
        { key: "rpm", color: "#987951" },
    ]);

    this.state = {timerange: tempSeries.range(),
                  response: props.response,
                  tracker: null, x: null, y: null,
                  trackerValue: "-- °C",
                  trackerEvent: null,
                  markerMode: "flag",
                  tempSeries: tempSeries,
                  pressureSeries:pressureSeries,
                  rpmSeries: rpmSeries,
                  scheme: scheme,
                  style: style,
    };
  }

    render() {
      return (
        <div>
          <div className="row">
              <div className="col-md-12">
                  <Resizable>
                      <ChartContainer
                          utc={false}
                          timeRange={this.state.tempSeries.timerange()}
                          showGridPosition="under"
                          trackerPosition={this.state.tracker}
                          trackerTimeFormat="%X"
                          onTrackerChanged={tracker => this.setState({ tracker })}
                      >
                          <ChartRow height="150">
                              <YAxis
                                  id="pressure"
                                  label="Pressure (in)"
                                  labelOffset={5}
                                  min={this.state.pressureSeries.min("Pressure")}
                                  max={this.state.pressureSeries.max("Pressure")}
                                  width="80"
                                  type="linear"
                                  format=",.1f"
                              />
                              <Charts>
                                  <LineChart
                                      axis="pressure"
                                      series={this.state.pressureSeries}
                                      columns={["Pressure"]}
                                  />
                              </Charts>
                          </ChartRow>

                          <ChartRow height="150">
                              <YAxis
                                  id="temp"
                                  label="Temperature (C)"
                                  labelOffset={5}
                                  min={this.state.tempSeries.min("Temperature")}
                                  max={this.state.tempSeries.max("Temperature")}
                                  width="80"
                                  type="linear"
                                  format=",.1f"
                              />
                              <Charts>
                                  <LineChart
                                      axis="temp"
                                      series={this.state.tempSeries}
                                      columns={["Temperature"]}
                                      interpolation="curveStepBefore"
                                  />
                              </Charts>
                          </ChartRow>

                          <ChartRow height="150">
                              <YAxis
                                  id="rpm"
                                  label="RPM"
                                  labelOffset={5}
                                  min={this.state.rpmSeries.min("RPM")}
                                  max={this.state.rpmSeries.max("RPM")}
                                  width="80"
                                  type="linear"
                                  format=",.2f"
                              />
                              <Charts>
                                  <LineChart
                                      axis="rpm"
                                      series={this.state.rpmSeries}
                                      columns={["RPM"]}
                                  />
                              </Charts>
                          </ChartRow>
                      </ChartContainer>
                  </Resizable>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-right">
                <Legend
                    type="line"
                    align="right"
                    stack={true}
                    style={this.state.style}
                    categories={[
                        { key: "temp", label: "Temperature" },
                        { key: "pressure", label: "Pressure" },
                        { key: "rpm", label: "RPM" }
                    ]}
                />
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
        <DisplayData/>
      </div>
    );
  }
}

export default App;
