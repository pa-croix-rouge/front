import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon, Input, Menu, MenuButton, MenuItem, MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
    Progress, Radio, RadioGroup, Select, SimpleGrid,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Switch,
    Table,
    Tbody,
    Td,
    Text, Textarea,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import CardBody from "../../../components/Card/CardBody";
import React, {useContext, useEffect, useState} from "react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getVolunteerById, getVolunteers} from "../../../controller/VolunteerController";
import {
    createRecurrentEvent,
    createSingleEvent,
    deleteEventById,
    deleteEventSessions,
    getEventForTrimester,
    getEventSessions, updateAllEventSessions,
    updateEventSession
} from "../../../controller/EventController";
import {FaArrowRight, FaPencilAlt, FaPlus, FaTrashAlt, FaUser, FaEye, FaArrowLeft, FaCog} from "react-icons/fa";
import TimelineRow from "../../../components/Tables/TimelineRow";
import {CalendarIcon, CheckIcon} from "@chakra-ui/icons";
import {SingleEventCreation} from "../../../model/event/SingleEventCreation";
import {RecurrentEventCreation} from "../../../model/event/RecurrentEventCreation";
import EventCreation from "./EventCreation";
import EventViewer from "./EventViewer";
import EventEdition from "./EventEdition";

export default function ManageEvents() {
    // Component variables
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    // Data variables
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);
    const [events, setEvents] = useState([]);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadVolunteerList, setLoadVolunteerList] = useState(false);
    const [volunteerList, setVolunteerList] = useState([]);
    const [volunteerNameList, setVolunteerNameList] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    // Modal variables
    const [selectedEvent, setSelectedEvent] = useState(undefined);
    const [callGetEventSessions, setCallGetEventSessions] = useState(false);
    const [eventSessions, setEventSessions] = useState([]);
    const { isOpen: isOpenVisualizationModal, onOpen: onOpenVisualizationModal, onClose: onCloseVisualizationModal } = useDisclosure();
    const { isOpen: isOpenCreationModal, onOpen: onOpenCreationModal, onClose: onCloseCreationModal } = useDisclosure();

    const { isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal } = useDisclosure();
    const [modifiedEvent, setModifiedEvent] = useState(undefined);
    const [callModifyEvent, setCallModifyEvent] = useState(false);

    const [callModifyAllSessions, setCallModifyAllSessions] = useState(false);
    const { isOpen: isOpenDeletionModal, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();
    const [callDeleteEvent, setCallDeleteEvent] = useState(false);
    const { isOpen: isOpenDeletionAllModal, onOpen: onOpenDeletionAllModal, onClose: onCloseDeletionAllModal } = useDisclosure();
    const [deleteAllSessions, setDeleteAllSessions] = useState(false);
    const [callDeleteAllSessions, setCallDeleteAllSessions] = useState(false);

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
        setLoadedEvents(true);

        getEventForTrimester(volunteer.localUnitId, currentMonth, currentYear)
            .then((eventList) => {
                setEvents(eventList);
                const allReferrersId = eventList.map((el) => el.referrerId);
                setReferrersId(Array.from(new Set(allReferrersId)));
            })
            .catch((err) => {
                console.log(err);
                setLoadedEvents(false);
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
                });
        });
    }

    const loadVolunteers = () => {
        setLoadVolunteerList(true);
        getVolunteers()
            .then((volunteers) => {
                setVolunteerList(volunteers);
                setVolunteerNameList(volunteers.map((el) => el.firstName + ' ' + el.lastName));
            })
            .catch((_) => {
            });
    }

    const selectEventForModal = (event, onOpenModal) => {
        setSelectedEvent(event);
        onOpenModal();
    }


    const onNewEvent = (eventId) => {
        setLoadedEvents(false);
    }

    const deleteEvent = () => {
        setCallDeleteEvent(false);
        if (selectedEvent !== undefined) {
            const eventId = selectedEvent.eventId;
            const sessionId = selectedEvent.sessionId;
            deleteEventById(eventId, sessionId)
                .then(() => {
                    onCloseDeletionAllModal();
                    onCloseDeletionModal();
                    setSelectedEvent(undefined);
                    setEvents(events.filter((el) => el.id !== eventId));
                    setLoadedEvents(false);
                })
                .catch((_) => {
                });
        }
    }

    const deleteAllEventSessions = () => {
        setCallDeleteAllSessions(false);
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
                })
                .catch((_) => {
                });
        }
    }

    return (
        <>
            <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                {!loadedEvents && volunteer && loadEvents()}
                {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
                {!loadVolunteerList && loadVolunteers()}
                {selectedEvent !== undefined && callDeleteEvent && deleteEvent()}
                {selectedEvent !== undefined && callDeleteAllSessions && deleteAllEventSessions()}
                <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex direction='row' justifyContent="space-between">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                Gestion des événements
                            </Text>
                            <Button p="0px" variant="outline" colorScheme="green" mr="10%" onClick={onOpenCreationModal}>
                                <Flex cursor="pointer" align="center" p="12px">
                                    <Icon as={FaPlus} mr="8px"/>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Ajouter un événement
                                    </Text>
                                </Flex>
                            </Button>
                            <Button onClick={setToPrevious3Months}>
                                <Flex cursor="pointer" align="center">
                                    <Icon as={FaArrowLeft} mr="8px"/>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        3 mois précédents
                                    </Text>
                                </Flex>
                            </Button>
                            <Button onClick={setToPreviousMonth}>
                                <Flex cursor="pointer" align="center">
                                    <Icon as={FaArrowLeft} mr="8px"/>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Mois précédent
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
                                        Mois suivant
                                    </Text>
                                    <Icon as={FaArrowRight} ml="8px"/>
                                </Flex>
                            </Button>
                            <Button onClick={setToNext3Months}>
                                <Flex cursor="pointer" align="center">
                                    <Text fontSize="sm" fontWeight="semibold">
                                        3 mois suivants
                                    </Text>
                                    <Icon as={FaArrowRight} ml="8px"/>
                                </Flex>
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Table variant="simple" color={textColor}>
                            <Thead>
                                <Tr my=".8rem" pl="0px" color="gray.400" >
                                    <Th pl="0px" borderColor={borderColor} color="gray.400" >
                                        Nom
                                    </Th>
                                    <Th borderColor={borderColor} color="gray.400" >Description</Th>
                                    <Th borderColor={borderColor} color="gray.400" >Référent</Th>
                                    <Th borderColor={borderColor} color="gray.400" >Date</Th>
                                    <Th borderColor={borderColor} color="gray.400" >Inscriptions</Th>
                                    <Th borderColor={borderColor}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                                        {currentYear} - {(new Date(currentYear, (currentMonth - 1) % 12)).toLocaleString('fr-FR', { month: 'long' })}
                                    </Td>
                                </Tr>
                                {events.filter(e => e.startDate.getMonth() === (currentMonth - 1)).map((event, index, arr) => {
                                    return (
                                        <Tr key={index}>
                                            <Td pl="0px" borderColor={borderColor} borderBottom={index === arr.length - 1 ? "none" : null}>
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
                                                <Text>
                                                    {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(event.referrerId)] : event.referrerId}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.numberOfParticipants} / {event.maxParticipants}
                                                </Text>
                                                {event.maxParticipants === 0 && (
                                                    <Flex direction="column">
                                                        <Text
                                                            fontSize="md"
                                                            color="red"
                                                            fontWeight="bold"
                                                            pb=".2rem"
                                                        >100%</Text>
                                                        <Progress
                                                            colorScheme="red"
                                                            size="xs"
                                                            value={100}
                                                            borderRadius="15px"
                                                        />
                                                    </Flex>
                                                )}
                                                {event.maxParticipants !== 0 && (
                                                    <Flex direction="column">
                                                        <Text
                                                            fontSize="md"
                                                            color={(event.numberOfParticipants / event.maxParticipants) * 100 < 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 < 85 ? "orange" : "red"}
                                                            fontWeight="bold"
                                                            pb=".2rem"
                                                        >{`${(event.numberOfParticipants / event.maxParticipants * 100).toFixed(1)}%`}</Text>
                                                        <Progress
                                                            colorScheme={(event.numberOfParticipants / event.maxParticipants) * 100 > 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 > 85 ? "orange" : "red"}
                                                            size="xs"
                                                            value={event.numberOfParticipants / event.maxParticipants * 100}
                                                            borderRadius="15px"
                                                        />
                                                    </Flex>
                                                )}
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Menu>
                                                    <MenuButton>
                                                        <Icon as={FaCog} />
                                                    </MenuButton>
                                                    <MenuList>
                                                        <Flex direction="column">
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => selectEventForModal(event, onOpenVisualizationModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaEye} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Consulter
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() =>selectEventForModal(event, onOpenEditionModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaPencilAlt} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Modifier
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" variant="transparent" colorScheme="red" onClick={() => selectEventForModal(event, onOpenDeletionModal)} >
                                                                    <Flex cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaTrashAlt} mr="8px" />
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Supprimer
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                        </Flex>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                                {events.filter(e => e.startDate.getMonth() === (currentMonth - 1)).length === 0 && (
                                    <Tr>
                                        <Td colSpan="8" textAlign="center">
                                            Aucun événement ce mois-ci
                                        </Td>
                                    </Tr>
                                )}
                                <Tr>
                                    <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                                        {currentYear} - {(new Date(currentYear, currentMonth % 12)).toLocaleString('fr-FR', { month: 'long' })}
                                    </Td>
                                </Tr>
                                {events.filter(e => e.startDate.getMonth() === (currentMonth % 12) ).map((event, index, arr) => {
                                    return (
                                        <Tr key={index}>
                                            <Td pl="0px" borderColor={borderColor} borderBottom={index === arr.length - 1 ? "none" : null}>
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
                                                <Text>
                                                    {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(event.referrerId)] : event.referrerId}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.numberOfParticipants} / {event.maxParticipants}
                                                </Text>
                                                <Flex direction="column">
                                                    <Text
                                                        fontSize="md"
                                                        color={(event.numberOfParticipants / event.maxParticipants) * 100 < 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 < 85 ? "orange" : "red"}
                                                        fontWeight="bold"
                                                        pb=".2rem"
                                                    >{`${(event.numberOfParticipants / event.maxParticipants * 100).toFixed(1)}%`}</Text>
                                                    <Progress
                                                        colorScheme={(event.numberOfParticipants / event.maxParticipants) * 100 > 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 > 85 ? "orange" : "red"}
                                                        size="xs"
                                                        value={event.numberOfParticipants / event.maxParticipants * 100}
                                                        borderRadius="15px"
                                                    />
                                                </Flex>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Menu>
                                                    <MenuButton>
                                                        <Icon as={FaCog} />
                                                    </MenuButton>
                                                    <MenuList>
                                                        <Flex direction="column">
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => selectEventForModal(event, onOpenVisualizationModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaEye} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Consulter
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() =>selectEventForModal(event, onOpenEditionModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaPencilAlt} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Modifier
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" variant="transparent" colorScheme="red" onClick={() => selectEventForModal(event, onOpenDeletionModal)} >
                                                                    <Flex cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaTrashAlt} mr="8px" />
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Supprimer
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                        </Flex>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                                {events.filter(e => e.startDate.getMonth() === (currentMonth % 12)).length === 0 && (
                                    <Tr>
                                        <Td colSpan="8" textAlign="center">
                                            Aucun événement ce mois-ci
                                        </Td>
                                    </Tr>
                                )}
                                <Tr>
                                    <Td colSpan="8" textAlign="left" fontSize="2xl" fontWeight="bold" ml="24px">
                                        {currentYear} - {(new Date(currentYear, (currentMonth % 12) + 1)).toLocaleString('fr-FR', { month: 'long' })}
                                    </Td>
                                </Tr>
                                {events.filter(e => e.startDate.getMonth() === (currentMonth + 1) % 12).map((event, index, arr) => {
                                    return (
                                        <Tr key={index}>
                                            <Td pl="0px" borderColor={borderColor} borderBottom={index === arr.length - 1 ? "none" : null}>
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
                                                <Text>
                                                    {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(event.referrerId)] : event.referrerId}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                                </Text>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Text>
                                                    {event.numberOfParticipants} / {event.maxParticipants}
                                                </Text>
                                                <Flex direction="column">
                                                    <Text
                                                        fontSize="md"
                                                        color={(event.numberOfParticipants / event.maxParticipants) * 100 < 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 < 85 ? "orange" : "red"}
                                                        fontWeight="bold"
                                                        pb=".2rem"
                                                    >{`${(event.numberOfParticipants / event.maxParticipants * 100).toFixed(1)}%`}</Text>
                                                    <Progress
                                                        colorScheme={(event.numberOfParticipants / event.maxParticipants) * 100 > 50 ? "green" : (event.numberOfParticipants / event.maxParticipants) * 100 > 85 ? "orange" : "red"}
                                                        size="xs"
                                                        value={event.numberOfParticipants / event.maxParticipants * 100}
                                                        borderRadius="15px"
                                                    />
                                                </Flex>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Menu>
                                                    <MenuButton>
                                                        <Icon as={FaCog} />
                                                    </MenuButton>
                                                    <MenuList>
                                                        <Flex direction="column">
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => selectEventForModal(event, onOpenVisualizationModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaEye} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Consulter
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => selectEventForModal(event, onOpenEditionModal)}>
                                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaPencilAlt} mr="8px"/>
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Modifier
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <Button p="0px" variant="transparent" colorScheme="red" onClick={() => selectEventForModal(event, onOpenDeletionModal)} >
                                                                    <Flex cursor="pointer" align="center" p="12px">
                                                                        <Icon as={FaTrashAlt} mr="8px" />
                                                                        <Text fontSize="sm" fontWeight="semibold">
                                                                            Supprimer
                                                                        </Text>
                                                                    </Flex>
                                                                </Button>
                                                            </MenuItem>
                                                        </Flex>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                                {events.filter(e => e.startDate.getMonth() === (currentMonth + 1) % 12).length === 0 && (
                                    <Tr>
                                        <Td colSpan="8" textAlign="center">
                                            Aucun événement ce mois-ci
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Flex>

            <EventCreation isOpen={isOpenCreationModal} onClose={onCloseCreationModal} volunteers={volunteerList} onNewEvent={onNewEvent}> </EventCreation>

            <EventViewer isOpen={isOpenVisualizationModal} onClose={onCloseVisualizationModal} event={selectedEvent} ></EventViewer>

            <EventEdition isOpen={isOpenEditionModal} onClose={onCloseEditionModal} volunteers={volunteerList} eventToEdit={selectedEvent} ></EventEdition>

            <Modal isOpen={isOpenDeletionModal} onClose={onCloseDeletionModal} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            {selectedEvent !== undefined && (
                                <Stat>
                                    <StatLabel>{selectedEvent.name} le {selectedEvent.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</StatLabel>
                                    <StatNumber><Icon as={FaUser}/> {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants} participants</StatNumber>
                                    <StatHelpText>{selectedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(selectedEvent.referrerId)] : selectedEvent.referrerId}</StatHelpText>
                                </Stat>
                            )}
                            {selectedEvent !== undefined && selectedEvent.recurring && (
                                <Flex direction="column" mt="4px" mb="4px">
                                    <Text>Supprimer la suite d'événements ?</Text>
                                    <Flex direction="row" mt="4px" mb="4px" align="center">
                                        <Switch size="md" onChange={() => setDeleteAllSessions(!deleteAllSessions)} mr="8px" isChecked={deleteAllSessions}/>
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
                        <Button variant="outline" colorScheme="red" onClick={() => {deleteAllSessions ? onOpenDeletionAllModal() : setCallDeleteEvent(true); deleteAllSessions ? setCallGetEventSessions(true) : setCallGetEventSessions(false)}}>
                            Supprimer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenDeletionAllModal} onClose={onCloseDeletionAllModal} size="xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de {eventSessions.length} événements</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                        <Button variant="outline" colorScheme="red" onClick={() => setCallDeleteAllSessions(true)}>
                            Supprimer tout les événements
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
