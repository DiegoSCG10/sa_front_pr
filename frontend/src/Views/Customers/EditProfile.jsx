import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import NavCustomers from "../../Components/NavCustomers";
import "./Customers.css";

function EditProfile() {
  // Estados locales para almacenar datos del usuario
  const [fullName, setFullName] = useState("John"); // Nombre y apellidos del cliente
  const [email, setEmail] = useState("john.doe@example.com"); // Correo electrónico del cliente
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890"); // Número de teléfono del cliente

  // Manejar el cambio en el campo de número de teléfono
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Manejar el clic en el botón "Guardar Cambios"
  const handleSaveChangesClick = () => {
    console.log("Nombre y Apellidos:", fullName);
    console.log("Correo Electrónico:", email);
    console.log("Número de Teléfono (Editado):", phoneNumber);
  };

  return (
    <>
      <NavCustomers />

      <div className="customers">
        <Grid
          textAlign="center"
          style={{ height: "90vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" inverted textAlign="center">
              ¡EDITA TUS DATOS!
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Nombre y Apellidos"
                  value={fullName}
                  readOnly // Campo no editable
                />
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="Correo Electrónico"
                  value={email}
                  readOnly // Campo no editable
                />
                <Form.Input
                  fluid
                  icon="phone"
                  iconPosition="left"
                  placeholder="Número de Teléfono"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={handleSaveChangesClick}
                >
                  Guardar Cambios
                </Button>
              </Segment>
            </Form>
            <Message>
              <a href="/">Volver al Inicio</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    </>
  );
}

export default EditProfile;
