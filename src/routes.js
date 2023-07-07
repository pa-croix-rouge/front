// import
import React from 'react';
import Events from "./views/Dashboard/events/Events";
import SignIn from "./views/Pages/SignIn.js";
import SignUp from "./views/Pages/SignUp.js";

import {DocumentIcon, HomeIcon, RocketIcon,} from "components/Icons/Icons";
import LocalUnit from "./views/Dashboard/LocalUnit";
import {CalendarIcon, TimeIcon} from "@chakra-ui/icons";
import ULDashboard from "./views/Dashboard/ULDashboard";
import ManageEvents from "./views/Dashboard/events/ManageEvents";
import Stocks from "./views/Dashboard/Stocks";
import Roles from "./views/Dashboard/roles/Roles";
import Beneficiaries from "./views/Dashboard/Beneficiaries/Beneficiaries";
import {FaArchive, FaChartBar, FaShoppingCart, FaUsers, FaWrench} from "react-icons/fa";
import ProductLimits from "./views/Dashboard/productlimits/ProductLImits";

var dashRoutes = [
  {
    path: "/ul-dashboard",
    name: "Tableau de bord",
    icon: <FaChartBar color='inherit' />,
    component: ULDashboard,
    layout: "/admin",
    role: "",
  },
  {
    path: "/local-unit",
    name: "Unité locale",
    icon: <HomeIcon color='inherit' />,
    component: LocalUnit,
    layout: "/admin",
    role: "",
  },
  {
    path: "/beneficiaries",
    name: "Bénéficiaires",
    icon: <FaUsers color='inherit' />,
    component: Beneficiaries,
    layout: "/admin",
    role: "BENEFICIARY",
  },
  {
    path: "/events",
    name: "Événements",
    icon: <TimeIcon color='inherit' />,
    component: Events,
    layout: "/admin",
    role: "EVENT",
  },
  {
    path: "/manage-events",
    name: "Gestion événements",
    icon: <CalendarIcon color='inherit' />,
    component: ManageEvents,
    layout: "/admin",
    role: "EVENT",
  },
  {
    path: "/stocks",
    name: "Stocks",
    icon: <FaArchive color='inherit' />,
    component: Stocks,
    layout: "/admin",
    role: "",
  },
  {
    path: "/product-limits",
    name: "Limites de produits",
    icon: <FaShoppingCart color='inherit' />,
    component: ProductLimits,
    layout: "/admin",
    role: "PRODUCT_LIMIT",
  },
  {
    path: "/roles",
    name: "Roles",
    icon: <FaWrench color='inherit' />,
    component: Roles,
    layout: "/admin",
    role: "ROLE",
  },
  {
    path: "/signin",
    name: "Sign In",
    icon: <DocumentIcon color='inherit' />,
    component: SignIn,
    layout: "/auth",
    role: "",
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: <RocketIcon color='inherit' />,
    component: SignUp,
    layout: "/auth",
    role: "",
  },
];
export default dashRoutes;
