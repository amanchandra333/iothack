import React, { Component } from 'react';
import { format } from "d3-format";
import { TimeSeries } from 'pondjs';
import ChartContainer from "react-timeseries-charts/lib/components/ChartContainer";
import ChartRow from "react-timeseries-charts/lib/components/ChartRow";
import Charts from "react-timeseries-charts/lib/components/Charts";
import LineChart from "react-timeseries-charts/lib/components/LineChart";
import Resizable from "react-timeseries-charts/lib/components/Resizable";
import ValueAxis from "react-timeseries-charts/lib/components/ValueAxis";
import LabelAxis from "react-timeseries-charts/lib/components/LabelAxis";
import styler from "react-timeseries-charts/lib/js/styler";
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
    const temperaturePoints = [];
    const pressurePoints = [];
    const rpmPoints = [];
    var dataFile = require('./response/response' + this.state.dataset + '.json');
    for (let i = 0; i < dataFile.length; i++) {
        temperaturePoints.push([i, dataFile[i]['Temperature']]);
        pressurePoints.push([i, dataFile[i]['Pressure']]);
        rpmPoints.push([i, dataFile[i]['RPM']]);
    }
    const temperatureSeries = new TimeSeries({
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

        {/* <div className="col-3">
          <Additional temperatureSeries={temperatureSeries} pressureSeries={pressureSeries} rpmSeries={rpmSeries}/>
        </div> */}

        <div className="col-7">
          <br/>
          <Chart temperatureSeries={temperatureSeries} pressureSeries={pressureSeries} rpmSeries={rpmSeries}/>
        </div>

      </div>
    );
  }
}

class Chart extends Component {
  constructor(props) {
    super(props);

    // Storage for all the data channels
    const channels = {
        RPM: { units: "rpm", label: "RPM", format: "d", series: props.rpmSeries, show: true },
        Temperature: { units: "deg C", label: "Temp", format: "d", series: props.temperatureSeries, show: true },
        Pressure: { units: "Pa", label: "Pressure", format: ",.1f", series: props.pressureSeries, show: true }
    };

    // Channel names list, in order we want them shown
    const channelNames = ["Temperature", "Pressure", "RPM"];

    // Channels we'll actually display on our charts
    const displayChannels = ["Temperature", "Pressure", "RPM"];

    this.state = {
        ready: false,
        channels,
        channelNames,
        displayChannels,
        tracker: null,
        timerange: props.temperatureSeries.timerange()
    };
  }
  componentDidMount() {
    setTimeout(() => {
        const { channelNames, channels, displayChannels} = this.state;
        // Make the TimeSeries here from the points collected above
        for (let channelName of channelNames) {
            channels[channelName].avg = parseInt(channels[channelName].series.avg(channelName), 10);
            channels[channelName].max = parseInt(channels[channelName].series.max(channelName), 10);
            channels[channelName].min = parseInt(channels[channelName].series.max(channelName), 10);
        }
        this.setState({ ready: true, channels});
    }, 0);
  }

  componentWillReceiveProps(props) {
    const {channels, channelNames} = this.state
    channels.Temperature.series = props.temperatureSeries;
    channels.Pressure.series = props.pressureSeries;
    channels.RPM.series = props.rpmSeries;
    for (let channelName of channelNames) {
      channels[channelName].avg = parseInt(channels[channelName].series.avg(channelName), 10);
      channels[channelName].max = parseInt(channels[channelName].series.max(channelName), 10);
      channels[channelName].max = parseInt(channels[channelName].series.min(channelName), 10);
  }
    this.setState({channels})
  }

  handleTrackerChanged = t => {
    this.setState({ tracker: t });
  };

  handleChartResize = width => {
      this.setState({ width });
  };

  renderChart = () => {
      return this.renderChannelsChart();
  };

  renderChannelsChart = () => {
      const { timerange, displayChannels, channels, maxTime, minTime, minDuration } = this.state;
      const style = styler([
        { key: "Temperature", color: "#ff47ff" },
        { key: "Pressure", color: "green", width: 1, opacity: 0.5 },
        { key: "RPM", color: "steelblue", width: 1, opacity: 0.5 }
      ]);
      const speedFormat = format(".1f");
      const rows = [];

      for (let channelName of displayChannels) {
          const charts = [];
          let series = channels[channelName].series;
          charts.push(
              <LineChart
                  key={`line-${channelName}`}
                  axis={`${channelName}_axis`}
                  series={series}
                  columns={[channelName]}
                  style={style}
                  breakLine
              />
          );

          // Get the value at the current tracker position for the ValueAxis
          let value = "--";
          if (this.state.tracker) {
              const approx =
                  (+this.state.tracker - +timerange.begin()) /
                  (+timerange.end() - +timerange.begin());
              const ii = Math.floor(approx * series.size());
              const i = series.bisect(new Date(this.state.tracker), ii);
              const v = i < series.size() ? series.at(i).get(channelName) : null;
              if (v) {
                  value = parseInt(v, 10);
              }
          }

          // Get the summary values for the LabelAxis
          const summary = [
              { label: "Max", value: speedFormat(channels[channelName].max) },
              { label: "Avg", value: speedFormat(channels[channelName].avg) }
          ];
          rows.push(
              <ChartRow
                  height="120"
                  visible={channels[channelName].show}
                  key={`row-${channelName}`}
              >
                  <LabelAxis
                      id={`${channelName}_axis`}
                      label={channels[channelName].label}
                      values={summary}
                      min={0}
                      max={channels[channelName].max}
                      width={130}
                      type="linear"
                      format=",.1f"
                  />
                  <Charts>{charts}</Charts>
                  <ValueAxis
                      id={`${channelName}_valueaxis`}
                      value={value}
                      detail={channels[channelName].units}
                      width={80}
                      min={0}
                      max={35}
                  />
              </ChartRow>
          );
      }

      return (
          <ChartContainer
              timeRange={this.state.timerange}
              format="relative"
              showGrid={false}
              enablePanZoom
              trackerPosition={this.state.tracker}
              onChartResize={width => this.handleChartResize(width)}
              onTrackerChanged={this.handleTrackerChanged}
          >
              {rows}
          </ChartContainer>
      );
  };


  render() {
    const { ready, channels, displayChannels } = this.state;
        if (!ready) {
            return <div>{`Building rollups...`}</div>;
        }
        const chartStyle = {
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDD",
            paddingTop: 10,
            marginBottom: 10
        };
        // Generate the legend
        const legend = displayChannels.map(channelName => ({
            key: channelName,
            label: channels[channelName].label,
            disabled: !channels[channelName].show
        }));

        return (
            <div>
                <div className="row">
                    <div className="col-md-12" style={chartStyle}>
                        <Resizable>
                            {ready ? this.renderChart() : <div>Loading.....</div>}
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

class Additional extends Component{
  constructor(props) {
    super(props);
    this.state = {temperatureSeries: props.temperatureSeries,
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
