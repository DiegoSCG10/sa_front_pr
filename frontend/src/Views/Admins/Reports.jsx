import { React, useEffect, useState } from 'react'
import Navbar from '../../Components/NavAdmin';
import './Admin.css';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import ruta from '../../Ruta';
import { Modal, Button, Table, Header } from 'semantic-ui-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'
ChartJS.register(...registerables);

function Reports() {
    const [userData, setUserData] = useState([]);
    const [lastValue, setLastValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [datosUser, setDatosUser] = useState(null);
    const [token, setToken] = useState('');

    const [reportDataUser, setReportDataUser] = useState({
        "TicketsCreados": 0,
        "TicketsResueltosCerrados": 0,
        "TicketsEnProceso": 0,
        "TiempoPromedioRespuesta": "0",
        "SatisfaccionPromedioCliente": null
    });

    const [reportDataGeneral, setReportDataGeneral] = useState({
        "TotalTickets": 0,
        "TicketsResueltos": 0,
        "TicketsNoResueltos": 0,
        "PuntajePromedio": 0,
        "TiempoPromedioResolucion": "",
        "AgenteConMasTicketsAsignados": "",
        "TotalTicketsAgenteMasAsignado": 0,
        "AgenteConMasTicketsResueltos": 0,
        "TotalTicketsResueltosAgenteMasResuelto": 0,
        "AgenteConMenosTicketsResueltos": 0,
        "TotalTicketsResueltosAgenteMenosResueltos": 0
    });

    const chartData = {
        labels: Object.keys(reportDataGeneral),
        datasets: [
            {
                label: 'Valor',
                data: Object.values(reportDataGeneral),
                backgroundColor: 'rgba(255, 255, 0, 1)', // Amarillo
                borderWidth: 0, // Sin bordes
            },
        ],
    };

    const chartOptions = {
        legend: {
            display: false, // Ocultar leyenda
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const [chartData2, setChartData2] = useState({
        labels: [],
        datasets: [
            {
                label: 'Valor',
                data: [],
                backgroundColor: 'rgba(255, 0, 0, 1)', // Rojo
                borderWidth: 0, // Sin bordes
            },
        ],
    });

    const chartOptions2 = {
        legend: {
            display: false, // Ocultar leyenda
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

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
            Authorization: `${token}`
        };

        axios.get('http://' + ruta.ip + ':' + ruta.port + '/api/admin/users', { headers })
            .then((response) => {
                if (response.data.error) {
                    alert('ERROR AL CARGAR LOS DATOS DE LOS AGENTES');
                } else {
                    // Filtrar solo usuarios de tipo 1 (Clientes)
                    const filteredUsers = response.data.salida.filter(user => user.idTipoUsuario === 1);
                    setUserData(filteredUsers);
                }
            })
            .catch((error) => {
                console.error(error);
            });


        const currentPath = window.location.pathname;
        const lastVal = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        setLastValue(lastVal);

        if (lastVal === 'General') {

            var headers = {
                Authorization: `${token}`
            };

            axios.get('http://' + ruta.ip + ':' + ruta.port + '/api/informes/general', { headers })
                .then((response) => {
                    if (response.data.error) {
                        alert('ERROR AL OBTENER LOS DATOS DEL INFORME GENERAL');
                    } else {
                        reportDataGeneral.TotalTickets = response.data.salida[0].TotalTickets;
                        reportDataGeneral.TicketsResueltos = response.data.salida[0].TicketsResueltos;
                        reportDataGeneral.TicketsNoResueltos = response.data.salida[0].TicketsNoResueltos;
                        reportDataGeneral.PuntajePromedio = response.data.salida[0].PuntajePromedio;
                        reportDataGeneral.TiempoPromedioResolucion = response.data.salida[0].TiempoPromedioResolucion;
                        reportDataGeneral.AgenteConMasTicketsAsignados = response.data.salida[0].AgenteConMasTicketsAsignados;
                        reportDataGeneral.TotalTicketsAgenteMasAsignado = response.data.salida[0].TotalTicketsAgenteMasAsignado;
                        reportDataGeneral.AgenteConMasTicketsResueltos = response.data.salida[0].AgenteConMasTicketsResueltos;
                        reportDataGeneral.TotalTicketsResueltosAgenteMasResuelto = response.data.salida[0].TotalTicketsResueltosAgenteMasResuelto;
                        reportDataGeneral.AgenteConMenosTicketsResueltos = response.data.salida[0].AgenteConMenosTicketsResueltos;
                        reportDataGeneral.TotalTicketsResueltosAgenteMenosResueltos = response.data.salida[0].TotalTicketsResueltosAgenteMenosResueltos;


                        chartData.labels = Object.keys(reportDataGeneral);
                        chartData.datasets[0].data = Object.values(reportDataGeneral);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        } else if (lastVal === 'Usuario') {
            handleModalOpen();
        }

    }, [])

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const verReporteUsuario = (id) => {
        const data = {
            usuario: id,
        }

        var headers = {
            Authorization: `${token}`
        };

        axios.post("http://" + ruta.ip + ":" + ruta.port + "/api/informes/usuario", data, { headers })
            .then((response) => {
                if (response.data.error) {
                    alert("NO SE HA PODIDO OBTENER LA INFORMACIÓN DEL USUARIO");
                } else {
                    setReportDataUser(prevState => ({
                        ...prevState,
                        TicketsCreados: response.data.salida[0].TicketsCreados,
                        TicketsResueltosCerrados: response.data.salida[0].TicketsResueltosCerrados,
                        TicketsEnProceso: response.data.salida[0].TicketsEnProceso,
                        TiempoPromedioRespuesta: response.data.salida[0].TiempoPromedioRespuesta,
                        SatisfaccionPromedioCliente: response.data.salida[0].SatisfaccionPromedioCliente,
                    }));

                    setChartData2(prevState => ({
                        ...prevState,
                        labels: Object.keys(response.data.salida[0]),
                        datasets: [
                            {
                                label: 'Valor',
                                data: Object.values(response.data.salida[0]),
                                backgroundColor: 'rgba(255, 0, 0, 1)', // Rojo
                                borderWidth: 0, // Sin bordes
                            },
                        ],
                    }));
                }
            })
            .catch((error) => {
                console.log(error);
            });

        handleModalClose();
    }

    function formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, '      $1').trim();
    }

    return (
        <>
            <Navbar />

            {lastValue === 'General' && (
                <>
                    <div className="admin" >
                        <Header as='h1' textAlign="center" style={{ marginTop: "50px", color: "white" }}>REPORTE GENERAL DEL SISTEMA</Header>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "35%", textAlign: "center", marginTop: "20px", marginRight: "5%" }}>
                                <Table celled striped textAlign="center">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Nombre del Campo</Table.HeaderCell>
                                            <Table.HeaderCell>Valor</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {Object.entries(reportDataGeneral).map(([key, value]) => (
                                            <Table.Row key={key}>
                                                <Table.Cell>{formatFieldName(key)}</Table.Cell>
                                                <Table.Cell>{value}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                            <div style={{ width: '40%' }}>
                                <Bar type="bar" data={chartData} options={chartOptions} />
                            </div>
                        </div>

                    </div>

                </>
            )}


            {lastValue === 'Usuario' && (
                <>
                    <>
                        <div className="admin" >
                            <Header as='h1' textAlign="center" style={{ marginTop: "50px", color: "white" }}>REPORTE DEL USUARIO "{datosUser}"</Header>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: "35%", textAlign: "center", marginTop: "20px", marginRight: "5%" }}>
                                    <Table celled striped textAlign="center">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Nombre del Campo</Table.HeaderCell>
                                                <Table.HeaderCell>Valor</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {Object.entries(reportDataUser).map(([key, value]) => (
                                                <Table.Row key={key}>
                                                    <Table.Cell>{formatFieldName(key)}</Table.Cell>
                                                    <Table.Cell>{value}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <div style={{ width: '40%' }}>
                                    <Bar type="bar" data={chartData2} options={chartOptions2} />
                                </div>
                            </div>

                        </div>

                    </>



                    <Modal open={showModal} onClose={handleModalClose} size='small'>
                        <Modal.Header>Usuarios</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Table celled style={{ margin: "auto" }}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell style={{ textAlign: "center" }}>NO. USUARIO</Table.HeaderCell>
                                            <Table.HeaderCell style={{ textAlign: "center" }}>NOMBRE</Table.HeaderCell>
                                            <Table.HeaderCell style={{ textAlign: "center" }}>CORREO</Table.HeaderCell>
                                            <Table.HeaderCell style={{ textAlign: "center" }}>REPORTE</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {userData.map((user) => (
                                            <Table.Row key={user.idUsuario}>
                                                <Table.Cell style={{ textAlign: "center" }}>{user.idUsuario}</Table.Cell>
                                                <Table.Cell style={{ textAlign: "center" }}>{user.NombreCompleto}</Table.Cell>
                                                <Table.Cell style={{ textAlign: "center" }}>{user.correo}</Table.Cell>
                                                <Table.Cell style={{ textAlign: "center" }}>
                                                    <Button color='blue' onClick={() => {
                                                        verReporteUsuario(user.idUsuario)
                                                        setDatosUser(user.NombreCompleto)
                                                    }}>Ver</Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={handleModalClose}>Cerrar</Button>
                        </Modal.Actions>
                    </Modal>
                </>
            )}
        </>
    );
}

export default Reports;
