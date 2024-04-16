import React from "react";
import { Table } from "semantic-ui-react";
import Carta from "./Tickets";

function MosaicTickets(props) {

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(dateString));
  };

  return (
    <div className="ui segment mosaico container" style={{ background: "transparent", border: "none", display: "flex", justifyContent: "center" }}>
      <div className="ui four column link cards row">
        {props.tickets.map((c, index) => (
          <Carta
            key={index}
            Codigo={c.idTicket}
            Status={
              c.idEstado === 3 ? "Nuevo" :
                c.idEstado === 4 ? "EN CURSO" :
                  c.idEstado === 5 ? "RESUELTO" :
                    c.idEstado === 6 ? "CERRADO" :
                      "Estado Desconocido"
            }
            Priority={
              c.idPrioridad === 1 ? "Baja" :
                c.idPrioridad === 2 ? "Media" :
                  c.idPrioridad === 3 ? "Alta" :
                    "Prioridad Desconocida"
            }
            DateCreation={formatDate(c.fechaCreacion)}
            Descripcion={c.descripcion}
            LastUpdate={formatDate(c.fechaUltimaActualizacion)}
            lastHour={new Date(c.fechaUltimaActualizacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            AssignedAgent={
              c.nombreAgente === null ? "Sin Asignar" : c.nombreAgente
            }
            CommunicationHistory={
              <Table basic='very' celled collapsing>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>FECHA</Table.HeaderCell>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>HORA</Table.HeaderCell>
                    <Table.HeaderCell style={{ textAlign: 'center' }}>COMENTARIO</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {c.historial.map((entry, historyIndex) => (
                    <Table.Row key={historyIndex}>
                      <Table.Cell>{formatDate(entry.fecha)}</Table.Cell>
                      <Table.Cell style={{ whiteSpace: 'nowrap' }}>{new Date(entry.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Table.Cell>
                      <Table.Cell>{entry.comentario}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            }
            Solution={c.solucionProblema === 0 ? "SIN RESOLVER" : "EL TICKET HA SIDO RESUELTO"}
            archivo={c.archivo}
            puntaje={c.puntaje}
          />
        ))}
      </div>
    </div>
  );
}

export default MosaicTickets;
