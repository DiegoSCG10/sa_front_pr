import React, { Component } from "react";
import { MenuItem, Menu, Dropdown } from "semantic-ui-react";
import "./Navs.css";

export default class MenuExampleBasic extends Component {
  render() {
    return (
      <Menu inverted className="Nav">
        <MenuItem href="/Users">Gestionar Usuarios</MenuItem>
        {/* <MenuItem href="/Configure">Configurar Sistema</MenuItem> */}
        <Dropdown item text="Generar Reportes">
          <Dropdown.Menu >
            <Dropdown.Item href="/Reports/General" >Reporte General</Dropdown.Item>
            <Dropdown.Item href="/Reports/Usuario">Reporte de Usuario</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <MenuItem href="/Register">Agregar Usuario</MenuItem>
        <MenuItem className="ml-auto " href="/">
          Cerrar Sesión
        </MenuItem>
      </Menu>
    );
  }
}