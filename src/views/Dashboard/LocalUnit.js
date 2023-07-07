import {
    Avatar, Box, Button, CircularProgress,
    Flex,
    HStack,
    Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    SimpleGrid,
    Text, toast, Tooltip,
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
import {getMyAuthorizations} from "../../controller/RoleController";

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
    const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
    const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
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

    const canReadLocalUnit = () => {
        return volunteerAuthorizations.LOCAL_UNIT?.filter((r) => r === 'READ').length > 0;
    }

    const canUpdateLocalUnit = () => {
        return volunteerAuthorizations.LOCAL_UNIT?.filter((r) => r === 'UPDATE').length > 0;
    }

    const canReadVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'READ').length > 0;
    }

    const canUpdateVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'UPDATE').length > 0;
    }

    const canDeleteVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'DELETE').length > 0;
    }

    return (
        <>
            {volunteer && !loadedLocalUnit && canReadLocalUnit() && loadLocalUnit()}
            {!loadedVolunteers && canReadVolunteer() && loadVolunteers()}
            {callRegenerateCode && regenerateCode()}
            {callValidateVolunteer && selectedVolunteerId !== '' && validateVolunteerAccount(selectedVolunteerId)}
            {callInvalidateVolunteer && selectedVolunteerId !== '' && invalidateVolunteerAccount(selectedVolunteerId)}
            {callDeleteVolunteer && selectedVolunteerId !== '' && deleteVolunteerAccount(selectedVolunteerId)}
            {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
            <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
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
                        <Avatar h='96px' w='96px' src={crLogo}/>
                        {!canReadLocalUnit() && (
                            <Flex direction='column'>
                                <Text fontWeight="bold">
                                    Vous n'avez pas les droits
                                </Text>
                            </Flex>
                        )}
                        {!endLoadingLocalUnit && canReadLocalUnit() && (
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
                        {(!endLoadingLocalUnit && canReadLocalUnit()) || (!endLoadingVolunteers && canReadVolunteer()) && (
                            <CardBody>
                                <CircularProgress isIndeterminate color='green.300'/>
                            </CardBody>
                        )}
                        <CardBody>
                            {endLoadingLocalUnit && (
                                <Flex direction="row" justify="space-between">
                                    <Text m="auto 0">
                                        Code d'inscription de l'unité locale: <i>{luSecretCode}</i>
                                    </Text>
                                    <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateLocalUnit()}>
                                        <Box>
                                            <Button colorScheme="orange" onClick={onOpenRegenerateCodeModal} disabled={!canUpdateLocalUnit()}>
                                                Regénérer le code
                                            </Button>
                                        </Box>
                                    </Tooltip>
                                </Flex>
                            )}
                            {endLoadingVolunteers && (
                                <>
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
                                                    <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateVolunteer()}>
                                                        <Box>
                                                            <IconButton colorScheme="green" aria-label="Valider" icon={<CheckIcon />} onClick={() => setupValidateVolunteer(v.id)} disabled={!canUpdateVolunteer()}/>
                                                        </Box>
                                                    </Tooltip>
                                                    <Tooltip label="Vous n'avez pas les droits" isDisabled={canDeleteVolunteer()}>
                                                        <Box>
                                                            <IconButton colorScheme="red" aria-label="Supprimer" icon={<DeleteIcon />} onClick={() => setupDeleteVolunteer(v.id)} disabled={!canDeleteVolunteer()}/>
                                                        </Box>
                                                    </Tooltip>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </>
                            )}
                        </CardBody>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <Text fontWeight="bold" fontSize="xl">
                            Information générales
                        </Text>
                    </CardHeader>
                    {!endLoadingLocalUnit && !endLoadingVolunteers && (
                        <CardBody>
                            <CircularProgress isIndeterminate color='green.300'/>
                        </CardBody>
                    )}
                    {endLoadingLocalUnit || endLoadingVolunteers && (
                        <CardBody>
                            {!canReadLocalUnit() && (
                                <Text>
                                    Vous n'avez pas les droits de consulter le gérant de l'unité locale
                                </Text>
                            )}
                            {canReadLocalUnit() && (
                                <Text>
                                    Gérant: {luManager}
                                </Text>
                            )}
                            <Text>
                                Bénévoles: {volunteers.filter(v => v.isValidated).length}
                            </Text>
                            {!canReadVolunteer() && (
                                <Text>
                                    Vous n'avez pas les droits
                                </Text>
                            )}
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
                                        {v.username !== '' && volunteer.username === luManager && v.id !== volunteer.id && (
                                            <Flex direction='row' justify="space-evenly" m="8px 0">
                                                <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateVolunteer()}>
                                                    <Box>
                                                        <IconButton colorScheme="gray" aria-label="Bloquer" icon={<FaBan />} onClick={() => setupInvalidateVolunteer(v.id)} disabled={!canDeleteVolunteer()}/>
                                                    </Box>
                                                </Tooltip>
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
