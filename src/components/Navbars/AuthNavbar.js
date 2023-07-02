// Chakra imports
import {
  Button,
  Flex,
  HStack, Image,
  Link, Stack, Text
} from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import croixRougeLogoHr from "../../assets/img/hr_Croix-Rouge_française_Logo.png";
import {FaSignInAlt, FaUserPlus} from "react-icons/fa";

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
  let brand = (
    <Link href={`${process.env.PUBLIC_URL}/#/`} target="_blank" display="flex" lineHeight="100%" fontWeight="bold" justifyContent="center" alignItems="center" color={mainText} >
      <Stack direction="row" spacing="12px" align="center" justify="center">
        <Image src={croixRougeLogoHr} w='157px' h='57px' />
      </Stack>
      <Text fontSize="sm" mt="3px">
        {logoText}
      </Text>
    </Link>
  );
  const linksAuth = (
      <HStack display="flex">
        <NavLink to="/auth/signup">
          <Button fontSize="sm" ms="0px" px="0px" me={{sm: "2px", md: "16px"}} color={navbarIcon} variant="no-effects" leftIcon={<FaUserPlus color={navbarIcon} w="12px" h="12px" me="0px"/>}>
            <Text>Sign Up</Text>
          </Button>
        </NavLink>
        <NavLink to="/auth/signin">
          <Button fontSize="sm" ms="0px" px="0px" me={{sm: "2px", md: "16px"}} color={navbarIcon} variant="no-effects" leftIcon={<FaSignInAlt color={navbarIcon} w="12px" h="12px" me="0px"/>}>
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
      <Flex w="100%" justifyContent="space-between">
        {brand}
        {linksAuth}
      </Flex>
    </Flex>
  );
}
