import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Label, Form, FormGroup, FormInput, FormSelect, FormTextArea, FormField, Radio, Header } from "semantic-ui-react";
import Navbar from "../../Components/NavAgents";
import "./Agents.css";
import { jwtDecode } from "jwt-decode";
import ruta from "../../Ruta.js";
import axios from "axios";

const FollowTicketsAgents = () => {
  const [tickets, setTickets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [token, setToken] = useState("");
  const [dataToken, setDataToken] = useState({});
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [estadoNuevo, setEstadoNuevo] = useState(false);
  const [estadoEnCurso, setEstadoEnCurso] = useState(false);
  const [estadoResuelto, setEstadoResuelto] = useState(false);
  const [estadoCerrado, setEstadoCerrado] = useState(false);
  const [infoTicketSeleccionado, setInfoTicketSeleccionado] = useState({});

  const [formData, setFormData] = useState({
    comentario: '',
    agenteAsignado: '',
    estadoTicket: '',
    solucionProblema: '',
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(dateString));
  };

  useEffect(() => {
    var toke = localStorage.getItem("inf");
    setToken(toke);

    if (localStorage.getItem("inf") === null) {
      window.location.href = "/";
      return;
    }

    var tok = jwtDecode(toke);
    setDataToken(tok);
    if (tok.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    if (tok.role !== 2) {
      if (tok.role === 1) {
        window.location.href = "CreateTickets";
      } else {
        window.location.href = "Users";
      }
      return;
    }

    const data = {
      correo: tok.correo
    };

    const headers = {
      Authorization: `${toke}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsAgents/follow", data, { headers })
      .then((response) => {
        if (response.data.error) {
          alert("No ha creado tickets");
        } else {
          for (let i = 0; i < response.data.salida.length; i++) {
            const fileData = response.data.salida[i].archivo;
            if (fileData !== null) {
              const extension = response.data.salida[i].extensionArchivo;
              let base64String;
              if (extension.toLowerCase() === 'pdf') {
                base64String = `data:application/pdf;base64,${fileData}`;
              } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
                base64String = `data:image/${extension};base64,${fileData}`;
              } else if (extension.toLowerCase() === 'docx') {
                base64String = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${fileData}`;
              } else if (extension.toLowerCase() === 'xlsx') {
                base64String = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileData}`;
              } else if (extension.toLowerCase() === 'json') {
                base64String = `data:application/json;base64,${fileData}`;
              } else if (extension.toLowerCase() === 'txt') {
                base64String = `data:text/plain;base64,${fileData}`;
              } else {
                alert('Tipo de archivo no admitido:', extension);
              }
              response.data.salida[i].archivo = base64String;
            }
          }
          setTickets(response.data.salida);
        }
      })
      .catch((error) => {
        console.error(error);
      });


  }, []);

  const handleVerDetallesClick = (ticket) => {
    setSelectedTicketId(ticket.idTicket);
    setDetails(ticket);
    setModalOpen(true);
  };

  var headers = {
    Authorization: `${token}`,
  };

  const handleVerEditarClick = (ticket) => {
    axios.get("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsAgents/freeagent", { headers })
      .then((response) => {
        if (response.data.error) {
          alert("ERROR AL CARGAR LOS DATOS DE LOS AGENTES");
        } else {
          var opciones = [];
          if (response.data.salida.length === 0) {
            opciones = { key: 1, text: "No hay agentes disponibles", value: 1 };
          } else {
            for (let i = 0; i < response.data.salida.length; i++) {
              opciones.push(
                { key: response.data.salida[i].idUsuario, text: response.data.salida[i].nombre, value: response.data.salida[i].idUsuario }
              );
            }
          }

          if (ticket.idEstado === 3) {
            setEstadoNuevo(true);
            setEstadoEnCurso(false);
            setEstadoResuelto(false);
            setEstadoCerrado(false);
          } else if (ticket.idEstado === 4) {
            setEstadoNuevo(false);
            setEstadoEnCurso(true);
            setEstadoResuelto(false);
            setEstadoCerrado(false);
          } else if (ticket.idEstado === 5) {
            setEstadoNuevo(false);
            setEstadoEnCurso(false);
            setEstadoResuelto(true);
            setEstadoCerrado(false);
          } else if (ticket.idEstado === 6) {
            setEstadoNuevo(false);
            setEstadoEnCurso(false);
            setEstadoResuelto(false);
            setEstadoCerrado(true);
          }

          setOptions(opciones);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setInfoTicketSeleccionado(ticket);
    setSelectedTicketId(ticket.idTicket);
    setDetails(ticket);
    setSecondModalOpen(true);
  };

  const handleEscalarTicketClick = (ticket) => {
    const data = {
      idTicket: ticket.idTicket,
      idUsuario: dataToken.id
    };

    var headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsUpdates/deleteagent", data, { headers })
      .then((response) => {
        if (response.data.error) {
          alert("No se ha podido escalar el ticket");
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAcceptClick = () => {
    const infoForm = {
      idTicket: selectedTicketId,
      comentario: formData.comentario,
      agenteAsignado: formData.agenteAsignado,
      estadoTicket: formData.estadoTicket,
      solucionProblema: formData.solucionProblema,
    };



    if (infoForm.estadoTicket === 'CERRADO') {
      if (details.idEstado !== 5) {
        alert("El ticket debe estar resuelto antes de cerrarse");
        return;
      }
    }

    if (infoForm.estadoTicket === 'RESUELTO') {
      if (details.idEstado !== 4) {
        alert("El ticket debe estar en curso antes de resolverse");
        return;
      }
    }

    if (infoForm.agenteAsignado !== '') {
      const data = {
        idTicket: infoForm.idTicket,
        idUsuario: infoForm.agenteAsignado
      };


      var headers = {
        Authorization: `${token}`,
      };

      axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsUpdates/addagent", data, { headers })
        .then((response) => {
          if (!response.data.error) {
            setSecondModalOpen(false); // Cerrar el modal si es necesario
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (infoForm.comentario !== '') {
      const data = {
        idTicket: infoForm.idTicket,
        idUsuario: dataToken.id,
        comentario: infoForm.comentario
      };


      var headers = {
        Authorization: `${token}`,
      };

      axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsUpdates/addcomment", data, { headers })
        .then((response) => {
          if (!response.data.error) {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (infoForm.estadoTicket === 'RESUELTO' && infoForm.solucionProblema === '') {
      alert("Debe proporcionar una solución al problema");
      return;
    } else if (infoForm.estadoTicket === 'RESUELTO' && infoForm.solucionProblema !== '') {
      const data = {
        idTicket: infoForm.idTicket,
        idUsuario: dataToken.id,
        solucionProblema: infoForm.solucionProblema
      };


      var headers = {
        Authorization: `${token}`,
      };

      axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsUpdates/addsolution", data, { headers })
        .then((response) => {
          if (!response.data.error) {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (infoForm.estadoTicket !== '' && infoForm.solucionProblema === '') {
      const data = {
        idTicket: infoForm.idTicket,
        idEstado: infoForm.estadoTicket === 'NUEVO' ? 3 : infoForm.estadoTicket === 'EN CURSO' ? 4 : infoForm.estadoTicket === 'RESUELTO' ? 5 : 6,
        idUsuario: dataToken.id
      };


      var headers = {
        Authorization: `${token}`,
      };

      axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/ticketsUpdates/updatestate", data, { headers })
        .then((response) => {
          if (!response.data.error) {
            window.location.reload();
          } else {
            alert("No se ha podido actualizar el estado del ticket");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };

  const handleCloseClick = () => {
    setFormData({
      comentario: '',
      agenteAsignado: '',
      estadoTicket: '',
      solucionProblema: '',
    });
    setSecondModalOpen(false);
  }

  return (
    <>
      <Navbar />
      <div className="agents">
        <Header as="h1" textAlign="center" style={{ marginTop: "50px", color: "white" }}>
          TICKETS ACTUALES EN EL SISTEMA
        </Header>
        <Table celled style={{ width: "80%", margin: "auto", marginTop: "50px", marginbottom: "50px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ textAlign: "center" }}>NO. TICKET</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>ESTADO</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>PRIORIDAD</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>FECHA DE CREACIÓN</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>AGENTE A CARGO</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>DETALLES</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>EDITAR TICKET</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>ESCALAR TICKET</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((ticket) => (
              <Table.Row key={ticket.idTicket}>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", fontWeight: ticket.idEstado === 6 ? "bold" : "normal" }}>{ticket.idTicket}</Table.Cell>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", }}>
                  {ticket.idEstado === 3 ? "NUEVO" :
                    ticket.idEstado === 4 ? "EN CURSO" :
                      ticket.idEstado === 5 ? "RESUELTO" :
                        ticket.idEstado === 6 ? "CERRADO" :
                          "Estado Desconocido"}
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", }}>
                  {ticket.idPrioridad === 1 ? "Baja" :
                    ticket.idPrioridad === 2 ? "Media" :
                      ticket.idPrioridad === 3 ? "Alta" :
                        "Prioridad Desconocida"}
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", }}>{formatDate(ticket.fechaCreacion)}</Table.Cell>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", }}>{ticket.nombreAgente === null ? <b>Sin Asignar</b> : ticket.nombreAgente}</Table.Cell>
                <Table.Cell style={{ textAlign: "center", color: ticket.idEstado === 6 ? "red" : "black", }}>
                  <Button primary onClick={() => handleVerDetallesClick(ticket)}>Ver Detalles</Button>
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>
                  {
                    ticket.idAgente == dataToken.id ?
                      ticket.idEstado !== 6 ? <Button color="black" onClick={() => handleVerEditarClick(ticket)}>Editar</Button>
                        : null
                      : ticket.idAgente === null && ticket.idEstado !== 6 ? <Button color="black" onClick={() => handleVerEditarClick(ticket)}>Editar</Button>
                        : null
                  }
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>
                  {
                    ticket.idAgente === dataToken.id ? <Button color="red" onClick={() => handleEscalarTicketClick(ticket)}>Escalar</Button> : null
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header style={{ textAlign: "center" }}>DETALLES DEL TICKET {selectedTicketId}</Modal.Header>
        <Modal.Content style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                {details && (
                  <>
                    <Label color="grey" ribbon>ÚLTIMA ACTUALIZACIÓN</Label>
                    <div>{formatDate(details.fechaUltimaActualizacion)} a las {new Date(details.fechaUltimaActualizacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <br />
                    <Label color="green" ribbon>CORREO DEL USUARIO</Label>
                    <div>{details.correoUsuario}</div>
                    <br />
                    <Label color="orange" ribbon>TIPO DE PROBLEMA</Label>
                    <div>{details.tipoProblema}</div>
                    {
                      details && details.descripcion !== null && details.descripcion !== undefined && details.descripcion !== "" &&
                      <>
                        <br />
                        <Label color="teal" ribbon>DESCRIPCIÓN</Label>
                        <div className="description">{details.descripcion}</div>
                      </>
                    }
                    <br />
                    <Label color="blue" ribbon>¿SE HA RESUELTO?</Label>
                    <div>{details.solucionProblema === 0 ? <b>SIN RESOLVER</b> : "EL TICKET HA SIDO RESUELTO"}</div>
                    <br />
                  </>
                )}
              </div>
              {
                details && details.archivo !== null && details.archivo !== undefined &&
                <div style={{ width: '300px', height: '400px', marginLeft: '20px' }}>
                  <Label color="brown" ribbon >Archivo Adjunto</Label>
                  <br />
                  {details && details.archivo !== null && details.archivo !== undefined &&
                    <embed
                      src={`${details.archivo}`}
                      alt="Adjunto"
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  }
                </div>

              }
            </div>
            <br />
            <br />
            <Label color="red" ribbon>HISTORIAL</Label>
            <div style={{ marginTop: '20px', width: '100%' }}>
              <Table basic='very' celled collapsing>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>FECHA</Table.HeaderCell>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>HORA</Table.HeaderCell>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>COMENTARIO</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    details && details.historial && details.historial.map((entry, historyIndex) => (
                      <Table.Row key={historyIndex}>
                        <Table.Cell>{formatDate(entry.fecha)}</Table.Cell>
                        <Table.Cell style={{ whiteSpace: 'nowrap' }}>{new Date(entry.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Table.Cell>
                        <Table.Cell>{entry.comentario}</Table.Cell>
                      </Table.Row>
                    ))
                  }

                </Table.Body>
              </Table>
            </div>
          </div>

        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setModalOpen(false)}>Cerrar</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={secondModalOpen} onClose={() => setSecondModalOpen(false)}>
        <Modal.Header style={{ textAlign: "center" }}>OPCIONES DEL TICKET {selectedTicketId}</Modal.Header>
        <Modal.Content>
          <Form>
            <FormGroup widths='equal'>
              <FormInput
                fluid
                label='AGREGAR COMENTARIO/NOTA'
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
              />

              {
                //console.log(options[0])
                options[0] === undefined && infoTicketSeleccionado.idAgente === null &&
                <Label color="red" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  NO HAY AGENTES DISPONIBLES
                </Label>

              }
              {
                options !== null && options.length > 0 &&
                <FormSelect
                  fluid
                  label={infoTicketSeleccionado.idAgente !== null ? "" : "ASIGNAR TICKET A UN AGENTE"}
                  options={options}
                  placeholder='Seleccionar Agente'
                  onChange={(e, { value }) => setFormData({ ...formData, agenteAsignado: value })}
                  style={infoTicketSeleccionado.idAgente !== null ? { visibility: "hidden", display: "none" } : { visibility: "visible", display: "block" }}
                />
              }
            </FormGroup>
            <FormField>
              <b>ESTADO DEL TICKET</b>
            </FormField>
            <FormField>
              <Radio
                label='NUEVO'
                value='NUEVO'
                checked={estadoNuevo}
                onChange={() => {
                  setEstadoNuevo(true);
                  setEstadoEnCurso(false);
                  setEstadoResuelto(false);
                  setEstadoCerrado(false);
                  setFormData({ ...formData, estadoTicket: 'NUEVO' });
                }}
              />
            </FormField>
            <FormField>
              <Radio
                label='EN CURSO'
                value='EN CURSO'
                checked={estadoEnCurso}
                onChange={() => {
                  setEstadoNuevo(false);
                  setEstadoEnCurso(true);
                  setEstadoResuelto(false);
                  setEstadoCerrado(false);
                  setFormData({ ...formData, estadoTicket: 'EN CURSO' });
                }}
              />
            </FormField>
            <FormField>
              <Radio
                label='RESUELTO'
                value='RESUELTO'
                checked={estadoResuelto}
                onChange={() => {
                  setEstadoNuevo(false);
                  setEstadoEnCurso(false);
                  setEstadoResuelto(true);
                  setEstadoCerrado(false);
                  setFormData({ ...formData, estadoTicket: 'RESUELTO' });
                }}
              />
            </FormField>
            <FormField>
              <Radio
                label='CERRADO'
                value='CERRADO'
                checked={estadoCerrado}
                onChange={() => {
                  setEstadoNuevo(false);
                  setEstadoEnCurso(false);
                  setEstadoResuelto(false);
                  setEstadoCerrado(true);
                  setFormData({ ...formData, estadoTicket: 'CERRADO' });
                }}
              />
            </FormField>
            <br />
            <FormTextArea
              label='DAR UNA SOLUCIÓN AL PROBLEMA'
              placeholder=''
              onChange={(e) => setFormData({ ...formData, solucionProblema: e.target.value })}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => handleCloseClick()}>Cerrar</Button>
          <Button color="green" onClick={() => handleAcceptClick()}>Aceptar</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default FollowTicketsAgents;
