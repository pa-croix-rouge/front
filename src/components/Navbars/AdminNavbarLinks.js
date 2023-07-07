import {
    Button,
    Flex,
    Icon,
    Image,
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
import {ProfileIcon} from "../Icons/Icons";
import {SidebarResponsive} from "../Sidebar/Sidebar";
import React, {useContext, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import routes from "./../../routes.js";
import croixRougeLogoHr from "../../assets/img/hr_Croix-Rouge_française_Logo.png"
import VolunteerContext from "../../contexts/VolunteerContext";
import {getMyProfile} from "../../controller/VolunteerController";
import {FiLogOut} from "react-icons/fi";
import TokenContext from "../../contexts/TokenContext";
import LocalUnitContext from "../../contexts/LocalUnitContext";
import {getLocalUnit} from "../../controller/LocalUnitController";

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

    const {colorMode} = useColorMode();
    const {token, setToken} = useContext(TokenContext);
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const {localUnit, setLocalUnit} = useContext(LocalUnitContext);
    const history = useHistory();
    const {isOpen: isOpenLogout, onOpen: onOpenLogout, onClose: onCloseLogout} = useDisclosure();

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
                    getLocalUnit(volunteer.localUnitId)
                        .then((localUnit) => {
                            setLocalUnit(localUnit);
                        }).catch((_) => {
                        localStorage.removeItem('token');
                        history.push("/auth/signin");
                    });
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
    if (secondary) {
        navbarIcon = "white";
    }
    return (
        <>
            {!loadedVolunteer && loadVolunteer()}
            <Flex
                pe={{sm: "0px", md: "16px"}}
                w={{sm: "100%", md: "auto"}}
                alignItems='center'
                flexDirection='row'>
                {volunteer === '' && (
                    <NavLink to='/auth/signin'>
                        <Button
                            ms='0px'
                            px='0px'
                            me={{sm: "2px", md: "16px"}}
                            color={navbarIcon}
                            variant='no-effects'
                            leftIcon={<ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px'/>}>
                            <Text display={{sm: "none", md: "flex"}}>Sign In</Text>
                        </Button>
                    </NavLink>
                )}
                {volunteer !== '' && (
                    <Button
                        ms='0px'
                        px='0px'
                        me={{sm: "2px", md: "16px"}}
                        color={navbarIcon}
                        variant='no-effects'
                        rightIcon={<Icon as={FiLogOut} w='22px' h='22px' me='0px'/>}
                        onClick={onOpenLogout}>
                        <Text display={{sm: "none", md: "flex"}}>{volunteer.username}</Text>
                    </Button>
                )}
                <SidebarResponsive
                    hamburgerColor={"white"}
                    logo={
                        <Stack direction='row' spacing='12px' align='center' justify='center'>
                            <Image src={croixRougeLogoHr} w='157px' h='57px'/>
                        </Stack>
                    }
                    colorMode={colorMode}
                    secondary={props.secondary}
                    routes={routes}
                    {...rest}
                />
            </Flex>
            <Modal isOpen={isOpenLogout} onClose={onCloseLogout}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Déconnexion</ModalHeader>
                    <ModalCloseButton/>
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
