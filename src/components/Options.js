import React, { Component } from "react";

class Options extends Component {
  state = {};

  highlightSort = value => {
    if (this.props.options.sort === value) {
      return "buttonSort highlighted";
    } else {
      return "buttonSort notHighlighted";
    }
  };

  highlightLevel = value => {
    if (this.props.options.highestLevel === value) {
      return "buttonSort highlighted";
    } else {
      return "buttonSort notHighlighted";
    }
  };

  highlightToggle = opt => {
    if (opt) {
      return "buttonSort highlighted";
    } else {
      return "buttonSort notHighlighted";
    }
  };

  render() {
    return (
      <div className="Options">
        <div className="Box-Wide">
          <div className="Box-Wide-Div">
            ATK:
            <input
              type="number"
              min="0"
              max="15"
              value={this.props.options.atkiv}
              onChange={this.props.onAtkChanged}
            ></input>
            <input className="invis" type="checkbox"></input>
          </div>
          <div className="Box-Wide-Div">
            DEF:
            <input
              type="number"
              min="0"
              max="15"
              value={this.props.options.defiv}
              onChange={this.props.onDefChanged}
            ></input>
            <input className="invis" type="checkbox"></input>
          </div>
          <div className="Box-Wide-Div">
            STA:
            <input
              type="number"
              min="0"
              max="15"
              value={this.props.options.staiv}
              onChange={this.props.onStaChanged}
            ></input>
            <input className="invis" type="checkbox"></input>
          </div>
          <div className="Box-Wide-Div">
            Show Lvl 35.5-40{" "}
            <input
              className="CheckBox"
              type="checkbox"
              onChange={this.props.toggleShowAllLevels}
            ></input>
          </div>
          <div className="Box-Wide-Div">
            Show Half Lvls{" "}
            <input
              className="CheckBox"
              type="checkbox"
              onChange={this.props.toggleShowHalfLvls}
            ></input>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;
