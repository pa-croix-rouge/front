import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import {
    Box,
    Button,
    Flex,
    Icon,
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
    Progress,
    Skeleton,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Switch,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead, Tooltip,
    Tr,
    useColorModeValue,
    useDisclosure, useToast
} from "@chakra-ui/react";
import CardBody from "../../../components/Card/CardBody";
import React, {useContext, useEffect, useState} from "react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getVolunteerById, getVolunteers} from "../../../controller/VolunteerController";
import {
    deleteEventById,
    deleteEventSessions,
    getEventForTrimester,
    getEventSessions
} from "../../../controller/EventController";
import {FaArrowLeft, FaArrowRight, FaCog, FaEye, FaPencilAlt, FaTrashAlt, FaUser} from "react-icons/fa";
import TimelineRow from "../../../components/Tables/TimelineRow";
import {CalendarIcon, CheckIcon} from "@chakra-ui/icons";
import EventCreation from "./EventCreation";
import EventViewer from "./EventViewer";
import EventEdition from "./EventEdition";
import EventContext from "../../../contexts/EventContext";
import {getMyAuthorizations} from "../../../controller/RoleController";

export default function ManageEvents() {
    // Component variables
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    // Data variables
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);
    const [events, setEvents] = useState([]);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadVolunteerList, setLoadVolunteerList] = useState(false);
    const [volunteerList, setVolunteerList] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    // Modal variables
    const [selectedEvent, setSelectedEvent] = useState(undefined);
    const [selectedEventSessionId, setSelectedEventSessionId] = useState(undefined);
    const [eventSessions, setEventSessions] = useState([]);
    const {isOpen: isOpenVisualizationModal, onOpen: onOpenVisualizationModal, onClose: onCloseVisualizationModal} = useDisclosure();
    const {isOpen: isOpenCreationModal, onOpen: onOpenCreationModal, onClose: onCloseCreationModal} = useDisclosure();
    const {isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal} = useDisclosure();
    const [modifiedEvent, setModifiedEvent] = useState(undefined);
    const {isOpen: isOpenDeletionModal, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal} = useDisclosure();
    const [callDeleteEvent, setCallDeleteEvent] = useState(false);
    const [isCallingDeleteEvent, setIsCallingDeleteEvent] = useState(false);
    const {isOpen: isOpenDeletionAllModal, onOpen: onOpenDeletionAllModal, onClose: onCloseDeletionAllModal} = useDisclosure();
    const [deleteAllSessions, setDeleteAllSessions] = useState(false);
    const [callDeleteAllSessions, setCallDeleteAllSessions] = useState(false);
    const [isCallingDeleteAllSessions, setIsCallingDeleteAllSessions] = useState(false);
    const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
    const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (selectedEvent !== modifiedEvent) {
            setModifiedEvent(selectedEvent);
        }
    }, [selectedEvent]);

    useEffect(() => {
        setLoadedEvents(false);
    }, [currentMonth, currentYear]);

    const resetToCurrentMonth = () => {
        setCurrentYear(new Date().getFullYear());
        setCurrentMonth(new Date().getMonth() + 1);
    }

    const setToPreviousMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    const setToPrevious3Months = () => {
        if (currentMonth === 1) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(10);
        } else if (currentMonth === 2) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else if (currentMonth === 3) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(currentMonth - 3);
        }
    }

    const setToNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    const setToNext3Months = () => {
        if (currentMonth === 10) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(1);
        } else if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(2);
        } else if (currentMonth === 12) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(3);
        } else {
            setCurrentMonth(currentMonth + 3);
        }
    }

    const loadEvents = () => {
        setLoadingEvents(true);
        getEventForTrimester(volunteer.localUnitId, currentMonth, currentYear)
            .then((eventList) => {
                setLoadingEvents(false);
                setEvents(eventList);
                setLoadedEvents(true);
                // const allReferrersId = eventList.map((el) => el.referrerId);
                // setReferrersId(Array.from(new Set(allReferrersId)));
            })
            .catch((err) => {
                setLoadingEvents(false);
                setTimeout(() => {setLoadedEvents(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des événements.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const loadReferrersName = () => {
        setLoadedReferrers(true);
        referrersId.forEach(el => {
            getVolunteerById(el)
                .then((volunteer) => {
                    setReferrersName([...referrersName, volunteer.firstName + ' ' + volunteer.lastName]);
                })
                .catch((_) => {
                    setTimeout(() => {setLoadedReferrers(false)}, 3000);
                    toast({
                        title: 'Erreur',
                        description: "Echec du chargement des référents.",
                        status: 'error',
                        duration: 10_000,
                        isClosable: true,
                    });
                });
        });
    }

    const loadVolunteers = () => {
        setLoadVolunteerList(true);
        getVolunteers()
            .then((volunteers) => {
                setVolunteerList(volunteers);
            })
            .catch((_) => {
                setTimeout(() => {setLoadVolunteerList(false)}, 3000);
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

    const selectEventForModal = (event, onOpenModal) => {
        setSelectedEventSessionId(event);
        setSelectedEvent(events.find((el) => el.sessionId === event));
        onOpenModal();
    }

    const onNewEvent = (eventId) => {
        setLoadedEvents(false);
    }

    const deleteEvent = () => {
        setCallDeleteEvent(false);
        setIsCallingDeleteEvent(true);
        if (selectedEvent !== undefined) {
            const eventId = selectedEvent.eventId;
            const sessionId = selectedEvent.sessionId;
            deleteEventById(eventId, sessionId)
                .then(() => {
                    onCloseDeletionAllModal();
                    onCloseDeletionModal();
                    setSelectedEvent(undefined);
                    setEvents(events.filter((el) => el.id !== eventId));
                    setIsCallingDeleteEvent(false);
                    setLoadedEvents(false);
                })
                .catch((_) => {
                    setIsCallingDeleteEvent(false);
                    toast({
                        title: 'Erreur',
                        description: "Echec de la suppression de l'événement. Veuillez réessayer plus tard.",
                        status: 'error',
                        duration: 10_000,
                        isClosable: true,
                    });
                });
        }
    }

    const deleteAllEventSessions = () => {
        setCallDeleteAllSessions(false);
        setIsCallingDeleteAllSessions(true);
        if (selectedEvent !== undefined) {
            const eventId = selectedEvent.eventId;
            deleteEventSessions(eventId)
                .then(() => {
                    onCloseDeletionAllModal();
                    onCloseDeletionModal();
                    setSelectedEvent(undefined);
                    setEvents(events.filter((el) => el.id !== eventId));
                    setLoadedEvents(false);
                    setDeleteAllSessions(false);
                    setIsCallingDeleteAllSessions(false);
                })
                .catch((_) => {
                    setIsCallingDeleteAllSessions(false);
                    toast({
                        title: 'Erreur',
                        description: "Echec de la suppression de l'événement récurrent. Veuillez réessayer plus tard.",
                        status: 'error',
                        duration: 10_000,
                        isClosable: true,
                    });
                });
        }
    }

    const getTableMonthBody = (month) => {
        const filteredEvent = events.filter(e => e.startDate.getMonth() === (month));
        return (
            <>
                <Tr>
                    {month >= 12 && (
                        <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                            {currentYear + 1} - {(new Date(currentYear + 1, (month) % 12)).toLocaleString('fr-FR', {month: 'long'})}
                        </Td>
                    )}
                    {month < 0 && (
                        <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                            {currentYear - 1} - {(new Date(currentYear - 1, (month) % 12)).toLocaleString('fr-FR', {month: 'long'})}
                        </Td>
                    )}
                    {month < 12 && month >= 0 && (
                        <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                            {currentYear} - {(new Date(currentYear, (month) % 12)).toLocaleString('fr-FR', {month: 'long'})}
                        </Td>
                    )}
                </Tr>
                {filteredEvent.map((event, index, arr) => {
                    return (
                        <Tr key={index}>
                            <Td pl="0px" borderColor={borderColor} borderBottom={index === arr.length - 1 ? "none" : null}>
                                <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                    <Text fontSize="md" fontWeight="bold" color="orange.500" m="auto">
                                        {event.startDate.getDate()}
                                    </Text>
                                </Flex>
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length - 1 ? "none" : null}>
                                <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                    <Text fontSize="md" color={textColor} fontWeight="bold">
                                        {event.name}
                                    </Text>
                                </Flex>
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                <Text>
                                    {event.description}
                                </Text>
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                {!canReadVolunteer() && (
                                    <Tooltip label="Vous n'avez pas les droits">
                                        <Text color="transparent" textShadow="0 0 8px #000">
                                            James bond
                                        </Text>
                                    </Tooltip>
                                )}
                                {volunteerList.length === 0 && canReadVolunteer() && (
                                    <Text>
                                        {event.referrerId}
                                    </Text>
                                )}
                                {volunteerList.length !== 0 && (
                                    <Text>
                                        {volunteerList.filter(v => v.id === event.referrerId)[0].firstName + ' ' + volunteerList.filter(v => v.id === event.referrerId)[0].lastName}
                                    </Text>
                                )}
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                <Text>
                                    {event.startDate.toLocaleString().substring(11, 16).replace(":", "h")}
                                </Text>
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                <Text>
                                    {event.numberOfParticipants} / {event.maxParticipants}
                                </Text>
                                {event.maxParticipants === 0 && (
                                    <Flex direction="column">
                                        <Text fontSize="md" color="red" fontWeight="bold" pb=".2rem">100%</Text>
                                        <Progress colorScheme="red" size="xs" value={100} borderRadius="15px" />
                                    </Flex>
                                )}
                                {event.maxParticipants !== 0 && (
                                    <Flex direction="column">
                                        <Text fontSize="md" color={(event.numberOfParticipants / event.maxParticipants) * 100 < 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 < 85 ? "orange" : "red"} fontWeight="bold" pb=".2rem">{`${(event.numberOfParticipants / event.maxParticipants * 100).toFixed(1)}%`}</Text>
                                        <Progress colorScheme={(event.numberOfParticipants / event.maxParticipants) * 100 < 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 < 85 ? "orange" : "red"} size="xs" value={event.numberOfParticipants / event.maxParticipants * 100} borderRadius="15px" />
                                    </Flex>
                                )}
                            </Td>
                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                <Menu>
                                    <MenuButton>
                                        <Icon as={FaCog}/>
                                    </MenuButton>
                                    <MenuList>
                                        <Flex direction="column">
                                            <MenuItem onClick={() => selectEventForModal(event.sessionId, onOpenVisualizationModal)}>
                                                <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                    <Icon as={FaEye} mr="8px"/>
                                                    <Text fontSize="sm" fontWeight="semibold">
                                                        Consulter
                                                    </Text>
                                                </Flex>
                                            </MenuItem>
                                            <MenuItem onClick={() => selectEventForModal(event.sessionId, onOpenEditionModal)} isDisabled={event.startDate.getTime() < Date.now() || !canUpdateEvent()}>
                                                <Tooltip label={event.startDate.getTime() < Date.now() ? "L'événement est dans le passé" : "Vous n'avez pas les droits"} isDisabled={canUpdateEvent() && event.startDate.getTime() > Date.now()}>
                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                        <Icon as={FaPencilAlt} mr="8px"/>
                                                        <Text fontSize="sm" fontWeight="semibold">
                                                            Modifier
                                                        </Text>
                                                    </Flex>
                                                </Tooltip>
                                            </MenuItem>
                                            <MenuItem onClick={() => selectEventForModal(event.sessionId, onOpenDeletionModal)} isDisabled={event.startDate.getTime() < Date.now() || !canDeleteEvent()}>
                                                <Tooltip label={event.startDate.getTime() < Date.now() ? "L'événement est dans le passé" : "Vous n'avez pas les droits"} isDisabled={canDeleteEvent() && event.startDate.getTime() > Date.now()}>
                                                    <Flex cursor="pointer" align="center" p="12px">
                                                        <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                                                        <Text fontSize="sm" fontWeight="semibold" color="red.500">
                                                            Supprimer
                                                        </Text>
                                                    </Flex>
                                                </Tooltip>
                                            </MenuItem>
                                        </Flex>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    );
                })}
                {filteredEvent.length === 0 && (
                    <Tr>
                        <Td colSpan="8" textAlign="center">
                            Aucun événement ce mois-ci
                        </Td>
                    </Tr>
                )}
            </>
        );
    }

    const reloadEvents = () => {
        setLoadedEvents(false);
        setLoadedReferrers(false);
        setLoadVolunteerList(false);
    }

    const openDeleteEventModal = () => {
        onOpenDeletionAllModal();
        setEventSessions([]);
        const eventId = selectedEvent.eventId;
        getEventSessions(eventId)
            .then((sessions) => {
                setEventSessions(sessions);
            })
            .catch((_) => {
                toast({
                    title: "Erreur lors de la récupération des sessions de l'événement",
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                });
            });
    }

    const canReadVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'READ').length > 0;
    }

    const canAddEvent = () => {
        return volunteerAuthorizations.EVENT?.filter((r) => r === 'CREATE').length > 0;
    }

    const canUpdateEvent = () => {
        return volunteerAuthorizations.EVENT?.filter((r) => r === 'UPDATE').length > 0;
    }

    const canDeleteEvent = () => {
        return volunteerAuthorizations.EVENT?.filter((r) => r === 'DELETE').length > 0;
    }

    return (
        <EventContext.Provider value={{events, setEvents, reloadEvents}}>
            <Flex direction="column" pt={{base: "120px", md: "75px"}}>
                {!loadedEvents && !loadingEvents && volunteer && loadEvents()}
                {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
                {!loadVolunteerList && canReadVolunteer() && loadVolunteers()}
                {selectedEvent !== undefined && callDeleteEvent && deleteEvent()}
                {selectedEvent !== undefined && callDeleteAllSessions && deleteAllEventSessions()}
                {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
                <Card overflowX={{sm: "scroll", xl: "hidden"}} pb="0px">
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex direction='row' justifyContent="space-between">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                Gestion des événements
                            </Text>
                            <Tooltip label="Vous n'avez pas les droits" isDisabled={canAddEvent()}>
                                <Box>
                                    <Button p="0px" colorScheme="green" onClick={onOpenCreationModal} disabled={!canAddEvent()}>
                                        <Flex cursor="pointer" align="center" p="12px">
                                            <Text fontSize="sm" fontWeight="semibold">
                                                Ajouter un événement
                                            </Text>
                                        </Flex>
                                    </Button>
                                </Box>
                            </Tooltip>
                            <Button onClick={setToPrevious3Months}>
                                <Flex cursor="pointer" align="center">
                                    <Icon as={FaArrowLeft} mr="8px"/>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        3 précédents
                                    </Text>
                                </Flex>
                            </Button>
                            <Button onClick={setToPreviousMonth}>
                                <Flex cursor="pointer" align="center">
                                    <Icon as={FaArrowLeft} mr="8px"/>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Précédent
                                    </Text>
                                </Flex>
                            </Button>
                            <Button onClick={resetToCurrentMonth}>
                                <Flex cursor="pointer" align="center">
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Mois actuel
                                    </Text>
                                </Flex>
                            </Button>
                            <Button onClick={setToNextMonth}>
                                <Flex cursor="pointer" align="center">
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Suivant
                                    </Text>
                                    <Icon as={FaArrowRight} ml="8px"/>
                                </Flex>
                            </Button>
                            <Button onClick={setToNext3Months}>
                                <Flex cursor="pointer" align="center">
                                    <Text fontSize="sm" fontWeight="semibold">
                                        3 suivants
                                    </Text>
                                    <Icon as={FaArrowRight} ml="8px"/>
                                </Flex>
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Skeleton isLoaded={loadedEvents}>
                        <Table variant="simple" color={textColor}>
                            <Thead>
                                <Tr my=".8rem" pl="0px" color="gray.400">
                                    <Th pl="0px" borderColor={borderColor} color="gray.400">Jour</Th>
                                    <Th borderColor={borderColor} color="gray.400">Nom</Th>
                                    <Th borderColor={borderColor} color="gray.400">Description</Th>
                                    <Th borderColor={borderColor} color="gray.400">Référent</Th>
                                    <Th borderColor={borderColor} color="gray.400">Horaire</Th>
                                    <Th borderColor={borderColor} color="gray.400">Inscriptions</Th>
                                    <Th borderColor={borderColor}></Th>
                                </Tr>
                            </Thead>
                                <Tbody>
                                    {getTableMonthBody(currentMonth - 1)}
                                    {getTableMonthBody(currentMonth)}
                                    {getTableMonthBody(currentMonth + 1)}
                                </Tbody>
                        </Table>
                        </Skeleton>
                    </CardBody>
                </Card>
            </Flex>

            <EventCreation isOpen={isOpenCreationModal} onClose={onCloseCreationModal} volunteers={volunteerList} onNewEvent={onNewEvent}> </EventCreation>

            <EventViewer isOpen={isOpenVisualizationModal} onClose={onCloseVisualizationModal} volunteers={volunteerList} eventSessionId={selectedEventSessionId}></EventViewer>

            <EventEdition isOpen={isOpenEditionModal} onClose={onCloseEditionModal} volunteers={volunteerList} eventSessionId={selectedEventSessionId}></EventEdition>

            <Modal isOpen={isOpenDeletionModal} onClose={onCloseDeletionModal} size="xl" isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de l'événement</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex direction="column">
                            {selectedEvent !== undefined && (
                                <Stat>
                                    <StatLabel>{selectedEvent.name} le {selectedEvent.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</StatLabel>
                                    <StatNumber><Icon
                                        as={FaUser}/> {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants} participants</StatNumber>
                                    {volunteerList.length === 0 && (
                                        <StatHelpText>
                                            {selectedEvent.referrerId}
                                        </StatHelpText>
                                    )}
                                    {volunteerList.length !== 0 && (
                                        <StatHelpText>
                                            {volunteerList.filter(v => v.id === selectedEvent.referrerId)[0].firstName + ' ' + volunteerList.filter(v => v.id === selectedEvent.referrerId)[0].lastName}
                                        </StatHelpText>
                                    )}
                                </Stat>
                            )}
                            {selectedEvent !== undefined && selectedEvent.recurring && (
                                <Flex direction="column" mt="4px" mb="4px">
                                    <Text>Supprimer la suite d'événements ?</Text>
                                    <Flex direction="row" mt="4px" mb="4px" align="center">
                                        <Switch size="md" onChange={() => setDeleteAllSessions(!deleteAllSessions)}
                                                mr="8px" isChecked={deleteAllSessions}/>
                                        <Text>
                                            {deleteAllSessions ? "Oui supprimer tout les événements récurrent associés" : "Non supprimer cet événement uniquement"}
                                        </Text>
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseDeletionModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="red" disabled={isCallingDeleteEvent} onClick={() => {deleteAllSessions ? openDeleteEventModal() : setCallDeleteEvent(true);}}>
                            Supprimer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenDeletionAllModal} onClose={onCloseDeletionAllModal} size="xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de {eventSessions.length} événements</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {eventSessions.length === 0 && (
                            <Progress isIndeterminate="true" />
                        )}
                        {eventSessions.map((event, index, arr) => {
                            return (
                                <TimelineRow
                                    logo={event.endDate.getTime() < Date.now() ? CheckIcon : CalendarIcon}
                                    title={event.name}
                                    date={event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                    color={event.endDate.getTime() < Date.now() ? "green.500" : "blue.500"}
                                    index={index}
                                    arrLength={arr.length}
                                />
                            )
                        })}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseDeletionAllModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="red" onClick={() => setCallDeleteAllSessions(true)} disabled={isCallingDeleteAllSessions}>
                            Supprimer tout les événements
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </EventContext.Provider>
    )
}
