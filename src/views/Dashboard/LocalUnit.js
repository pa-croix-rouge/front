import {
    Avatar, Button, CircularProgress,
    Flex,
    HStack,
    Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    SimpleGrid,
    Text, toast,
    useColorModeValue, useDisclosure, useToast
} from "@chakra-ui/react";

import crLogo from "assets/img/croix-rouge/logo-croix-rouge-cercle.png";

import React, {useContext, useState} from "react";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import VolunteerContext from "../../contexts/VolunteerContext";
import {
    deleteVolunteer,
    getVolunteers,
    invalidateVolunteer,
    validateVolunteer
} from "../../controller/VolunteerController";
import {getLocalUnit, regenerateLocalUnitCode} from "../../controller/LocalUnitController";
import {CheckIcon, DeleteIcon, EmailIcon, PhoneIcon} from "@chakra-ui/icons";
import {FaBan} from "react-icons/fa";

function LocalUnit() {
    const borderProfileColor = useColorModeValue("white", "transparent");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const [luName, setLuName] = useState("");
    const [luId, setLuId] = useState("");
    const [luAddress, setLuAddress] = useState("");
    const [luManager, setLuManager] = useState("");
    const [luSecretCode, setLuSecretCode] = useState("");
    const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
    const [endLoadingLocalUnit, setEndLoadingLocalUnit] = useState(false);
    const [loadedVolunteers, setLoadedVolunteers] = useState(false);
    const [endLoadingVolunteers, setEndLoadingVolunteers] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const { isOpen: isOpenRegenerateCodeModal, onOpen: onOpenRegenerateCodeModal, onClose: onCloseRegenerateCodeModal } = useDisclosure();
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [callRegenerateCode, setCallRegenerateCode] = useState(false);
    const [regenerateCodeLoading, setRegenerateCodeLoading] = useState(false);
    const [callValidateVolunteer, setCallValidateVolunteer] = useState(false);
    const [callInvalidateVolunteer, setCallInvalidateVolunteer] = useState(false);
    const [callDeleteVolunteer, setCallDeleteVolunteer] = useState(false);
    const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
    const toast = useToast();

    const loadLocalUnit = () => {
        setLoadedLocalUnit(true);
        getLocalUnit(volunteer.localUnitId)
            .then((localUnit) => {
                setLuId(localUnit.id);
                setLuName(localUnit.name);
                setLuAddress(localUnit.address.streetNumberAndName + ", " + localUnit.address.postalCode + " " + localUnit.address.city);
                setLuManager(localUnit.managerName);
                setLuSecretCode(localUnit.code);
                setEndLoadingLocalUnit(true);
            })
            .catch((_) => {
                setTimeout(() => {setLoadedLocalUnit(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement de l'unité locale.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const loadVolunteers = () => {
        setLoadedVolunteers(true);
        getVolunteers()
            .then((volunteers) => {
                setVolunteers(volunteers);
                setEndLoadingVolunteers(true);
            })
            .catch((_) => {
                setTimeout(() => {setLoadedVolunteers(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des volontaires.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const regenerateCode = () => {
        setCallRegenerateCode(false);
        setRegenerateCodeLoading(true);
        regenerateLocalUnitCode(luId)
            .then((_) => {
                setLoadedLocalUnit(false);
                onCloseRegenerateCodeModal();
                setRegenerateCodeLoading(false);
            })
            .catch((_) => {
                setRegenerateCodeLoading(false);
                toast({
                    title: 'Erreur',
                    description: "Echec de regénération du code, veuillez réessayer plus tard.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const setupValidateVolunteer = (volunteerId) => {
        setSelectedVolunteerId(volunteerId);
        setCallValidateVolunteer(true);
    }

    const setupInvalidateVolunteer = (volunteerId) => {
        setSelectedVolunteerId(volunteerId);
        setCallInvalidateVolunteer(true);
    }

    const setupDeleteVolunteer = (volunteerId) => {
        setSelectedVolunteerId(volunteerId);
        setCallDeleteVolunteer(true);
    }

    const validateVolunteerAccount = (volunteerId) => {
        setCallValidateVolunteer(false);
        validateVolunteer(volunteerId)
            .then((_) => {
                setSelectedVolunteerId('')
                setLoadedVolunteers(false);
            }).catch((_) => {
                toast({
                    title: 'Erreur',
                    description: "Echec de validation du volontaire, veuillez réessayer plus tard.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const invalidateVolunteerAccount = (volunteerId) => {
        setCallInvalidateVolunteer(false);
        invalidateVolunteer(volunteerId)
            .then((_) => {
                setSelectedVolunteerId('')
                setLoadedVolunteers(false);
            }).catch((_) => {
            toast({
                title: 'Erreur',
                description: "Echec d'invalidation du volontaire, veuillez réessayer plus tard.",
                status: 'error',
                duration: 10_000,
                isClosable: true,
            });
            });
    }

    const deleteVolunteerAccount = (volunteerId) => {
        setCallDeleteVolunteer(false);
        deleteVolunteer(volunteerId)
            .then((_) => {
                setSelectedVolunteerId('')
                setLoadedVolunteers(false);
            }).catch((_) => {
            toast({
                title: 'Erreur',
                description: "Echec de suppréssion du volontaire, veuillez réessayer plus tard.",
                status: 'error',
                duration: 10_000,
                isClosable: true,
            });
            });
    }

    return (
        <>
            {volunteer && !loadedLocalUnit && loadLocalUnit()}
            {!loadedVolunteers && loadVolunteers()}
            {callRegenerateCode && regenerateCode()}
            {callValidateVolunteer && selectedVolunteerId !== '' && validateVolunteerAccount(selectedVolunteerId)}
            {callInvalidateVolunteer && selectedVolunteerId !== '' && invalidateVolunteerAccount(selectedVolunteerId)}
            {callDeleteVolunteer && selectedVolunteerId !== '' && deleteVolunteerAccount(selectedVolunteerId)}
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
                        {!endLoadingLocalUnit && (
                            <CircularProgress isIndeterminate color='green.300'/>
                        )}
                        {endLoadingLocalUnit && (
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
                        )}
                    </HStack>
                </Flex>
                {volunteer.username !== '' && volunteer.username === luManager && (
                    <Card m="24px 0px">
                        <CardHeader>
                            <Text fontWeight="bold" fontSize="xl">
                                Information de gestion
                            </Text>
                        </CardHeader>
                        {!endLoadingLocalUnit || !endLoadingVolunteers && (
                            <CardBody>
                                <CircularProgress isIndeterminate color='green.300'/>
                            </CardBody>
                        )}
                        {endLoadingLocalUnit && endLoadingVolunteers && (
                            <CardBody>
                                <Flex direction="row" justify="space-between">
                                    <Text m="auto 0">
                                        Code d'inscription de l'unité locale: <i>{luSecretCode}</i>
                                    </Text>
                                    <Button colorScheme="orange" onClick={onOpenRegenerateCodeModal}>
                                        Regénérer le code
                                    </Button>
                                </Flex>
                                <Text fontWeight="semibold" mt="8px">
                                    Comptes en attentes de validation
                                </Text>
                                {volunteers.filter(v => !v.isValidated).length === 0 && (
                                    <Text textAlign="center">
                                        Aucune demande en attente
                                    </Text>
                                )}
                                <SimpleGrid columns={{ sm: 1, md: 3, xl: 5 }} spacing='24px' mb='8px'>
                                    {volunteers.filter(v => !v.isValidated).map((v, key) => (
                                        <Card minH='72px' key={key}>
                                            <Text fontWeight="bold" textAlign="center">
                                                {v.firstName} {v.lastName}
                                            </Text>
                                            <Flex direction='row' m="4px 0">
                                                <Icon as={EmailIcon} mr="8px"/>
                                                <Text>
                                                    {v.username}
                                                </Text>
                                            </Flex>
                                            <Flex direction='row' m="4px 0">
                                                <Icon as={PhoneIcon} mr="8px"/>
                                                <Text>
                                                    {v.phoneNumber}
                                                </Text>
                                            </Flex>
                                            <Flex direction='row' justify="space-evenly" m="8px 0">
                                                <IconButton colorScheme="green" aria-label="Valider" icon={<CheckIcon />} onClick={() => setupValidateVolunteer(v.id)}/>
                                                <IconButton colorScheme="red" aria-label="Supprimer" icon={<DeleteIcon />} onClick={() => setupDeleteVolunteer(v.id)}/>
                                            </Flex>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        )}
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <Text fontWeight="bold" fontSize="xl">
                            Information générales
                        </Text>
                    </CardHeader>
                    {!endLoadingLocalUnit || !endLoadingVolunteers && (
                        <CardBody>
                            <CircularProgress isIndeterminate color='green.300'/>
                        </CardBody>
                    )}
                    {endLoadingLocalUnit && endLoadingVolunteers && (
                        <CardBody>
                            <Text>
                                Gérant: {luManager}
                            </Text>
                            <Text>
                                Bénévoles: {volunteers.filter(v => v.isValidated).length}
                            </Text>
                            <SimpleGrid columns={{ sm: 1, md: 3, xl: 5 }} spacing='24px' mb='8px'>
                                {volunteers.filter(v => v.isValidated).map((v, key) => (
                                    <Card minH='72px' key={key}>
                                        <Text fontWeight="bold" textAlign="center">
                                            {v.firstName} {v.lastName}
                                        </Text>
                                        <Flex direction='row' m="4px 0">
                                            <Icon as={EmailIcon} mr="8px"/>
                                            <Text>
                                                {v.username}
                                            </Text>
                                        </Flex>
                                        <Flex direction='row' m="4px 0">
                                            <Icon as={PhoneIcon} mr="8px"/>
                                            <Text>
                                                {v.phoneNumber}
                                            </Text>
                                        </Flex>
                                        {volunteer.username !== '' && volunteer.username === luManager && (
                                            <Flex direction='row' justify="space-evenly" m="8px 0">
                                                <IconButton colorScheme="gray" aria-label="Bloquer" icon={<FaBan />} onClick={() => setupInvalidateVolunteer(v.id)}/>
                                            </Flex>
                                        )}
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </CardBody>
                    )}
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
