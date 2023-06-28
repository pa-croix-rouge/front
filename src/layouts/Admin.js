// Chakra imports
import {Box, Image, Portal, Stack, useDisclosure,} from "@chakra-ui/react";
import Footer from "./../components/Footer/Footer.js";
import AdminNavbar from "./../components/Navbars/AdminNavbar.js";
import Sidebar from "./../components/Sidebar/Sidebar.js";
import React, {useState} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import routes from "./../routes.js";
import MainPanel from "./../components/Layout/MainPanel";
import PanelContainer from "./../components/Layout/PanelContainer";
import PanelContent from "./../components/Layout/PanelContent";
import bgAdmin from "./../assets/img/admin-background.jpg";
import croixRougeLogoHr from "../assets/img/hr_Croix-Rouge_française_Logo.png"

export default function Dashboard(props) {
    const {...rest} = props;
    const history = useHistory();
    // states and functions
    const [fixed, setFixed] = useState(false);

    const getRoute = () => {
        return window.location.pathname !== "/admin/full-screen-maps";
    };
    const getActiveRoute = (routes) => {
        let activeRoute = "Default Brand Text";
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i].views);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].views);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (
                    window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
                ) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };
    // This changes navbar state(fixed or not)
    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].views);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (
                    window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
                ) {
                    if (routes[i].secondaryNavbar) {
                        return routes[i].secondaryNavbar;
                    }
                }
            }
        }
        return activeNavbar;
    };
    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.collapse) {
                return getRoutes(prop.views);
            }
            if (prop.category === "account") {
                return getRoutes(prop.views);
            }
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    const {isOpen, onOpen, onClose} = useDisclosure();
    document.documentElement.dir = "ltr";


    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined || localStorage.getItem('token') === "") {
        history.push("/auth");
    }

    // Chakra Color Mode
    return (
        <Box>
            <Box
                minH='70vh'
                w='100%'
                position='absolute'
                bgImage={bgAdmin}
                bg={bgAdmin}
                bgSize='cover'
                top='0'
            />
            <Sidebar
                routes={routes}
                logo={
                    <Stack direction='row' spacing='12px' align='center' justify='center'>
                        <Image src={croixRougeLogoHr} w='157px' h='57px'/>
                    </Stack>
                }
                display='none'
                {...rest}
            />
            <MainPanel
                w={{
                    base: "100%",
                    xl: "calc(100% - 275px)",
                }}>
                <Portal>
                    <AdminNavbar
                        onOpen={onOpen}
                        brandText={getActiveRoute(routes)}
                        secondary={getActiveNavbar(routes)}
                        fixed={fixed}
                        {...rest}
                    />
                </Portal>
                {getRoute() ? (
                    <PanelContent>
                        <PanelContainer>
                            <Switch>
                                {getRoutes(routes)}
                                <Redirect from='/admin' to='/admin/dashboard'/>
                            </Switch>
                        </PanelContainer>
                    </PanelContent>
                ) : null}
                <Footer/>
            </MainPanel>
        </Box>
    );
}
