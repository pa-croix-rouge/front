import {
    Avatar, Button,
    Flex,
    HStack,
    Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    SimpleGrid,
    Text,
    useColorModeValue, useDisclosure
} from "@chakra-ui/react";

import crLogo from "assets/img/croix-rouge/logo-croix-rouge-cercle.png";

import React, {useContext, useState} from "react";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile, getVolunteers} from "../../controller/VolunteerController";
import {getLocalUnit, regenerateLocalUnitCode} from "../../controller/LocalUnitController";
import {PersonIcon} from "../../components/Icons/Icons";

function LocalUnit() {
    const borderProfileColor = useColorModeValue("white", "transparent");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const [luName, setLuName] = useState("");
    const [luId, setLuId] = useState("");
    const [luAddress, setLuAddress] = useState("");
    const [luManager, setLuManager] = useState("");
    const [luSecretCode, setLuSecretCode] = useState("");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
    const [loadedVolunteers, setLoadedVolunteers] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const { isOpen: isOpenRegenerateCodeModal, onOpen: onOpenRegenerateCodeModal, onClose: onCloseRegenerateCodeModal } = useDisclosure();
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const history = useHistory();
    const [callRegenerateCode, setCallRegenerateCode] = useState(false);
    const [regenerateCodeLoading, setRegenerateCodeLoading] = useState(false);

    const loadVolunteer = () => {
        setLoadedVolunteer(true)
        if (token === undefined || token === '') {
            history.push("/auth/signin");
        } else if (volunteer === '') {
            getMyProfile()
                .then((volunteer) => {
                    setVolunteer(volunteer);
                })
                .catch((_) => {
                    setLoadedVolunteer(false);
                });
        }
    }

    const loadLocalUnit = () => {
        setLoadedLocalUnit(true);
        getLocalUnit(volunteer.localUnitId)
            .then((localUnit) => {
                setLuId(localUnit.id);
                setLuName(localUnit.name);
                setLuAddress(localUnit.address.streetNumberAndName + ", " + localUnit.address.postalCode + " " + localUnit.address.city);
                setLuManager(localUnit.managerName);
                setLuSecretCode(localUnit.code);
            })
            .catch((_) => {
                setLoadedLocalUnit(false);
            });
    }

    const loadVolunteers = () => {
        setLoadedVolunteers(true);
        getVolunteers()
            .then((volunteers) => {
                setVolunteers(volunteers);
            })
            .catch((_) => {
                setLoadedVolunteers(false);
            });
    }

    const regenerateCode = () => {
        setCallRegenerateCode(false);
        setRegenerateCodeLoading(true);
        regenerateLocalUnitCode(luId)
            .then((success) => {
                setLoadedLocalUnit(false);
                onCloseRegenerateCodeModal();
                setRegenerateCodeLoading(false);
            })
            .catch((_) => {
            });
    }

    return (
        <>
            {!loadedVolunteer && loadVolunteer()}
            {volunteer && !loadedLocalUnit && loadLocalUnit()}
            {!loadedVolunteers && loadVolunteers()}
            {callRegenerateCode && regenerateCode()}
            <Flex
                direction='column'
                pt={{ base: "120px", md: "75px", lg: "100px" }}>
                <Flex
                    direction={{ sm: "column", md: "row" }}
                    mb='24px'
                    maxH='330px'
                    align='center'
                    backdropFilter='blur(21px)'
                    boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
                    border='1.5px solid'
                    borderColor={borderProfileColor}
                    bg={bgProfile}
                    p='24px'
                    borderRadius='20px'>
                    <HStack spacing='32px'>
                        <Avatar
                            h='96px'
                            w='96px'
                            src={crLogo}/>
                        <Flex
                            direction='column'>
                            <Text
                                fontWeight="bold">
                                {luName}
                            </Text>
                            <Text>
                                {luAddress}
                            </Text>
                        </Flex>
                    </HStack>
                </Flex>
                {volunteer.username !== '' && volunteer.username === luManager && (
                    <Card m="24px 0px">
                        <CardHeader>
                            <Text fontWeight="bold">
                                Information de gestion
                            </Text>
                        </CardHeader>
                        <CardBody>
                            <Flex direction="row" justify="space-between">
                                <Text m="auto 0">
                                    Code d'inscription de l'unité locale: {luSecretCode}
                                </Text>
                                <Button colorScheme="orange" onClick={onOpenRegenerateCodeModal}>
                                    Regénérer le code
                                </Button>
                            </Flex>
                        </CardBody>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <Text fontWeight="bold">
                            Information générales
                        </Text>
                    </CardHeader>
                    <CardBody>
                        <Text>
                            Gérant: {luManager}
                        </Text>
                        <Text>
                            Bénévoles: {volunteers.length}
                        </Text>
                        <SimpleGrid columns={{ sm: 1, md: 3, xl: 6 }} spacing='24px' mb='8px'>
                            {volunteers.map((v, key) => (
                                <Card minH='72px' key={key}>
                                    <Flex direction='row'>
                                        <Icon as={PersonIcon} mr="8px"/>
                                        <Text fontWeight="bold">
                                            {v.firstName} {v.lastName}
                                        </Text>
                                    </Flex>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Flex>
            <Modal isOpen={isOpenRegenerateCodeModal} onClose={onCloseRegenerateCodeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Etes-vous sûr de vouloir regénérer le code d'inscription ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Cette opération doit rester exceptionnelle, toutefois si vous l'estimez nécessaire, vous pouvez regénérer le code d'inscription de votre unité locale.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseRegenerateCodeModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="green" onClick={() => setCallRegenerateCode(true)} isDisabled={regenerateCodeLoading}>
                            Regénérer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LocalUnit;
