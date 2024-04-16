import React, { useState } from "react";
import { Grid, Header, Form, Segment, Button, Message, Label, } from "semantic-ui-react";
import { SHA256 } from "crypto-js";
import axios from "axios";
import ruta from "../../Ruta";
import Navbar from '../../Components/NavAdmin';
import './Admin.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    document.getElementById("alerta").style.visibility = "hidden";
    document.getElementById("alerta").style.display = "none";
    document.getElementById("alerta2").style.visibility = "hidden";
    document.getElementById("alerta2").style.display = "none";

    if (
      formData.email === "" ||
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      document.getElementById("alerta").innerHTML =
        "Por favor, llene todos los campos";
      document.getElementById("alerta").style.visibility = "visible";
      document.getElementById("alerta").style.display = "block";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      document.getElementById("alerta").innerHTML = "Ingrese un correo válido";
      document.getElementById("alerta").style.visibility = "visible";
      document.getElementById("alerta").style.display = "block";
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      document.getElementById("alerta").innerHTML =
        "Las contraseñas no coinciden";
      document.getElementById("alerta").style.visibility = "visible";
      document.getElementById("alerta").style.display = "block";
      return;
    }

    const contraSHA = SHA256(formData.password).toString();

    const campos = {
      name: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      pass: contraSHA,
    };

    axios
      .post(
        "http://" + ruta.ip + ":" + ruta.port + "/api/usuarios/create",
        JSON.stringify(campos),
        { headers: { "Content-Type": "application/json; charset=UTF-8" } }
      )
      .then((response) => {
        if (response.data.error === false) {
          document.getElementById("alerta2").innerHTML =
            "USUARIO CREADO CON ÉXITO";
          document.getElementById("alerta2").style.visibility = "visible";
          document.getElementById("alerta2").style.display = "block";
          setTimeout(function () {
            document.getElementById("alerta2").style.visibility = "hidden";
            document.getElementById("alerta2").style.display = "none";
          }, 2000);
        } else {
          document.getElementById("alerta").innerHTML =
            response.data.salida.toUpperCase();
          document.getElementById("alerta").style.visibility = "visible";
          document.getElementById("alerta").style.display = "block";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="admin">
        <Grid
          textAlign="center"
          style={{ height: "90vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" inverted textAlign="center">
              ¡CREA UNA CUENTA EN DC-TICKETS!
            </Header>
            <Form size="large" onSubmit={handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="Correo Electrónico"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Nombres"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Apellidos"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="phone"
                  iconPosition="left"
                  placeholder="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Contraseña"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirmar Contraseña"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button color="teal" fluid size="large" type="submit">
                  REGISTRAR USUARIO
                </Button>
                <Label
                  pointing
                  prompt
                  color="red"
                  id="alerta"
                  style={{ visibility: "hidden", display: "none" }}
                ></Label>
                <Label
                  pointing
                  prompt
                  color="green"
                  id="alerta2"
                  style={{ visibility: "hidden", display: "none" }}
                ></Label>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>

    </>
  );
};

export default RegisterForm;
