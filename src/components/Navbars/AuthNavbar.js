// Chakra imports
import {
  Box,
  Button,
  Flex,
  HStack, Image,
  Link, Stack, Text, useColorModeValue
} from "@chakra-ui/react";
import {
  DocumentIcon,
  RocketIcon
} from "../Icons/Icons";
import { SidebarResponsive } from "../Sidebar/Sidebar";
import React from "react";
import { NavLink } from "react-router-dom";
import routes from "./../../routes.js";
import croixRougeLogoHr from "../../assets/img/hr_Croix-Rouge_française_Logo.png";
export default function AuthNavbar(props) {
  const { logo, logoText, secondary, ...rest } = props;
  // Chakra color mode
  let mainText = "white";
  let navbarIcon = "white";
  let navbarBg = "none";
  let navbarBorder = "none";
  let navbarShadow = "initial";
  let navbarFilter = "initial";
  let navbarBackdrop = "none";
  let navbarPosition = "absolute";
  let hamburgerColor = {
    base: useColorModeValue("gray.700", "white"),
    md: "white",
  };
  let brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target="_blank"
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
      <Stack direction="row" spacing="12px" align="center" justify="center">
        <Image src={croixRougeLogoHr} w='157px' h='57px' />
      </Stack>
      <Text fontSize="sm" mt="3px">
        {logoText}
      </Text>
    </Link>
  );
  hamburgerColor = { base: "white" };
  const linksAuth = (
      <HStack display={{sm: "none", lg: "flex"}}>
        <NavLink to="/auth/signup">
          <Button
              fontSize="sm"
              ms="0px"
              px="0px"
              me={{sm: "2px", md: "16px"}}
              color={navbarIcon}
              variant="no-effects"
              leftIcon={
                <RocketIcon color={navbarIcon} w="12px" h="12px" me="0px"/>
              }
          >
            <Text>Sign Up</Text>
          </Button>
        </NavLink>
        <NavLink to="/auth/signin">
          <Button
              fontSize="sm"
              ms="0px"
              px="0px"
              me={{sm: "2px", md: "16px"}}
              color={navbarIcon}
              variant="no-effects"
              leftIcon={
                <DocumentIcon color={navbarIcon} w="12px" h="12px" me="0px"/>
              }
          >
            <Text>Sign In</Text>
          </Button>
        </NavLink>
      </HStack>
  );
  return (
    <Flex
      position={navbarPosition}
      top="16px"
      left="50%"
      transform="translate(-50%, 0px)"
      background={navbarBg}
      border={navbarBorder}
      boxShadow={navbarShadow}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius="15px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
      zIndex="3"
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
        {brand}
        <Box
          ms={{ base: "auto", lg: "0px" }}
          display={{ base: "flex", lg: "none" }}
        >
          <SidebarResponsive
            hamburgerColor={hamburgerColor}
            logoText={props.logoText}
            secondary={props.secondary}
            routes={routes}
            logo={
              <Stack
                direction="row"
                spacing="12px"
                align="center"
                justify="center"
              >
                <Image src={croixRougeLogoHr} w='157px' h='57px' />
              </Stack>
            }
            {...rest}
          />
        </Box>
        {linksAuth}
      </Flex>
    </Flex>
  );
}
