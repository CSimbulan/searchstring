import React, { Component } from "react";
import released_gen5 from "../data/released_gen5";

class Output extends Component {
  state = {};

  getName = () => {
    let header = "";
    if (this.props.selected) {
      header += "#";
    }

    return (
      header +
      this.props.selected_number.slice(0, 3) +
      " " +
      this.props.selected
    );
  };

  getImageClass = () => {
    if (this.props.selected) {
      return "Image";
    } else {
      return "ImageHide";
    }
  };

  getPkmnImagePath = shiny => {
    if (this.props.selected === "") {
      return "";
    }
    let dexNumber = this.props.selected_number;
    if (
      released_gen5.includes(dexNumber.slice(0, 3)) ||
      parseInt(dexNumber.slice(0, 3)) < 494 ||
      parseInt(dexNumber.slice(0, 3)) > 800
    ) {
      if (dexNumber.length === 3) {
        dexNumber += "_00";
      }
      if (shiny) {
        dexNumber += "_shiny";
      }
      let returnString =
        process.env.PUBLIC_URL +
        "/pokemon_icons/pokemon_icon_" +
        dexNumber +
        ".png";
      return returnString;
    } else {
      var path = !shiny ? "normal" : "shiny";
      return (
        "https://img.pokemondb.net/sprites/x-y/" +
        path +
        "/" +
        this.props.selected.toLowerCase() +
        ".png"
      );
    }
  };

  getPkmnBackupImage = shiny => {
    return process.env.PUBLIC_URL + "/pokemon_icons/pokemon_icon_000.png";
  };

  getTypeImagePath = type => {
    if (this.props.selected === "") {
      return "";
    }

    return (
      process.env.PUBLIC_URL + "/type_icons/Badge_Type_" + type + "_01.png"
    );
  };

  getWeatherImagePath = weather => {
    if (this.props.selected === "") {
      return "";
    }

    return (
      process.env.PUBLIC_URL +
      "/weather_icons/weatherIcon_small_" +
      weather +
      ".png"
    );
  };

  render() {
    return (
      <div className="Output">
        <h1>{this.getName()}</h1>
        <div className={this.getImageClass()}>
          <div className="Block" id="BlockLeft">
            <span className="BlockLeftHeader">Base Stats</span>
            <hr />
            Attack: {this.props.selected_stats[0]}
            <br />
            Defense: {this.props.selected_stats[1]}
            <br />
            Stamina: {this.props.selected_stats[2]}
          </div>
          <div className="Block">
            <img
              src={this.getPkmnImagePath(false)}
              alt=""
              onError={e => {
                e.target.onerror = null;
                e.target.src = this.getPkmnBackupImage(false);
              }}
            />
          </div>
          <div className="Block">
            <img
              src={this.getPkmnImagePath(true)}
              alt=""
              onError={e => {
                e.target.onerror = null;
                e.target.src = this.getPkmnBackupImage(true);
              }}
            />
          </div>
          <div className="Block" id="BlockRight">
            <strong>
              <i>
                <u>Typing:</u>
              </i>
            </strong>
            <br />
            {this.props.typing.map(type => (
              <img
                className="TypeIcon"
                src={this.getTypeImagePath(type)}
                alt={type}
                key={type}
              />
            ))}
            <br />

            <strong>
              <i>
                <u>Weather Boosts:</u>
              </i>
            </strong>
            <br />
            {this.props.weather.map(weather => (
              <img
                className="TypeIcon"
                src={this.getWeatherImagePath(weather)}
                alt={weather}
                key={weather}
              />
            ))}
          </div>
        </div>
        <br />
        <div className="OutputText">
          <span>{this.props.cpArray}</span>
        </div>
      </div>
    );
  }
}

export default Output;
