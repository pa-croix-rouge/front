import { BellIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import avatar1 from "./../../assets/img/avatars/avatar1.png";
import avatar2 from "./../../assets/img/avatars/avatar2.png";
import avatar3 from "./../../assets/img/avatars/avatar3.png";
import { ProfileIcon, SettingsIcon } from "../Icons/Icons";
import { ItemContent } from "../Menu/ItemContent";
import { SidebarResponsive } from "../Sidebar/Sidebar";
import React, {useContext, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import routes from "./../../routes.js";
import croixRougeLogoHr from "../../assets/img/hr_Croix-Rouge_française_Logo.png"
import VolunteerContext from "../../contexts/VolunteerContext";
import {getMyProfile} from "../../controller/VolunteerController";
import {FiLogOut} from "react-icons/fi";
import TokenContext from "../../contexts/TokenContext";

export default function HeaderLinks(props) {
  const {
    variant,
    children,
    fixed,
    scrolled,
    secondary,
    onOpen,
    ...rest
  } = props;

  const { colorMode } = useColorMode();
  const {token, setToken} = useContext(TokenContext);
  const [loadedVolunteer, setLoadedVolunteer] = useState(false);
  const {volunteer, setVolunteer} = useContext(VolunteerContext);
  const history = useHistory();
  const { isOpen: isOpenLogout, onOpen: onOpenLogout, onClose: onCloseLogout } = useDisclosure();

  const loadVolunteer = () => {
    setLoadedVolunteer(true);

    const localToken = localStorage.getItem('token');
    if (localToken !== undefined && localToken !== '' && token !== null) {
        setToken(localToken);
    }

    if (token === undefined || token === '' && localToken === undefined || localToken === '') {
      history.push("/auth/signin");
    } else if (volunteer === '') {
      getMyProfile()
          .then((volunteer) => {
            setVolunteer(volunteer);
          })
          .catch((_) => {
            localStorage.removeItem('token');
            history.push("/auth/signin");
          });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setVolunteer('');
    setToken('');
    history.push("/auth/signin");
  }

  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  let menuBg = useColorModeValue("white", "navy.800");
  if (secondary) {
    navbarIcon = "white";
  }
  return (
      <>
        {!loadedVolunteer && loadVolunteer()}
        <Flex
            pe={{ sm: "0px", md: "16px" }}
            w={{ sm: "100%", md: "auto" }}
            alignItems='center'
            flexDirection='row'>
          {volunteer === '' && (
              <NavLink to='/auth/signin'>
                <Button
                    ms='0px'
                    px='0px'
                    me={{ sm: "2px", md: "16px" }}
                    color={navbarIcon}
                    variant='no-effects'
                    leftIcon={<ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />}>
                  <Text display={{ sm: "none", md: "flex" }}>Sign In</Text>
                </Button>
              </NavLink>
          )}
          {volunteer !== '' && (
              <Button
                  ms='0px'
                  px='0px'
                  me={{ sm: "2px", md: "16px" }}
                  color={navbarIcon}
                  variant='no-effects'
                  leftIcon={<Icon as={FiLogOut} w='22px' h='22px' me='0px' />}
                  onClick={onOpenLogout}>
                <Text display={{ sm: "none", md: "flex" }}>{volunteer.username}</Text>
              </Button>
          )}
          <SidebarResponsive
              hamburgerColor={"white"}
              logo={
                <Stack direction='row' spacing='12px' align='center' justify='center'>
                  <Image src={croixRougeLogoHr} w='157px' h='57px' />
                </Stack>
              }
              colorMode={colorMode}
              secondary={props.secondary}
              routes={routes}
              {...rest}
          />
          <SettingsIcon
              cursor='pointer'
              ms={{ base: "16px", xl: "0px" }}
              me='16px'
              onClick={props.onOpen}
              color={navbarIcon}
              w='18px'
              h='18px'
          />
          <Menu>
            <MenuButton>
              <BellIcon color={navbarIcon} w='18px' h='18px' />
            </MenuButton>
            <MenuList p='16px 8px' bg={menuBg}>
              <Flex flexDirection='column'>
                <MenuItem borderRadius='8px' mb='10px'>
                  <ItemContent
                      time='13 minutes ago'
                      info='from Alicia'
                      boldInfo='New Message'
                      aName='Alicia'
                      aSrc={avatar1}
                  />
                </MenuItem>
                <MenuItem borderRadius='8px' mb='10px'>
                  <ItemContent
                      time='2 days ago'
                      info='by Josh Henry'
                      boldInfo='New Album'
                      aName='Josh Henry'
                      aSrc={avatar2}
                  />
                </MenuItem>
                <MenuItem borderRadius='8px'>
                  <ItemContent
                      time='3 days ago'
                      info='Payment succesfully completed!'
                      boldInfo=''
                      aName='Kara'
                      aSrc={avatar3}
                  />
                </MenuItem>
              </Flex>
            </MenuList>
          </Menu>
        </Flex>
        <Modal isOpen={isOpenLogout} onClose={onCloseLogout}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Déconnexion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Voulez-vous vous déconnecter ?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onCloseLogout}>
                Annuler
              </Button>
              <Button variant="outline" colorScheme="red" onClick={handleLogout}>Déconnexion</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}
