import React, { useState, useEffect } from "react";
import { Modal, Button, Label, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./Customers.css";
import axios from "axios";
import ruta from "../../Ruta.js";


function Tickets(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);



  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getPriorityStyle = () => {
    switch (props.Priority) {
      case "Baja":
        return {
          color: "black",
          backgroundColor: "green",
          fontWeight: "bold",
          textAlign: "center",
        };
      case "Media":
        return {
          color: "black",
          backgroundColor: "yellow",
          fontWeight: "bold",
          textAlign: "center",
        };
      case "Alta":
        return {
          color: "white",
          backgroundColor: "red",
          fontWeight: "bold",
          textAlign: "center",
        };
      default:
        return {
          color: "black",
          backgroundColor: "teal",
          fontWeight: "bold",
          textAlign: "center",
        };
    }
  };

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSeleccion = (valor) => {
    setPuntuacion(valor);
  };

  const handleImprimirPuntuacion = () => {
    //puntaje, idTicket
    const data = {
      puntaje: puntuacion,
      idTicket: props.Codigo,
    };


    var token = localStorage.getItem("inf");

    const headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/tickets/ranking", data, { headers }).
      then((response) => {
        if (!response.data.error) {
          document.getElementById("calificado").innerHTML = "¡GRACIAS POR CALIFICAR NUESTRO SERVICIO!";
          document.getElementById("calificado").style.visibility = "visible";
          document.getElementById("calificado").style.display = "block";
          setTimeout(() => {
            document.getElementById("calificado").style.visibility = "hidden";
            document.getElementById("calificado").style.display = "none";
            openModal();
            location.reload();
          }, 2000);

        } else {
          console.log("Error al calificar")
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };

  return (
    <div className="column carta">
      <div className="ui card">
        <div className="content">
          <div
            className="header"
            onChange={(e) => e.target.value}
            style={{
              textAlign: "center",
              backgroundColor: "teal",
              color: "white",
            }}
          >
            Ticket: {props.Codigo}
          </div>
          <div className="meta">
            <Label as="a" style={getPriorityStyle()} ribbon>
              ESTADO
            </Label>
            <div style={{ color: "black" }}>{props.Status}</div>
            <br></br>
            <Label as="a" style={getPriorityStyle()} ribbon>
              PRIORIDAD
            </Label>
            <div style={{ color: "black" }}>{props.Priority}</div>
            <br></br>
            <Label as="a" style={getPriorityStyle()} ribbon>
              FECHA DE CREACIÓN
            </Label>
            <div style={{ color: "black" }}>{props.DateCreation}</div>
            <br></br>
            <Label as="a" style={getPriorityStyle()} ribbon>
              ÚTLIMA ACTUALIZACIÓN
            </Label>
            <div style={{ color: "black" }}>{props.LastUpdate} a las {props.lastHour}</div>
            <br></br>
            <Label as="a" style={getPriorityStyle()} ribbon>
              AGENTE ASIGNADO
            </Label>
            <div style={{ color: "black" }}>{props.AssignedAgent}</div>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={toggleDetails} basic color="teal">
              Ver más información
            </Button>
            {props.puntaje === null && props.Status === "CERRADO" && (
              <Button onClick={() => openModal(props.Codigo)} basic color="green">
                Realizar encuesta
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showDetails}
        onClose={toggleDetails}
        className="ticket-modal"
      >
        <Modal.Header style={{ textAlign: "center" }}>
          DETALLES DEL TICKET {props.Codigo}
        </Modal.Header>
        <Modal.Content>
          {props && props.Descripcion !== null && props.Descripcion !== undefined && props.Descripcion !== "" &&
            <>
              <br />
              <Label color="teal" ribbon>DESCRIPCIÓN</Label>
              <div className="description">{props.Descripcion}</div>
            </>
          }
          <br />
          <Label color="green" ribbon>
            ESTADO DEL TICKET
          </Label>
          <div>{props.Solution}</div>
          {props.puntaje !== null && props.puntaje !== undefined && (
            <>
              <br />
              <Label color="yellow" ribbon>
                CALIFICACIÓN
              </Label>
              <br />
              <br />
              <div style={{ display: "flex", justifyContent: "left" }}>
                {[1, 2, 3, 4, 5].map((valor) => (
                  <Icon
                    key={valor}
                    name="star"
                    size="big"
                    color={valor <= props.puntaje ? "yellow" : "grey"}
                  />
                ))}
              </div>
            </>
          )}

          {props.archivo !== null && props.archivo !== undefined &&
            <div>
              <br />
              <Label color="blue" ribbon>ARCHIVO ADJUNTO</Label>
              <br />
              {props.archivo !== null && props.archivo !== undefined &&
                <div style={{ width: '400px', height: '400px' }}>
                  <br />
                  {props.archivo !== null && props.archivo !== undefined &&
                    <embed
                      src={`${props.archivo}`}
                      alt="Adjunto"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  }
                </div>
              }
            </div>
          }

          <br />
          <br />
          <Label color="red" ribbon>
            HISTORIAL
          </Label>
          <div>{props.CommunicationHistory}</div>

        </Modal.Content>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={openModal}
        className="encuesta-modal"
      >
        <Modal.Header style={{ textAlign: "center" }}>
          ENCUESTA PARA EL TICKET: {props.Codigo}
        </Modal.Header>
        <Modal.Content style={{ textAlign: "center" }}>
          <p>Por favor, califica el servicio:</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((valor) => (
              <Icon
                key={valor}
                name="star"
                size="big"
                color={puntuacion >= valor ? "yellow" : "grey"}
                style={{ cursor: "pointer", margin: "0 5px" }}
                onClick={() => handleSeleccion(valor)}
              />
            ))}
          </div>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: "center" }}>
          <Button onClick={handleImprimirPuntuacion} color="green">Aceptar</Button>
          <br />
          <br />
          <Label pointing prompt color="blue" id="calificado" className="Alerta" style={{ visibility: "hidden", display: "none", width: "50%", margin: "auto" }} ></Label>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default Tickets;
