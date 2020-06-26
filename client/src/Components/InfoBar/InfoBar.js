import React from "react";

import "./InfoBar.css";

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <span className="onlineIcon">&bull;</span>
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/" className="closeIcon">
        &times;
      </a>
    </div>
  </div>
);

export default InfoBar;
