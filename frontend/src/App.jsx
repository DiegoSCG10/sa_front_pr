import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import Register from "./Views/Admins/Register";

import EditProfile from "./Views/Customers/EditProfile";
import CreateTickets from "./Views/Customers/CreateTickets";
import FollowTickets from "./Views/Customers/FollowTickets";
import FollowTicketsAgents from "./Views/Agents/FollowTicketsAgents";
import Users from "./Views/Admins/Users";
import Configure from "./Views/Admins/Configure";
import Reports from "./Views/Admins/Reports";
import PreguntasFrecuentes from "./Views/Login/PreguntasFrecuentes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PreguntasFrecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/CreateTickets" element={<CreateTickets />} />
        <Route path="/FollowTickets" element={<FollowTickets />} />
        <Route path="/FollowTicketsAgents" element={<FollowTicketsAgents />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Configure" element={<Configure />} />
        <Route path="/Reports/:tipo" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
