import React, { Component } from "react";
import "./template.css";
import "./App.css";
import Instructions from "./components/Instructions";
import AutoCompleteSearch from "./components/AutoCompleteSearch";
import Options from "./components/Options";
import Output from "./components/Output";
import pokemondata from "./data/pokemondata";
import cpmultipliers from "./data/cpmultipliers";
import weatherBoosts from "./data/weatherBoosts";

function getinitialState() {
  return {
    data: {
      names: getNames(),
      cpm: cpmultipliers,
      stats: pokemondata
    },
    search: {
      selected: "",
      selected_number: "",
      suggestions: [],
      text: "",
      selectedStats: [],
      cpArray: [],
      statsArray: [],
      typing: [],
      counters: [],
      resistances: [],
      weather: []
    },
    options: {
      id: "options",
      sort: "cp",
      toggle: { nundo: true, lvl15: false, under90: false, color: true },
      cpfilter: false,
      filtervalue: "",
      highestLevel: 40
    },
    version_number: "1.0.0"
  };
}

function getNames() {
  const names = pokemondata.map(
    x => x.split(",")[0]
  ); /*Get first column from the data.*/
  const namesWithNumbers = pokemondata.map(
    x => x.split(",")[4].slice(0, 3) + " " + x.split(",")[0]
  );
  const namesWithNumbersNoZero = pokemondata.map(
    x => parseInt(x.split(",")[4].slice(0, 3)) + " " + x.split(",")[0]
  );
  const temp = namesWithNumbers.concat(namesWithNumbersNoZero.slice(0, 115));
  return names.concat(temp);
}

class App extends Component {
  state = getinitialState();

  onTextChanged = e => {
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.state.data.names.sort().filter(v => regex.test(v));
    }
    const state = { ...this.state };
    state.search.text = value;
    state.search.suggestions = suggestions;
    this.setState(() => ({ state }));
  };

  suggestionSelected = value => {
    const state = { ...this.state };
    state.search.text = value;
    state.search.suggestions = [];
    const test = value.split(" ");
    if (test.length > 1) {
      if (isNaN(test[0])) {
        state.search.selected = value;
      } else state.search.selected = test.slice(1).join(" ");
    } else state.search.selected = value;
    const data = this.state.data.stats;
    for (var i = 0; i < data.length; i++) {
      var split = data[i].split(",");
      var x = String(state.search.selected);
      if (split[0] === x) {
        state.search.selectedStats = split.slice(1, 4);
        state.search.selected_number = split[4];
        var types = [];
        types.push(split[5]);
        if (split[6] !== "None") {
          types.push(split[6]);
        }
        state.search.typing = types;
      }
    }
    this.setState(() => ({ state }));
    this.getWeather();
    this.getCPLoop();
  };

  getWeather = () => {
    const types = this.state.search.typing;
    var boosts = [];
    for (var i in types) {
      boosts.push(weatherBoosts[types[i]]);
    }
    boosts = boosts.filter(this.removeDuplicates);
    const state = { ...this.state };
    state.search.weather = boosts;
    this.setState(() => ({ state }));
  };

  renderSuggestions = () => {
    let state = { ...this.state };
    if (state.search.suggestions.length === 0) {
      return null;
    }
    /*
    if (state.search.suggestions.length > 5) {
      state.search.suggestions = state.search.suggestions.slice(0, 5);
    }*/
    return (
      <ul>
        {state.search.suggestions.map(item => (
          <li onClick={() => this.suggestionSelected(item)} key={item}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  clearSearch = () => {
    const state = { ...this.state };
    state.search.text = "";
    this.setState(() => ({ state }));
  };

  removeDuplicates = (item, index, inputArray) => {
    return inputArray.indexOf(item) === index;
  }; /*Remove duplicates*/

  calculateCP = (atk, def, sta, lvl) => {
    return Math.floor(
      (atk * Math.sqrt(def) * Math.sqrt(sta) * Math.pow(this.getCPM(lvl), 2)) /
        10
    );
  };

  getCPM = level => {
    var cpm = 0;
    const cpmArray = this.state.data.cpm;
    cpm = parseFloat(cpmArray[level * 2 - 2].split(",")[1]);
    return cpm;
  };

  getCPLoop = () => {
    var cps = [parseInt(this.state.search.selected_number)];
    var hps = [];
    var atk = parseInt(this.state.search.selectedStats[0]);
    var def = parseInt(this.state.search.selectedStats[1]);
    var sta = parseInt(this.state.search.selectedStats[2]);
    for (var i = 1; i <= 40; i += 0.5) {
      cps.push(
        "cp" + Math.max(this.calculateCP(atk + 15, def + 15, sta + 15, i), 10)
      );
      hps.push("hp" + Math.floor((sta + 15) * this.getCPM(i)));
    }
    cps = cps.concat(hps);
    const state = { ...this.state };
    state.search.cpArray = cps;
    this.setState(() => ({ state }));
  };

  render() {
    return (
      <div className="App">
        <div className="Container">
          <Instructions version={this.state.version_number} />
          <div className="AutoCompleteSearch">
            <AutoCompleteSearch
              items={this.state.data.names}
              search={this.state.search}
              onTextChanged={this.onTextChanged}
              renderSuggestions={this.renderSuggestions}
              clearSearch={this.clearSearch}
            />
            {this.renderSuggestions()}
          </div>
          <br />
          <Output
            cpArray={this.state.search.cpArray.join(",")}
            options={this.state.options}
            stats={this.state.search.statsArray}
            selected={this.state.search.selected}
            selected_number={this.state.search.selected_number}
            selected_stats={this.state.search.selectedStats}
            typing={this.state.search.typing}
            counters={this.state.search.counters}
            resistances={this.state.search.resistances}
            weather={this.state.search.weather}
          />
        </div>
      </div>
    );
  }
}

export default App;
