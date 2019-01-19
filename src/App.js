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
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRight)

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">IITHCK02</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Visualize <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Realtime</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

class DisplayData extends Component{
  constructor(props){
    super(props);
    this.state = {dataset: 1}
  }

  render() {
    console.log(this.state.dataset)
    const temperaturePoints = [];
    const pressurePoints = [];
    const rpmPoints = [];
    var dataFile = require('./response/response' + this.state.dataset + '.json');
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

    return (
      <div className="row">
        <div className="col-2">
          <div className = "row">
            <div className="btn-group-vertical col-12 rounded-0">
              <button type="button" className="btn btn-dark btn-lg btn-block rounded-0" onClick={() => this.setState({dataset: 1})}>Dataset 1{(this.state.dataset==1) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 2})}>Dataset 2{(this.state.dataset==2) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 3})}>Dataset 3{(this.state.dataset==3) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 4})}>Dataset 4{(this.state.dataset==4) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 5})}>Dataset 5{(this.state.dataset==5) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 6})}>Dataset 6{(this.state.dataset==6) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 7})}>Dataset 7{(this.state.dataset==7) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 8})}>Dataset 8{(this.state.dataset==8) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block" onClick={() => this.setState({dataset: 9})}>Dataset 9{(this.state.dataset==9) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
              <button type="button" className="btn btn-dark btn-lg btn-block rounded-0" onClick={() => this.setState({dataset: 10})}>Dataset 10{(this.state.dataset==10) ? <FontAwesomeIcon icon={faArrowRight} pull="right"/> : ""}</button>
            </div>
          </div>
        </div>

        <div className="col-3">
          <Additional tempSeries={tempSeries} pressureSeries={pressureSeries} rpmSeries={rpmSeries}/>
        </div>

        <div className="col-7">
          <br/>
          <Chart tempSeries={tempSeries} pressureSeries={pressureSeries} rpmSeries={rpmSeries}/>
        </div>

      </div>
    );
  }
}

class Chart extends Component {
  constructor(props) {
    super(props);
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

    this.state = {tracker: null, x: null, y: null,
                  trackerValue: "-- °C",
                  trackerEvent: null,
                  markerMode: "flag",
                  tempSeries: props.tempSeries,
                  pressureSeries: props.pressureSeries,
                  rpmSeries: props.rpmSeries,
                  scheme: scheme,
                  style: style,
    };
  }
  componentWillReceiveProps(props) {
    this.setState({tempSeries: props.tempSeries,
                   pressureSeries:props.pressureSeries,
                   rpmSeries: props.rpmSeries})
  }
  render() {
    return (
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
    );
  }
}

class Additional extends Component{
  constructor(props) {
    super(props);
    this.state = {tempSeries: props.tempSeries,
                  pressureSeries: props.pressureSeries,
                  rpmSeries: props.rpmSeries}
  }

  render() {
    return(
      <h4> Pressure </h4>
    );
  }

}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <DisplayData/>
      </div>
    );
  }
}

export default App;
