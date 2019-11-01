import React, { Component } from "react";
import banner from "../searchstring_banner.png";
import Popup from "reactjs-popup";

class PageHeader extends Component {
  state = {};
  render() {
    return (
      <div>
        <img src={banner} alt="Pokémon Search String Generator" />
        <div className="Header">
          <div className="Instructions">
            <p>
              <strong>How it works:</strong> Start typing a Pokémon (species
              name or number) in the text box below. Select the Pokémon you want
              to generate a table for from the drop down box. Choose the IVs
              that you want to search for. You can check the boxes if you want
              to include the search for levels 35.5+ and half levels. The first
              output box has the string for the Pokémon with potentially the IVs
              you want (additional appraisal required), and the second output
              box has the string for those that cannot have those IVs. Copy and
              paste the string into the Pokémon search bar in the game.
            </p>
            Click on this button for a more detailed user manual:{"     "}
            <Popup
              trigger={<button className="buttonManual">User Manual</button>}
              modal
            >
              {close => (
                <div className="modal">
                  <span className="close" onClick={close}>
                    &times;
                  </span>
                  <div className="header">
                    <h1>
                      Pokémon GO Search String Generator Ver{" "}
                      {this.props.version}
                    </h1>
                  </div>
                  <div className="content">
                    <br />
                    This app lets you create search strings for any Pokémon with
                    specific IVs.
                    <br />
                    To use it, start typing a Pokémon species or number in the
                    text bar. A dropdown menu will appear allowing you to select
                    a species.
                    <br />
                    The strings will automatically be generated. You can choose
                    the following settings:
                    <br />
                    <h2>ATK/DEF/STA IVs</h2>
                    Set the specific IVs you want to search for.
                    <h2>Show Lvls 35.5-40</h2>
                    Check this box if you want to include Pokémon from levels
                    35.5 to 40 in the search. This is unchecked by default. Note
                    that Pokémon do not spawn in the wild past level 35 so this
                    is only for powered up Pokémon.
                    <h2>Show Half Lvls</h2>
                    Check this box if you want to include Pokémon with half
                    levels in the search. Note that Pokémon do not spawn with
                    half levels in the wild so this is only for powered up
                    Pokémon.
                    <h1>First Output Box</h1>
                    This box will show the string used to search for the desired
                    Pokémon with the specified IVs. Note that the search will
                    yield Pokémon that POTENTIALLY have those IVs; the CP and HP
                    value will match. Additional appraisal may be necessary to
                    confirm it does have the desired IVs.
                    <h1>Trash Strings</h1>
                    This box will show the string used to search for the desired
                    Pokémon but with every IV combination other than the
                    specified one. This is used to search for all of the desired
                    Pokémon that you may want to transfer. For example, you
                    specify that you want to search for a 15/15/15 (ATK/DEF/STA)
                    Pokémon, the first output box will give a string that
                    searches for the 15/15/15 Pokémon, and the trash string will
                    search for everything else. HP is not required in the string
                    because the CP not matching is sufficient information.
                    <h2>Reset Button</h2>
                    Clears the table and resets all settings to default.
                  </div>
                  <div className="actions">
                    <button
                      className="buttonManual"
                      onClick={() => {
                        close();
                      }}
                    >
                      Got It!
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <h1>Select a Pokémon:</h1>
        </div>
      </div>
    );
  }
}

export default PageHeader;
