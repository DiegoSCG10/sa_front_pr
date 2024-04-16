import React, { useEffect, useState } from "react";
import NavCustomers from "../../Components/NavCustomers";
import "./Customers.css";
import MosaicTickets from "./Mosaic_tickets";
import { jwtDecode } from "jwt-decode";
import ruta from "../../Ruta.js";
import axios from "axios";

function TicketDetails() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("inf") === null) {
      window.location.href = "/";
      return;
    }

    var token = localStorage.getItem("inf");
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
        window.location.href = "Users"; //TODO: Change this to the correct path
      }
      return;
    }

    const data = {
      correo: tok.correo
    };

    const headers = {
      Authorization: `${token}`,
    };


    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/tickets/follow", data, { headers }).
      then((response) => {
        if (response.data.error) {
          alert("No ha creado tickets")
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
        console.log(error);
      });

  }, []);

  return (
    <>
      <NavCustomers />

      <div className="customers">
        <MosaicTickets tickets={tickets} />
      </div>
    </>
  );
}

export default TicketDetails;
