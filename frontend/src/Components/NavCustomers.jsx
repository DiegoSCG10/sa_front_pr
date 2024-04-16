import React, { Component } from "react";
import { MenuItem, Menu } from "semantic-ui-react";
import "./Navs.css";

export default class MenuExampleBasic extends Component {
  render() {
    return (
      <Menu inverted className="Nav">
        {/*<MenuItem href="EditProfile">Editar Perfil</MenuItem>*/}
        <MenuItem href="CreateTickets">Crear Tickets</MenuItem>
        <MenuItem href="FollowTickets">Estado de Tickets</MenuItem>

        <MenuItem className="ml-auto" href="/">
          Cerrar Sesión
        </MenuItem>
      </Menu>
    );
  }
}
