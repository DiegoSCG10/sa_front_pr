import React, { useState, useEffect } from 'react';
import './Admin.css';
import Navbar from '../../Components/NavAdmin';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import ruta from '../../Ruta';
import { Table, Button, Header, Modal, Form, Label, Grid, Segment, Message } from 'semantic-ui-react';

function Users() {
  const [userData, setUserData] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (localStorage.getItem('inf') === null) {
      window.location.href = '/';
      return;
    }

    var token = localStorage.getItem('inf');
    setToken(token);
    var tok = jwtDecode(token);

    if (tok.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      window.location.href = '/';
      return;
    }

    if (tok.role !== 3) {
      if (tok.role === 2) {
        window.location.href = 'FollowTicketsAgents';
      } else {
        window.location.href = 'CreateTickets'; //TODO: Change this to the correct path
      }
      return;
    }

    var headers = {
      Authorization: `${token}`,
    };

    axios
      .get('http://' + ruta.ip + ':' + ruta.port + '/api/admin/users', { headers })
      .then((response) => {
        if (response.data.error) {
          alert('ERROR AL CARGAR LOS DATOS DE LOS AGENTES');
        } else {
          setUserData(response.data.salida);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const promover = (user) => {
    const data = {
      idUsuario: user.idUsuario,
      idTipoUsuario: user.idTipoUsuario === 1 ? 2 : 3,
      idEstado: 1
    }

    var headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/admin/updateUser", data, { headers })
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

  }

  const degradar = (user) => {
    const data = {
      idUsuario: user.idUsuario,
      idTipoUsuario: user.idTipoUsuario === 2 ? 1 : 2,
      idEstado: 1
    }

    var headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/admin/updateUser", data, { headers })
      .then((response) => {
        if (response.data.error) {
          alert("No se ha podido degradar el ticket");
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const eliminar = (user) => {
    const data = {
      idUsuario: user.idUsuario,
      idTipoUsuario: user.idTipoUsuario,
      idEstado: 2
    }

    var headers = {
      Authorization: `${token}`,
    };

    axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/admin/updateUser", data, { headers })
      .then((response) => {
        if (response.data.error) {
          alert("No se ha podido eliminar el ticket");
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <>
      <Navbar />
      <div className="admin">
        <Header as="h1" textAlign="center" style={{ marginTop: "50px", color: "white" }}>
          USUARIOS DEL SISTEMA
        </Header>
        <Table celled style={{ width: "80%", margin: "auto", marginTop: "50px", marginbottom: "50px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ textAlign: "center" }}>NO. USUARIO</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>NOMBRE</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>CORREO</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>ROL</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>TELÉFONO</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>PROMOVER</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>DEGRADAR</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "center" }}>ELIMINAR</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {userData.map((user) => (
              <Table.Row key={user.idUsuario}>
                <Table.Cell style={{ textAlign: "center" }}>{user.idUsuario}</Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>{user.NombreCompleto}</Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>{user.correo}</Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>{user.idTipoUsuario === 1 ? 'Cliente' : user.idTipoUsuario === 2 ? 'Agente' : 'Administrador'}</Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>{user.telefono}</Table.Cell>
                {
                  user.idTipoUsuario === 1 ? <Table.Cell style={{ textAlign: "center" }}> <Button color='green' onClick={() => { promover(user) }}>Promover</Button></Table.Cell> :
                    user.idTipoUsuario === 2 ? <Table.Cell style={{ textAlign: "center" }}> <Button color='green' onClick={() => { promover(user) }}>Promover</Button></Table.Cell> :
                      <Table.Cell style={{ textAlign: "center" }}><b>N/A</b></Table.Cell>
                }
                {
                  user.idTipoUsuario === 1 ? <Table.Cell style={{ textAlign: "center" }}><b>N/A</b></Table.Cell> :
                    user.idTipoUsuario === 2 ? <Table.Cell style={{ textAlign: "center" }}> <Button color='orange' onClick={() => { degradar(user) }}>Degradar</Button></Table.Cell> :
                      <Table.Cell style={{ textAlign: "center" }}><b>N/A</b></Table.Cell>
                  /*<Table.Cell style={{ textAlign: "center" }}> <Button color='orange' onClick={() => { degradar(user) }}>Degradar</Button></Table.Cell>*/
                }
                {
                  user.idTipoUsuario === 1 ? <Table.Cell style={{ textAlign: "center" }}> <Button color='red' onClick={() => { eliminar(user) }}>Eliminar</Button></Table.Cell> :
                    user.idTipoUsuario === 2 ? <Table.Cell style={{ textAlign: "center" }}><b>N/A</b></Table.Cell> :
                      <Table.Cell style={{ textAlign: "center" }}><b>N/A</b></Table.Cell>

                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

    </>
  );
}

export default Users;
