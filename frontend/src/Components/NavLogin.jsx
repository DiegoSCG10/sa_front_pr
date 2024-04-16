import React, { Component } from "react";
import { MenuItem, Menu } from "semantic-ui-react";
import "./Navs.css";

export default class MenuExampleBasic extends Component {
  render() {
    return (
      <Menu inverted className="Nav">
        <MenuItem href="/">Login</MenuItem>
        <MenuItem href="/PreguntasFrecuentes">Bases de Conocimiento</MenuItem>
      </Menu>
    );
  }
}
