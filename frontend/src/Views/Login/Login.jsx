import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Segment, Label } from "semantic-ui-react";
import "./Login.css";
import { SHA256 } from "crypto-js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ruta from "../../Ruta.js";
import NavLogin from "../../Components/NavLogin";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = () => {
    document.getElementById("UsuarioValido").style.visibility = "hidden";
    document.getElementById("UsuarioValido").style.display = "none";

    if (username === "") {
      document.getElementById("UsuarioValido").innerHTML =
        "Ingrese un nombre de usuario";
      document.getElementById("UsuarioValido").style.visibility = "visible";
      return;
    } else if (password === "") {
      document.getElementById("UsuarioValido").innerHTML =
        "Ingrese una contraseña";
      document.getElementById("UsuarioValido").style.visibility = "visible";
      return;
    }

    const contraSHA = SHA256(password).toString();
    const campos = {
      correo: username,
      contra: contraSHA,
    };

    axios
      .post(
        "http://" + ruta.ip + ":" + ruta.port + "/api/usuarios/login",
        JSON.stringify(campos),
        { headers: { "Content-Type": "application/json; charset=UTF-8" } }
      )
      .then((response) => {
        if (response.data.error === true) {
          document.getElementById("UsuarioValido").innerHTML =
            response.data.salida.toUpperCase();
          document.getElementById("UsuarioValido").style.visibility = "visible";
          document.getElementById("UsuarioValido").style.display = "block";
          return;
        } else {
          const infoToken = jwtDecode(response.data.salida);
          localStorage.setItem("inf", response.data.salida);
          if (infoToken.role === 1) {
            window.location.href = "CreateTickets";
          } else if (infoToken.role === 2) {
            window.location.href = "FollowTicketsAgents";
          } else if (infoToken.role === 3) {
            window.location.href = "Users";
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function Obtener() {
    useEffect(() => {
      if (
        localStorage.getItem("token") !== null ||
        localStorage.getItem("token") !== undefined
      ) {
        localStorage.removeItem("token");
      }
    }, []);
  }

  return (
    Obtener(),
    (
      <>
        <NavLogin />
        <div className="login">
          <Grid textAlign="center" style={{ marginTop: "10%" }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" inverted textAlign="center">
                ¡INICIA SESIÓN EN DC-TICKETS!
              </Header>
              <Form size="large">
                <Segment stacked>
                  <Form.Input fluid icon="user" iconPosition="left" placeholder="Usuario" value={username} onChange={handleUsernameChange} />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Contraseña" type="password" value={password} onChange={handlePasswordChange} />
                  <Button color="teal" fluid size="large" onClick={handleLoginClick} >
                    Iniciar Sesión
                  </Button>
                  <Label pointing prompt color="red" id="UsuarioValido" className="Alerta" style={{ visibility: "hidden", display: "none" }} ></Label>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </>
    )
  );
}

export default Login;
