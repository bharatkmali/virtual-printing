import React from "react";
import { Routes as Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminHome from "../pages/admin/AdminHome";
import Login from "../pages/authentication/Login";

const Router = () => {
  return (
    <>
      <Switch>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminHome />} />
      </Switch>
    </>
  );
};

export default Router;
