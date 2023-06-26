// import
import React from 'react';
import Events from "./views/Dashboard/Events";
import Profile from "./views/Dashboard/Profile.js";
import SignIn from "./views/Pages/SignIn.js";
import SignUp from "./views/Pages/SignUp.js";

import {DocumentIcon, HomeIcon, PersonIcon, RocketIcon,} from "components/Icons/Icons";
import LocalUnit from "./views/Dashboard/LocalUnit";
import {CalendarIcon, TimeIcon} from "@chakra-ui/icons";
import ULDashboard from "./views/Dashboard/ULDashboard";
import ManageEvents from "./views/Dashboard/ManageEvents";
import Stocks from "./views/Dashboard/Stocks";
import FoodStocks from "./views/Dashboard/FoodStocks";
import ClothStocks from "./views/Dashboard/ClothStocks";
import Roles from "./views/Dashboard/roles/Roles";

var dashRoutes = [
  {
    path: "/ul-dashboard",
    name: "UL Dashboard",
    icon: <HomeIcon color='inherit' />,
    component: ULDashboard,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Events",
    icon: <TimeIcon color='inherit' />,
    component: Events,
    layout: "/admin",
  },
  {
    path: "/manage-events",
    name: "Manage Events",
    icon: <CalendarIcon color='inherit' />,
    component: ManageEvents,
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
    path: "/stocks",
    name: "Stocks",
    icon: <HomeIcon color='inherit' />,
    component: Stocks,
    layout: "/admin",
  },
  {
    path: "/food-stocks",
    name: "Food Stocks",
    icon: <HomeIcon color='inherit' />,
    component: FoodStocks,
    layout: "/admin",
  },
  {
    path: "/cloth-stocks",
    name: "Cloth Stocks",
    icon: <HomeIcon color='inherit' />,
    component: ClothStocks,
    layout: "/admin",
  },
  {
    path: "/roles",
    name: "Roles",
    icon: <HomeIcon color='inherit' />,
    component: Roles,
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
