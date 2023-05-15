// import
import React from 'react';
import Dashboard from "./views/Dashboard/Dashboard.js";
import Events from "./views/Dashboard/Events";
import Tables from "./views/Dashboard/Tables.js";
import Billing from "./views/Dashboard/Billing.js";
import Profile from "./views/Dashboard/Profile.js";
import SignIn from "./views/Pages/SignIn.js";
import SignUp from "./views/Pages/SignUp.js";

import {CreditIcon, DocumentIcon, HomeIcon, PersonIcon, RocketIcon, StatsIcon,} from "components/Icons/Icons";
import LocalUnit from "./views/Dashboard/LocalUnit";
import {InfoIcon} from "@chakra-ui/icons";
import ULDashboard from "./views/Dashboard/ULDashboard";
import ManageEvents from "./views/Dashboard/ManageEvents";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/ul-dashboard",
    name: "UL Dashboard",
    icon: <InfoIcon color='inherit' />,
    component: ULDashboard,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Events",
    icon: <HomeIcon color='inherit' />,
    component: Events,
    layout: "/admin",
  },
  {
    path: "/manage-events",
    name: "Manage Events",
    icon: <HomeIcon color='inherit' />,
    component: ManageEvents,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    icon: <CreditIcon color='inherit' />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/local-unit",
    name: "Local Unit",
    icon: <HomeIcon color='inherit' />,
    component: LocalUnit,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
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
    ],
  },
];
export default dashRoutes;
