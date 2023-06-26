// import
import React from 'react';
import Events from "./views/Dashboard/Events";
import SignIn from "./views/Pages/SignIn.js";
import SignUp from "./views/Pages/SignUp.js";

import {DocumentIcon, HomeIcon, RocketIcon,} from "components/Icons/Icons";
import LocalUnit from "./views/Dashboard/LocalUnit";
import {CalendarIcon, TimeIcon} from "@chakra-ui/icons";
import ULDashboard from "./views/Dashboard/ULDashboard";
import ManageEvents from "./views/Dashboard/events/ManageEvents";
import Stocks from "./views/Dashboard/Stocks";
import Roles from "./views/Dashboard/roles/Roles";
import Beneficiaries from "./views/Dashboard/Beneficiaries";
import {FaChartBar, FaShoppingCart, FaUsers, FaWrench} from "react-icons/fa";

var dashRoutes = [
  {
    path: "/ul-dashboard",
    name: "Tableau de bord",
    icon: <FaChartBar color='inherit' />,
    component: ULDashboard,
    layout: "/admin",
  },
  {
    path: "/local-unit",
    name: "Unité locale",
    icon: <HomeIcon color='inherit' />,
    component: LocalUnit,
    layout: "/admin",
  },
  {
    path: "/beneficiaries",
    name: "Bénéficiaires",
    icon: <FaUsers color='inherit' />,
    component: Beneficiaries,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Événements",
    icon: <TimeIcon color='inherit' />,
    component: Events,
    layout: "/admin",
  },
  {
    path: "/manage-events",
    name: "Gestion événements",
    icon: <CalendarIcon color='inherit' />,
    component: ManageEvents,
    layout: "/admin",
  },
  {
    path: "/stocks",
    name: "Stocks",
    icon: <FaShoppingCart color='inherit' />,
    component: Stocks,
    layout: "/admin",
  },
  {
    path: "/roles",
    name: "Roles",
    icon: <FaWrench color='inherit' />,
    component: Roles,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "Sign In",
    icon: <DocumentIcon color='inherit' />,
    component: SignIn,
    layout: "/auth",
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: <RocketIcon color='inherit' />,
    component: SignUp,
    layout: "/auth",
  },
];
export default dashRoutes;
