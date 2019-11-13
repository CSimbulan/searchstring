import React, { Component } from "react";

class Options extends Component {
  state = {};

  highlightToggle = opt => {
    if (opt) {
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

  highlightType = value => {
    if (this.props.options.ivtype === value) {
      return "buttonSort highlighted";
    } else {
      return "buttonSort notHighlighted";
    }
  };

  getEmoji = opt => {
    if (opt) {
      return (
        <span role="img" aria-label="check">
          ✔️
        </span>
      );
    } else {
      return (
        <span role="img" aria-label="x">
          ❌
        </span>
      );
    }
  };

  getMinIV = opt => {
    return String(opt);
  };

  getRangeClass = () => {
    /*
    if (this.props.options.ivtype === "range") {
      return "IVWrapper";
    } else {
      return "invis";
    }
    */
    if (this.props.options.ivtype === "range") {
      return (
        <div className="IVWrapper">
          <div className="Box-Wide-Div">
            <span className="OptionsText">Max ATK: </span>
            <input
              type="number"
              min={this.getMinIV(this.props.options.atkiv)}
              max="15"
              value={this.props.options.maxatkiv}
              onChange={this.props.onMaxAtkChanged}
            ></input>
          </div>
          <div className="Box-Wide-Div">
            <span className="OptionsText">Max DEF: </span>
            <input
              type="number"
              min={this.getMinIV(this.props.options.defiv)}
              max="15"
              value={this.props.options.maxdefiv}
              onChange={this.props.onMaxDefChanged}
            ></input>
          </div>
          <div className="Box-Wide-Div">
            <span className="OptionsText">Max STA: </span>
            <input
              type="number"
              min={this.getMinIV(this.props.options.staiv)}
              max="15"
              value={this.props.options.maxstaiv}
              onChange={this.props.onMaxStaChanged}
            ></input>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  getSpecificLabel = value => {
    var returnString = "";
    if (this.props.options.ivtype === "range") {
      returnString += "Min ";
    }
    returnString += value + ": ";
    return returnString;
  };

  render() {
    return (
      <div className="Options">
        <div className="OptionsWrapper">
          <div className="Box Larger">
            <div className="Box-Wide-Div">
              <h3>IV Type:</h3>
            </div>
            <div className="Box-Wide-Div">
              <button
                className={this.highlightType("specific")}
                onClick={() => this.props.changeIVType("specific")}
              >
                SPECIFIC
              </button>
            </div>
            <div className="Box-Wide-Div">
              <button
                className={this.highlightType("range")}
                onClick={() => this.props.changeIVType("range")}
              >
                RANGE
              </button>
            </div>
          </div>

          <div className="Box Smaller">
            <div className="Box-Wide-Div">
              <h3>Levels:</h3>
            </div>

            <div className="Box-Wide-Div">
              <span className="OptionsText">Min:</span>
              <input
                type="number"
                min="1"
                max="40"
                value={this.props.options.minlevel}
                onChange={this.props.onMinLvlChanged}
              ></input>
            </div>
            <div className="Box-Wide-Div">
              <span className="OptionsText">Max:</span>
              <input
                type="number"
                min={this.props.options.minlevel}
                max="40"
                value={this.props.options.maxlevel}
                onChange={this.props.onMaxLvlChanged}
              ></input>
            </div>
            <div className="Box-Wide-Div">
              <button
                className={this.highlightToggle(
                  this.props.options.toggle.showHalfLvls
                )}
                onClick={this.props.toggleShowHalfLvls}
              >
                Half Lvls{" "}
                {this.getEmoji(this.props.options.toggle.showHalfLvls)}
              </button>
            </div>
          </div>
        </div>

        <br></br>
        <div className="Box-Wide">
          <div className="IVWrapper">
            <div className="Box-Wide-Div">
              <span className="OptionsText">
                {this.getSpecificLabel("ATK")}
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={this.props.options.atkiv}
                onChange={this.props.onAtkChanged}
              ></input>
            </div>
            <div className="Box-Wide-Div">
              <span className="OptionsText">
                {this.getSpecificLabel("DEF")}
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={this.props.options.defiv}
                onChange={this.props.onDefChanged}
              ></input>
            </div>
            <div className="Box-Wide-Div">
              <span className="OptionsText">
                {this.getSpecificLabel("STA")}
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={this.props.options.staiv}
                onChange={this.props.onStaChanged}
              ></input>
            </div>
          </div>
          {this.getRangeClass()}
        </div>
      </div>
    );
  }
}

export default Options;
