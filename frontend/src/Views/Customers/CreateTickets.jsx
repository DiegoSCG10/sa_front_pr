import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Segment, Dropdown, Label, } from "semantic-ui-react";
import NavCustomers from "../../Components/NavCustomers";
import { jwtDecode } from "jwt-decode";
import ruta from "../../Ruta.js";
import axios from "axios";

import "./Customers.css";

const problemOptions = [
  { key: "technical", text: "Técnico", value: "Técnico" },
  { key: "billing", text: "Facturación", value: "Facturación" },
  {
    key: "user-account",
    text: "Cuenta de Usuario",
    value: "Cuenta de Usuario",
  },
  {
    key: "customer-service",
    text: "Servicio al Cliente",
    value: "Servicio al Cliente",
  },
  { key: "security", text: "Seguridad", value: "Seguridad" },
  { key: "network", text: "Redes", value: "Redes" },
  {
    key: "human-resources",
    text: "Recursos Humanos",
    value: "Recursos Humanos",
  },
  {
    key: "installation-configuration",
    text: "Instalación y Configuración",
    value: "Instalación y Configuración",
  },
  { key: "maintenance", text: "Mantenimiento", value: "Mantenimiento" },
  { key: "training", text: "Entrenamiento", value: "Entrenamiento" },
  { key: "other", text: "Otro", value: "Otro" },
];

const priorityOptions = [
  { key: "low", text: "Baja", value: "Baja" },
  { key: "medium", text: "Media", value: "Media" },
  { key: "high", text: "Alta", value: "Alta" },
];

function CreateTicket() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [problemType, setProblemType] = useState("");
  const [priority, setPriority] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("inf") === null) {
      window.location.href = "/";
      return;
    }

    var token = localStorage.getItem("inf");
    setToken(token);
    var tok = jwtDecode(token);

    if (tok.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }


    if (tok.role !== 1) {
      if (tok.role === 2) {
        window.location.href = "FollowTicketsAgents";
      } else {
        window.location.href = "Users";
      }
      return;
    }

    setFullName(tok.nombreCompleto);
    setEmail(tok.correo);
    setPhone(tok.telefono);
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProblemTypeChange = (_, data) => {
    setProblemType(data.value);
  };

  const handlePriorityChange = (_, data) => {
    setPriority(data.value);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    setAttachments([...attachments, ...files]);
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "Baja":
        return "green";
      case "Media":
        return "yellow";
      case "Alta":
        return "red";
      default:
        return "black";
    }
  };

  const handleSaveTicketClick = async () => {
    var extensionArchivo = "";
    if (problemType === "" || priority === "") {
      document.getElementById("alertaMala").style.visibility = "visible";
      document.getElementById("alertaMala").style.display = "block";
      document.getElementById("alertaMala").innerText = "Por favor, seleccione un tipo de problema y una prioridad";
      setTimeout(() => {
        document.getElementById("alertaMala").style.visibility = "hidden";
        document.getElementById("alertaMala").style.display = "none";
      }, 2000);
      return;
    }

    let base64Attachments = [];
    if (attachments.length > 0) {
      const base64Promises = attachments.map(async (file) => {
        const reader = new FileReader();
        extensionArchivo = file.name.split(".")[1];
        return new Promise((resolve) => {
          reader.onload = () => {
            resolve({ fileName: file.name, base64: reader.result.split(',')[1] });
          };
          reader.readAsDataURL(file);
        });
      });

      base64Attachments = await Promise.all(base64Promises);
    }

    const priorityNumber = priority === "Baja" ? 1 : priority === "Media" ? 2 : 3;

    const data = {
      nombre: fullName,
      correo: email,
      telefono: phoneNumber,
      descripcion: description,
      tipo: problemType,
      prioridad: priorityNumber,
      archivo: base64Attachments.length > 0 ? base64Attachments[0].base64 : null,
      extension: extensionArchivo,
    };

    const headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/tickets/create", data, { headers }).
      then((response) => {
        if (!response.data.error) {
          document.getElementById("alertaBuena").style.visibility = "visible";
          document.getElementById("alertaBuena").style.display = "block";
          document.getElementById("alertaBuena").innerText = "Ticket creado con éxito";
          setTimeout(() => {
            document.getElementById("alertaBuena").style.visibility = "hidden";
            document.getElementById("alertaBuena").style.display = "none";
            location.reload(true);
          }, 2000);
        } else {
          document.getElementById("alertaMala").style.visibility = "visible";
          document.getElementById("alertaMala").style.display = "block";
          document.getElementById("alertaMala").innerText = "Error al crear el ticket";
          setTimeout(() => {
            document.getElementById("alertaMala").style.visibility = "hidden";
            document.getElementById("alertaMala").style.display = "none";
            location.reload(true);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Grid.Column style={{ maxWidth: 600 }}>
            <Header as="h2" inverted textAlign="center">
              ¡CREA UN NUEVO TICKET!
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Nombre y Apellidos"
                  value={fullName}
                  readOnly
                />
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="Correo Electrónico"
                  value={email}
                  readOnly
                />
                <Form.Input
                  fluid
                  icon="phone"
                  iconPosition="left"
                  placeholder="Numero de Teléfono"
                  value={phoneNumber}
                  readOnly
                />
                <Form.TextArea
                  placeholder="Descripción del Problema"
                  value={description}
                  onChange={handleDescriptionChange}
                  style={{ resize: "none" }}
                />
                <Dropdown
                  placeholder="Tipo de Problema"
                  fluid
                  selection
                  options={problemOptions}
                  onChange={handleProblemTypeChange}
                />

                <Dropdown
                  placeholder="Prioridad"
                  fluid
                  selection
                  options={priorityOptions}
                  onChange={handlePriorityChange}
                  style={{
                    backgroundColor: getPriorityColor(),
                    color: getPriorityColor() === "yellow" ? "black" : "white",
                    fontWeight: "bold",
                  }}
                />
                <br />
                <Form.Input
                  type="file"
                  label="Archivos Adjuntos"
                  multiple
                  onChange={handleFileUpload}
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={handleSaveTicketClick}
                >
                  Crear Ticket
                </Button>
                <Label
                  pointing
                  prompt
                  color="red"
                  id="alertaMala"
                  style={{ visibility: "hidden", display: "none" }}
                ></Label>
                <Label
                  pointing
                  prompt
                  color="green"
                  id="alertaBuena"
                  style={{ visibility: "hidden", display: "none" }}
                ></Label>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    </>
  );
}

export default CreateTicket;
