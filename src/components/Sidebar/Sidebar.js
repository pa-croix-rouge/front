/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text, Tooltip,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import IconBox from "./../Icons/IconBox";
import {
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderView,
} from "../Scrollbar/Scrollbar";
import { HSeparator } from "../Separator/Separator";
import React, {useState} from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink, useLocation } from "react-router-dom";
import {getMyAuthorizations} from "../../controller/RoleController";

function Sidebar(props) {
  let location = useLocation();
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";
  const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
  const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
  const loadVolunteerAuthorizations = () => {
    setLoadedVolunteerAuthorizations(true);
    getMyAuthorizations()
        .then((roles) => {
          setVolunteerAuthorizations(roles);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedVolunteerAuthorizations(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des droits du volontaire.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  const createLinks = (routes) => {
    let activeBg = useColorModeValue("white", "navy.700");
    let inactiveBg = useColorModeValue("white", "navy.700");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    const styleColor = "orange.500";

    return routes.filter(prop => prop.name !== "Sign In" && prop.name !== "Sign Up").map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={key}>
            <Text color={activeColor} fontWeight="bold" mb={{xl: "6px"}} mx="auto" ps={{sm: "10px", xl: "16px"}} py="12px">
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {loadedVolunteerAuthorizations && canReadRoute(prop.role)}
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Tooltip label="Vous n'avez pas les droits" isDisabled={canReadRoute(prop.role)}>
              <Box>
                <Button disabled={!canReadRoute(prop.role)} boxSize="initial" justifyContent="flex-start" alignItems="center" boxShadow={sidebarActiveShadow} bg={activeBg} transition={variantChange} mb={{xl: "6px"}} mx={{xl: "auto"}} ps={{sm: "10px", xl: "16px"}} py="12px" borderRadius="15px" _hover="none" w="100%" _active={{bg: "inherit", transform: "none", borderColor: "transparent"}} _focus={{boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)"}}>
                  <Flex>
                    {typeof prop.icon === "string" ? (
                        <Icon>{prop.icon}</Icon>
                    ) : (
                        <IconBox bg={styleColor} color="white" h="30px" w="30px" me="12px" transition={variantChange}>{prop.icon}</IconBox>
                    )}
                    <Text color={activeColor} my="auto" fontSize="sm">{prop.name}</Text>
                  </Flex>
                </Button>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip label="Vous n'avez pas les droits" isDisabled={canReadRoute(prop.role)}>
              <Box>
                <Button disabled={!canReadRoute(prop.role)} boxSize="initial" justifyContent="flex-start" alignItems="center" bg="transparent" mb={{xl: "6px"}} mx={{xl: "auto"}} py="12px" ps={{sm: "10px", xl: "16px"}} borderRadius="15px" _hover="none" w="100%" _active={{bg: "inherit", transform: "none", borderColor: "transparent"}} _focus={{boxShadow: "none"}}>
                  <Flex>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <IconBox bg={inactiveBg} color={styleColor} h="30px" w="30px" me="12px" transition={variantChange}>{prop.icon}</IconBox>
                    )}
                    <Text color={inactiveColor} my="auto" fontSize="sm">{prop.name}</Text>
                  </Flex>
                </Button>
              </Box>
            </Tooltip>
          )}
        </NavLink>
      );
    });
  };
  const { logo, routes } = props;

  const canReadRoute = (role) => {
    if (role === "") {
      return true;
    }
    return volunteerAuthorizations[role]?.filter((r) => r === 'READ').length > 0;
  }

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarRadius = "20px";
  let sidebarMargins = "0px";
  var brand = (
    <Box pt={"25px"} mb="12px">
      {logo}
      <HSeparator my="26px" />
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box bg={sidebarBg} transition={variantChange} w="260px" maxW="260px" ms={{sm: "16px"}} my={{sm: "16px"}} h="calc(100vh - 32px)" ps="20px" pe="20px" m={sidebarMargins} filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))" borderRadius={sidebarRadius}>
          <Scrollbars autoHide renderTrackVertical={renderTrack} renderThumbVertical={useColorModeValue(renderThumbLight, renderThumbDark)} renderView={renderView}>
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
          </Scrollbars>
        </Box>
      </Box>
    </Box>
  );
}

export function SidebarResponsive(props) {
  // to check for active links and opened collapses
  let location = useLocation();
  const { logo, routes, colorMode, hamburgerColor, ...rest } = props;

  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // Chakra Color Mode
  let activeBg = useColorModeValue("white", "navy.700");
  let inactiveBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "white");
  let sidebarActiveShadow = useColorModeValue( "0px 7px 11px rgba(0, 0, 0, 0.04)", "none");
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  const styleColor = "orange.500";

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.filter(prop => prop.name !== "Sign In" && prop.name !== "Sign Up").map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={key}>
            <Text color={activeColor} fontWeight="bold" mb={{xl: "6px"}} mx="auto" ps={{sm: "10px", xl: "16px"}} py="12px">
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button boxSize="initial" justifyContent="flex-start" alignItems="center" bg={activeBg} boxShadow={sidebarActiveShadow} mb={{xl: "6px"}} mx={{xl: "auto"}} ps={{sm: "10px", xl: "16px"}} py="12px" borderRadius="15px" _hover="none" w="100%" _active={{bg: "inherit", transform: "none", borderColor: "transparent"}} _focus={{boxShadow: "none"}}>
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox bg={styleColor} color="white" h="30px" w="30px" me="12px">{prop.icon}</IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">{prop.name}</Text>
              </Flex>
            </Button>
          ) : (
            <Button boxSize="initial" justifyContent="flex-start" alignItems="center" bg="transparent" mb={{xl: "6px"}} mx={{xl: "auto"}} py="12px" ps={{sm: "10px", xl: "16px"}} borderRadius="15px" _hover="none" w="100%" _active={{bg: "inherit", transform: "none", borderColor: "transparent"}} _focus={{boxShadow: "none"}}>
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox bg={inactiveBg} color={styleColor} h="30px" w="30px" me="12px">{prop.icon}</IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">{prop.name}</Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  var links = <>{createLinks(routes)}</>;

  //  BRAND
  var brand = (
    <Box pt={"35px"} mb="8px">
      {logo}
      <HSeparator my="26px" />
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // Color variables
  return (
    <Flex display={{ sm: "flex", xl: "none" }} ref={mainPanel} alignItems="center">
      <HamburgerIcon color={hamburgerColor} w="18px" h="18px" ref={btnRef} onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose} placement={"left"} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w="250px" maxW="250px" ms={{sm: "16px"}} my={{sm: "16px"}} borderRadius="16px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton _focus={{ boxShadow: "none" }} _hover={{ boxShadow: "none" }} />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
