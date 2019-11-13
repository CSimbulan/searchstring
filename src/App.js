import React, { Component } from "react";
import "./template.css";
import "./App.css";
import Instructions from "./components/Instructions";
import AutoCompleteSearch from "./components/AutoCompleteSearch";
import Options from "./components/Options";
import Output from "./components/Output";
import PageFooter from "./components/PageFooter";
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
      trashString: "",
      statsArray: [],
      typing: [],
      counters: [],
      resistances: [],
      weather: []
    },
    options: {
      id: "options",
      toggle: { showHalfLvls: false },
      cpfilter: false,
      filtervalue: "",
      atkiv: 15,
      defiv: 15,
      staiv: 15,
      maxatkiv: 15,
      maxdefiv: 15,
      maxstaiv: 15,
      minpercentage: 0,
      maxpercentage: 0,
      stars: "",
      ivtype: "specific",
      minlevel: 1,
      maxlevel: 35
    },
    version_number: "1.1.0"
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

  calculatePercentage = (a, d, s) => {
    return (a + d + s) / 45.0;
  };

  determineStars = percent => {
    switch (true) {
      case percent < 0.49:
        return 0;
      case percent < 0.65:
        return 1;
      case percent < 0.82:
        return 2;
      case percent < 1:
        return 3;
      case percent === 1:
        return 4;
      default:
        return "";
    }
  };

  getCPLoop = () => {
    var minatkiv = this.state.options.atkiv;
    var mindefiv = this.state.options.defiv;
    var minstaiv = this.state.options.staiv;
    var maxatkiv = this.state.options.maxatkiv;
    var maxdefiv = this.state.options.maxdefiv;
    var maxstaiv = this.state.options.maxstaiv;
    var minpercentage = this.calculatePercentage(minatkiv, mindefiv, minstaiv);
    var maxpercentage = this.calculatePercentage(maxatkiv, maxdefiv, maxstaiv);
    var minstars = this.determineStars(minpercentage);
    var maxstars = this.determineStars(maxpercentage);
    var MINLEVEL = this.state.options.minlevel;
    var MAXLEVEL = this.state.options.maxlevel;
    var start = this.state.search.selected_number.split("_")[0] + "&";
    for (var i = minstars; i <= maxstars; i++) {
      start += i + "*";
      if (i < maxstars) {
        start += ",";
      }
    }
    var cps = [];
    var hps = [];
    var trash = this.state.search.selected_number.split("_")[0];
    var atk = parseInt(this.state.search.selectedStats[0]);
    var def = parseInt(this.state.search.selectedStats[1]);
    var sta = parseInt(this.state.search.selectedStats[2]);
    var step = 1;
    var tempcp = 0;
    var temphp = 0;
    if (this.state.options.toggle.showHalfLvls) {
      step -= 0.5;
    }
    if (this.state.options.toggle.show36plus) {
      MAXLEVEL = 40;
    }
    for (i = MINLEVEL; i <= MAXLEVEL; i += step) {
      for (var a = minatkiv; a <= maxatkiv; a++) {
        for (var d = mindefiv; d <= maxdefiv; d++) {
          for (var s = minstaiv; s <= maxstaiv; s++) {
            tempcp = Math.max(
              this.calculateCP(atk + a, def + d, sta + s, i),
              10
            );
            temphp = Math.floor((sta + s) * this.getCPM(i));
            if (!cps.includes(tempcp)) {
              cps.push(tempcp);
            }
            if (!hps.includes(temphp)) {
              hps.push(temphp);
            }
          }
        }
      }
    }
    cps = cps.sort(function(a, b) {
      return a - b;
    });
    hps = hps.sort(function(a, b) {
      return a - b;
    });
    start += "&";
    trash += "&";
    for (i = 0; i < cps.length; i++) {
      if (!cps.includes(cps[i] - 1)) {
        start += "cp" + cps[i];
        trash += "!cp" + cps[i];
      } else {
        if (!cps.includes(cps[i] + 1)) {
          start += "-" + cps[i];
          trash += "-" + cps[i];
        }
      }

      if (i < cps.length - 1 && !cps.includes(cps[i] + 1)) {
        start += ",";
        trash += "&";
      }
    }
    start += "&";
    for (i = 0; i < hps.length; i++) {
      if (!hps.includes(hps[i] - 1)) {
        start += "hp" + hps[i];
      } else {
        if (!hps.includes(hps[i] + 1)) {
          start += "-" + hps[i];
        }
      }

      if (i < hps.length - 1 && !hps.includes(hps[i] + 1)) {
        start += ",";
      }
    }
    const state = { ...this.state };
    state.search.cpArray = start;
    state.search.trashString = trash;
    state.options.minpercentage = minpercentage;
    state.options.maxpercentage = maxpercentage;
    state.options.minstars = minstars;
    state.options.maxstars = maxstars;
    this.setState(() => ({ state }));
  };

  onAtkChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.atkiv = value;
    if (state.options.ivtype === "specific") {
      state.options.maxatkiv = value;
    }
    this.setState(() => ({ state }));
    if (this.state.search.selected && !isNaN(value) && value <= 15) {
      this.getCPLoop();
    }
  };

  onDefChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.defiv = value;
    if (state.options.ivtype === "specific") {
      state.options.maxdefiv = value;
    }
    this.setState(() => ({ state }));
    if (this.state.search.selected && !isNaN(value) && value <= 15) {
      this.getCPLoop();
    }
  };

  onStaChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.staiv = value;
    if (state.options.ivtype === "specific") {
      state.options.maxstaiv = value;
    }
    this.setState(() => ({ state }));
    if (this.state.search.selected && !isNaN(value) && value <= 15) {
      this.getCPLoop();
    }
  };

  onMinLvlChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.minlevel = value;
    this.setState(() => ({ state }));
    if (this.state.search.selected && !isNaN(value) && value <= 40) {
      this.getCPLoop();
    }
  };

  onMaxAtkChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.maxatkiv = value;
    this.setState(() => ({ state }));
    if (
      this.state.search.selected &&
      !isNaN(value) &&
      value <= 15 &&
      value >= state.options.atkiv
    ) {
      this.getCPLoop();
    }
  };

  onMaxDefChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.maxdefiv = value;
    this.setState(() => ({ state }));
    if (
      this.state.search.selected &&
      !isNaN(value) &&
      value <= 15 &&
      value >= state.options.defiv
    ) {
      this.getCPLoop();
    }
  };

  onMaxStaChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.maxstaiv = value;
    this.setState(() => ({ state }));
    if (
      this.state.search.selected &&
      !isNaN(value) &&
      value <= 15 &&
      value >= state.options.staiv
    ) {
      this.getCPLoop();
    }
  };

  onMaxLvlChanged = e => {
    const value = parseInt(e.target.value);
    const state = { ...this.state };
    state.options.maxlevel = value;
    this.setState(() => ({ state }));
    if (
      this.state.search.selected &&
      !isNaN(value) &&
      value <= 40 &&
      value >= state.options.minlevel
    ) {
      this.getCPLoop();
    }
  };

  toggleShowHalfLvls = () => {
    const state = { ...this.state };
    state.options.toggle.showHalfLvls = !state.options.toggle.showHalfLvls;
    this.setState(() => ({ state }));
    if (this.state.search.selected) {
      this.getCPLoop();
    }
  };

  changeIVType = value => {
    const state = { ...this.state };
    state.options.ivtype = value;
    if (state.options.ivtype === "range") {
      state.options.maxatkiv = 15;
      state.options.maxdefiv = 15;
      state.options.maxstaiv = 15;
    } else {
      state.options.maxatkiv = state.options.atkiv;
      state.options.maxdefiv = state.options.defiv;
      state.options.maxstaiv = state.options.staiv;
    }

    this.setState(() => ({ state }));
    if (this.state.search.selected) {
      this.getCPLoop();
    }
  };

  reset = () => {
    this.setState(getinitialState());
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
          <Options
            options={this.state.options}
            onAtkChanged={this.onAtkChanged}
            onDefChanged={this.onDefChanged}
            onStaChanged={this.onStaChanged}
            onMaxAtkChanged={this.onMaxAtkChanged}
            onMaxDefChanged={this.onMaxDefChanged}
            onMaxStaChanged={this.onMaxStaChanged}
            onMinLvlChanged={this.onMinLvlChanged}
            onMaxLvlChanged={this.onMaxLvlChanged}
            toggleShowHalfLvls={this.toggleShowHalfLvls}
            changeIVType={value => this.changeIVType(value)}
          ></Options>
          <br />
          <Output
            cpArray={this.state.search.cpArray}
            trashString={this.state.search.trashString}
            options={this.state.options}
            stats={this.state.search.statsArray}
            selected={this.state.search.selected}
            selected_number={this.state.search.selected_number}
            selected_stats={this.state.search.selectedStats}
            typing={this.state.search.typing}
            counters={this.state.search.counters}
            resistances={this.state.search.resistances}
            weather={this.state.search.weather}
            onClickReset={this.reset}
          />
          <PageFooter version={this.state.version_number} />
        </div>
      </div>
    );
  }
}

export default App;
