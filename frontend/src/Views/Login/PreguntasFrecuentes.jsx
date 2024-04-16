import React from 'react';
import { Icon, Grid, Header, Segment } from 'semantic-ui-react';
import NavLogin from "../../Components/NavLogin";
import "./Login.css";

function PreguntasFrecuentes() {
    const preguntasFrecuentes = [
        {
            pregunta: "¿Puedo crear un ticket para otra persona?",
            respuesta: "No, la creación de tickets es de caracter personal y únicamente el usuario que lo crea tiene acceso a él."
        },
        {
            pregunta: "¿Cómo puedo cambiar mi información de contacto en el sistema?",
            respuesta: "Por el momento no es posible, pero estamos trabajando en ello."
        },
        {
            pregunta: "¿Puedo ver los tickets creados por otros clientes?",
            respuesta: "No, por razones de privacidad, solo puedes ver los tickets que tú mismo has creado."
        },
        {
            pregunta: "¿Qué pasa si olvido proporcionar información importante al crear un ticket?",
            respuesta: "Puedes agregar comentarios adicionales al ticket después de haberlo creado. El equipo de soporte también puede solicitarte más información si es necesario."
        },
        {
            pregunta: "¿Cómo puedo calificar el servicio recibido por el equipo de soporte?",
            respuesta: "Después de que un ticket se haya marcado como cerrado, se habilitará una opción en el ticket para poder realizar una encuesta."
        },
        {
            pregunta: "¿Puedo reabrir un ticket que se ha cerrado?",
            respuesta: "No, para esto se debe crear un nuevo ticket."
        },
        {
            pregunta: "¿Qué tan rápido se responderán mis tickets?",
            respuesta: "Nuestro objetivo es responder a todos los tickets dentro de las primeras 24 horas. Sin embargo, el tiempo de respuesta puede variar según la prioridad y el volumen de tickets."
        },
        {
            pregunta: "¿Puedo programar una llamada o una reunión con el equipo de soporte?",
            respuesta: "Sí, si necesitas asistencia adicional, puedes solicitar una llamada o una reunión virtual con un agente de soporte a través del portal web."
        },
        {
            pregunta: "¿Cómo puedo ver el historial de mis tickets pasados?",
            respuesta: "Inicia sesión en el portal web y accede a la sección 'Mis tickets'. Allí podrás ver una lista de todos tus tickets, tanto abiertos como cerrados."
        },
        {
            pregunta: "¿Puedo recibir notificaciones por SMS sobre el estado de mis tickets?",
            respuesta: "Actualmente, nuestro sistema no cuenta con este servicio. Sin embargo, estamos trabajando en agregar la opción de recibir notificaciones por SMS en el futuro."
        }
    ];

    const problemasFrecuentes = [
        {
            problema: "El cliente no puede iniciar sesión en el portal web.",
            solucion: "Verificar las credenciales de inicio de sesión. Si el problema persiste, contactar con el equipo de soporte."
        },
        {
            problema: "El cliente no puede adjuntar archivos al crear un ticket.",
            solucion: "Comprobar que el tamaño y el formato de los archivos son compatibles con los requisitos del sistema. Si el problema continúa, intentar con un navegador web diferente o desde otro dispositivo."
        },
        {
            problema: "El equipo de soporte no puede asignar un ticket a un agente.",
            solucion: "Verificar que el agente tenga los permisos adecuados y esté activo en el sistema. Si es así, contactar con el administrador del sistema para investigar el problema."
        },
        {
            problema: "El cliente no recibe actualizaciones sobre el estado de su ticket.",
            solucion: "Es posible que el equipo aún no pueda encontrar solución al problema. Puede revisar el estado del ticket dentro del mismo y en la sección \"Historial\". Si el problema persiste, contactar con el equipo de soporte."
        },
        {
            problema: "El cliente olvida su contraseña para acceder al portal web.",
            solucion: "Contactar a un usuario con rol de administrador para que pueda dar soporte y ayudar a resolver el problema."
        },
        {
            problema: "Un ticket se ha asignado al agente incorrecto.",
            solucion: "El administrador del sistema puede reasignar el ticket al agente correcto. También se puede verificar y ajustar la configuración de asignación automática de tickets."
        },
        {
            problema: "Un ticket se ha marcado como resuelto por error.",
            solucion: "El agente asignado puede reabrir el ticket y continuar trabajando en él. También se puede agregar una nota explicando el error."
        },
        {
            problema: "El cliente necesita cambiar la prioridad de un ticket.",
            solucion: "El cliente puede enviar una solicitud al equipo de soporte para que actualicen la prioridad del ticket. Los agentes también pueden ajustar la prioridad según sea necesario."
        },
        {
            problema: "El equipo de soporte no puede ver los archivos adjuntos en un ticket.",
            solucion: "Verificar que los archivos se hayan cargado correctamente y que sean compatibles con el sistema. Si el problema persiste, contactar con el administrador del sistema."
        }
    ];

    return (
        <>
            <NavLogin />
            <div className="login2">
                <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
                    <Grid columns={2} stackable style={{ border: "none" }}>
                        <Grid.Column>
                            <Segment raised style={{ backgroundColor: "transparent", border: "none", color: "black" }}>
                                <Header as="h2" dividing style={{ color: "white", border: "none" }}>
                                    <Icon name="question circle" />
                                    <Header.Content>
                                        Preguntas Frecuentes
                                    </Header.Content>
                                </Header>
                                {preguntasFrecuentes.map((pregunta, index) => (
                                    <Segment key={index} raised>
                                        <Header as="h3">{pregunta.pregunta}</Header>
                                        <p>{pregunta.respuesta}</p>
                                    </Segment>
                                ))}
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment raised style={{ backgroundColor: "transparent", border: "none", color: "black" }}>
                                <Header as="h2" dividing style={{ color: "white" }}>
                                    <Icon name="bug" />
                                    <Header.Content >
                                        Problemas Frecuentes
                                    </Header.Content>
                                </Header>
                                {problemasFrecuentes.map((problema, index) => (
                                    <Segment key={index} raised>
                                        <Header as="h3">{problema.problema}</Header>
                                        <p>{problema.solucion}</p>
                                    </Segment>
                                ))}
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default PreguntasFrecuentes;