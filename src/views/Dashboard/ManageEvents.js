import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon, Input,
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
import CardBody from "../../components/Card/CardBody";
import React, {useContext, useEffect, useState} from "react";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile, getVolunteerById} from "../../controller/VolunteerController";
import {
    createRecurrentEvent,
    createSingleEvent,
    deleteEventById,
    deleteEventSessions,
    getAllEvents,
    getEventSessions, updateAllEventSessions,
    updateEventSession
} from "../../controller/EventController";
import {FaArrowRight, FaPencilAlt, FaPlus, FaTrashAlt, FaUser, FaEye} from "react-icons/fa";
import TimelineRow from "../../components/Tables/TimelineRow";
import {CalendarIcon, CheckIcon} from "@chakra-ui/icons";
import {SingleEventCreation} from "../../model/event/SingleEventCreation";
import {RecurrentEventCreation} from "../../model/event/RecurrentEventCreation";

export default function ManageEvents() {
    // Component variables
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const history = useHistory();
    // Data variables
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);
    const [events, setEvents] = useState([]);
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    // Modal variables
    const [selectedEvent, setSelectedEvent] = useState(undefined);
    const [callGetEventSessions, setCallGetEventSessions] = useState(false);
    const [eventSessions, setEventSessions] = useState([]);
    const { isOpen: isOpenVisualizationModal, onOpen: onOpenVisualizationModal, onClose: onCloseVisualizationModal } = useDisclosure();
    const { isOpen: isOpenCreationModal, onOpen: onOpenCreationModal, onClose: onCloseCreationModal } = useDisclosure();
    const [eventType, setEventType] = useState("unique");
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventReferrer, setEventReferrer] = useState("");
    const [eventMaxParticipants, setEventMaxParticipants] = useState(20);
    const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().substring(0, 10));
    const [eventStartTime, setEventStartTime] = useState(new Date(0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [eventEndDate, setEventEndDate] = useState(new Date().toISOString().substring(0, 10));
    const [eventEndTime, setEventEndTime] = useState(new Date(0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [eventRecurrence, setEventRecurrence] = useState(7);
    const [eventError, setEventError] = useState("");
    const [callCreateEvent, setCallCreateEvent] = useState(false);
    const { isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal } = useDisclosure();
    const [modifiedEvent, setModifiedEvent] = useState(undefined);
    const [callModifyEvent, setCallModifyEvent] = useState(false);
    const [modifiedEventStartDate, setModifiedEventStartDate] = useState(new Date(0).toISOString().substring(0, 10));
    const [modifiedEventStartTime, setModifiedEventStartTime] = useState(new Date(0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [modifiedEventEndDate, setModifiedEventEndDate] = useState(new Date(0).toISOString().substring(0, 10));
    const [modifiedEventEndTime, setModifiedEventEndTime] = useState(new Date(0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [modifyEventError, setModifyEventError] = useState("");
    const { isOpen: isOpenModifyAllModal, onOpen: onOpenModifyAllModal, onClose: onCloseModifyAllModal } = useDisclosure();
    const [modifyAllSessions, setModifyAllSessions] = useState(false);
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
        if (modifiedEvent !== undefined) {
            setModifiedEventStartDate(modifiedEvent.startDate.toISOString().substring(0, 10));
            setModifiedEventStartTime(modifiedEvent.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setModifiedEventEndDate(modifiedEvent.endDate.toISOString().substring(0, 10));
            setModifiedEventEndTime(modifiedEvent.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
    }, [modifiedEvent]);

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

    const loadEvents = () => {
        setLoadedEvents(true);
        getAllEvents(volunteer.localUnitId)
            .then((events) => {
                setEvents(events);
                const allReferrersId = events.map((el) => el.referrerId);
                setReferrersId(Array.from(new Set(allReferrersId)));
            })
            .catch((_) => {
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

    const selectEventForModal = (event, onOpenModal) => {
        setSelectedEvent(event);
        onOpenModal();
    }

    const getAllSessions = () => {
        setCallGetEventSessions(false);
        if (selectedEvent !== undefined) {
            const eventId = selectedEvent.eventId;
            getEventSessions(eventId)
                .then((sessions) => {
                    setEventSessions(sessions);
                })
                .catch((_) => {
                });
        }
    }

    const createEvent = () => {
        setCallCreateEvent(false);
        setEventError("");
        if (eventName === "") {
            setEventError("Veuillez entrer un nom pour l'évènement");
            return;
        }
        if (eventReferrer === "") {
            setEventError("Veuillez sélectionner un référent");
            return;
        }
        let eventStart;
        let eventEnd;
        try {
            const [years, months, days] = eventStartDate.split("-");
            const [hours, minutes] = eventStartTime.split(":");
            eventStart = new Date(
                parseInt(years),
                parseInt(months) - 1,
                parseInt(days),
                parseInt(hours),
                parseInt(minutes),
            );
            if (eventStart < new Date()) {
                setEventError("La date de début doit être dans le futur");
                return;
            }
        } catch (error) {
            setEventError("Veuillez entrer une date de début valide");
            return;
        }

        try {
            const [years, months, days] = eventEndDate.split("-");
            const [hours, minutes] = eventEndTime.split(":");
            eventEnd = new Date(
                parseInt(years),
                parseInt(months) - 1,
                parseInt(days),
                parseInt(hours),
                parseInt(minutes),
            );
            if (eventEnd.getTime() <= eventStart.getTime()) {
                setEventError("La date de fin doit être à minima 1 minute après la date de début");
                return;
            }
        } catch (error) {
            setEventError("Veuillez entrer une date de fin valide");
            return;
        }

        if (eventType === "unique") {
            createSingleEvent(new SingleEventCreation(eventName, eventDescription, eventStart.getTime(), eventEnd.getTime(), eventReferrer, volunteer.localUnitId, eventMaxParticipants))
                .then(() => {
                    onCloseCreationModal();
                    setLoadedEvents(false);
                })
                .catch((_) => {
                });
        } else {
            const eventDuration = ((parseInt(eventEndTime.split(":")[0]) * 60 + parseInt(eventEndTime.split(":")[1])) - (parseInt(eventStartTime.split(":")[0]) * 60 + parseInt(eventStartTime.split(":")[1])));
            createRecurrentEvent(new RecurrentEventCreation(eventName, eventDescription, eventReferrer, volunteer.localUnitId, eventStart.getTime(), eventEnd.getTime(), eventDuration, eventRecurrence, eventMaxParticipants))
                .then(() => {
                    onCloseCreationModal();
                    setLoadedEvents(false);
                })
                .catch((_) => {
                });
        }
    }

    const modifyEvent = () => {
        setCallModifyEvent(false);
        setModifyEventError("");
        if (modifiedEvent === undefined) {
            setModifyEventError("ERREUR: Merci de re-sélectionner l'évènement à modifier");
            return;
        }
        if (modifiedEvent.name === "") {
            setModifyEventError("Le nom de l'évènement ne peut pas être vide");
            return;
        }
        if (modifiedEvent.referrerId === "") {
            setModifyEventError("Veuillez sélectionner un référent");
            return;
        }

        let eventStart;
        let eventEnd;
        try {
            const [years, months, days] = modifiedEventStartDate.split("-");
            const [hours, minutes] = modifiedEventStartTime.split(":");
            eventStart = new Date(
                parseInt(years),
                parseInt(months) - 1,
                parseInt(days),
                parseInt(hours),
                parseInt(minutes),
            );
            if (eventStart < new Date()) {
                setModifyEventError("La date de début doit être dans le futur");
                return;
            }
        } catch (error) {
            setModifyEventError("Veuillez entrer une date de début valide");
            return;
        }

        try {
            const [years, months, days] = modifiedEventEndDate.split("-");
            const [hours, minutes] = modifiedEventEndTime.split(":");
            eventEnd = new Date(
                parseInt(years),
                parseInt(months) - 1,
                parseInt(days),
                parseInt(hours),
                parseInt(minutes),
            );
            if (eventEnd.getTime() <= eventStart.getTime()) {
                setModifyEventError("La date de fin doit être à minima 1 minute après la date de début");
                return;
            }
        } catch (error) {
            setModifyEventError("Veuillez entrer une date de fin valide");
            return;
        }

        if (!modifyAllSessions) {
            updateEventSession(modifiedEvent, eventStart, eventEnd)
                .then(() => {
                    onCloseEditionModal();
                    setSelectedEvent(modifiedEvent);
                    setLoadedEvents(false);
                })
                .catch((_) => {
                });
        }else {
            setCallGetEventSessions(true);
            onOpenModifyAllModal();
        }
    }

    const modifyAllEventSessions = () => {
        setCallModifyAllSessions(false);
        const [yearsStart, monthsStart, daysStart] = modifiedEventStartDate.split("-");
        const [hoursStart, minutesStart] = modifiedEventStartTime.split(":");
        let eventStart = new Date(
                parseInt(yearsStart),
                parseInt(monthsStart) - 1,
                parseInt(daysStart),
                parseInt(hoursStart),
                parseInt(minutesStart),
            );

        const [yearsEnd, monthsEnd, daysEnd] = modifiedEventEndDate.split("-");
        const [hoursEnd, minutesEnd] = modifiedEventEndTime.split(":");
        let eventEnd = new Date(
                parseInt(yearsEnd),
                parseInt(monthsEnd) - 1,
                parseInt(daysEnd),
                parseInt(hoursEnd),
                parseInt(minutesEnd),
            );

        if (modifiedEvent !== undefined) {
            updateAllEventSessions(modifiedEvent, eventStart, eventEnd)
                .then(() => {
                    onCloseModifyAllModal();
                    onCloseEditionModal();
                    setSelectedEvent(modifiedEvent);
                    setLoadedEvents(false);
                    setModifyAllSessions(false);
                })
                .catch((_) => {
                });
        }
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
                {!loadedVolunteer && loadVolunteer()}
                {!loadedEvents && volunteer && loadEvents()}
                {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
                {selectedEvent !== undefined && callGetEventSessions && getAllSessions()}
                {callCreateEvent && createEvent()}
                {modifiedEvent !== undefined && callModifyEvent && modifyEvent()}
                {modifiedEvent !== undefined && callModifyAllSessions && modifyAllEventSessions()}
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
                                    <Th borderColor={borderColor}></Th>
                                    <Th borderColor={borderColor}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {events.map((event, index, arr) => {
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
                                                    {event.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replaceAll(':', 'h')}
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
                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => selectEventForModal(event, onOpenVisualizationModal)}>
                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                        <Icon as={FaEye} />
                                                        <Text fontSize="sm" fontWeight="semibold">
                                                            Consulter
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() =>selectEventForModal(event, onOpenEditionModal)}>
                                                    <Flex color={textColor} cursor="pointer" align="center" p="12px">
                                                        <Icon as={FaPencilAlt} />
                                                        <Text fontSize="sm" fontWeight="semibold">
                                                            Modifier
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                            </Td>
                                            <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                                <Button p="0px" variant="outline" colorScheme="red" onClick={() => selectEventForModal(event, onOpenDeletionModal)} >
                                                    <Flex cursor="pointer" align="center" p="12px">
                                                        <Icon as={FaTrashAlt} />
                                                        <Text fontSize="sm" fontWeight="semibold">
                                                            Supprimer
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Flex>
            <Modal isOpen={isOpenCreationModal} onClose={onCloseCreationModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Ajouter un événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            <Flex direction="row" align="center">
                                <Text size="md" fontWeight="semibold" w="40%">
                                    Type d'événement
                                </Text>
                                <RadioGroup value={eventType} onChange={(e) => setEventType(e)}>
                                    <Radio value="unique" margin="8px 64px">Unique</Radio>
                                    <Radio value="recurring" margin="8px 64px">Récurrent</Radio>
                                </RadioGroup>
                            </Flex>
                            <FormControl>
                                <FormLabel>Nom de l'événement</FormLabel>
                                <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)}/>
                                <FormLabel>Description de l'événement</FormLabel>
                                <Textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}/>
                                <FormLabel>Référent</FormLabel>
                                <Select placeholder="Sélectionnez un référent" value={eventReferrer} onChange={(e) => setEventReferrer(e.target.value)}>
                                    {referrersId.map((referrerId, index) => {
                                        return (
                                            <option key={index} value={referrerId}>{referrersName[index]}</option>
                                        );
                                    })}
                                </Select>
                                <FormLabel>Nombre maximum de participants</FormLabel>
                                <NumberInput defaultValue={20} min={1} value={eventMaxParticipants} onChange={(e) => setEventMaxParticipants(parseInt(e))}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {eventType === "unique" && (
                                    <Box>
                                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='8px'>
                                            <FormLabel m="auto">Date de début</FormLabel>
                                            <Input type="date" value={eventStartDate}
                                                   onChange={(e) => setEventStartDate(e.target.value)}/>
                                            <FormLabel m="auto">Heure de début</FormLabel>
                                            <Input type="time" value={eventStartTime}
                                                   onChange={(e) => setEventStartTime(e.target.value)}/>
                                        </SimpleGrid>
                                        <SimpleGrid columns={{ md: 2, xl: 4 }} spacing='8px'>
                                            <FormLabel m="auto">Date de fin</FormLabel>
                                            <Input type="date" value={eventEndDate}
                                                   onChange={(e) => setEventEndDate(e.target.value)}/>
                                            <FormLabel m="auto">Heure de fin</FormLabel>
                                            <Input type="time" value={eventEndTime}
                                                   onChange={(e) => setEventEndTime(e.target.value)}/>
                                        </SimpleGrid>
                                    </Box>
                                )}
                                {eventType === "recurring" && (
                                    <Box>
                                        <FormLabel>Période de l'événement récurrent</FormLabel>
                                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='8px'>
                                            <FormLabel m="auto">Du</FormLabel>
                                            <Input type="date" value={eventStartDate}
                                                   onChange={(e) => setEventStartDate(e.target.value)}/>
                                            <FormLabel m="auto">Au</FormLabel>
                                            <Input type="date" value={eventEndDate}
                                                   onChange={(e) => setEventEndDate(e.target.value)}/>
                                        </SimpleGrid>
                                        <FormLabel>Horaires de l'événement récurrent</FormLabel>
                                        <SimpleGrid columns={{ md: 2, xl: 4 }} spacing='8px'>
                                            <FormLabel m="auto">De</FormLabel>
                                            <Input type="time" value={eventStartTime}
                                                   onChange={(e) => setEventStartTime(e.target.value)}/>
                                            <FormLabel m="auto">A</FormLabel>
                                            <Input type="time" value={eventEndTime}
                                                   onChange={(e) => setEventEndTime(e.target.value)}/>
                                        </SimpleGrid>
                                        <FormLabel>Durée de l'événement: {((parseInt(eventEndTime.split(":")[0]) * 60 + parseInt(eventEndTime.split(":")[1])) - (parseInt(eventStartTime.split(":")[0]) * 60 + parseInt(eventStartTime.split(":")[1])))} minutes</FormLabel>
                                        <FormLabel>Récurrence, l'événement se tiendras tout les {eventRecurrence} jours</FormLabel>
                                        <NumberInput defaultValue={7} min={1} max={365} value={eventRecurrence} onChange={(e) => setEventRecurrence(parseInt(e))}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Box>
                                )}
                                {eventError !== "" && (
                                    <Text fontSize="sm" color="red" fontWeight="semibold">
                                        {eventError}
                                    </Text>
                                )}
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseCreationModal}>
                            Annuler
                        </Button>
                        <Button p="0px" variant="outline" colorScheme="green" mr="10%" onClick={() => setCallCreateEvent(true)}>
                            <Flex cursor="pointer" align="center" p="12px">
                                <Icon as={FaPlus} mr="8px"/>
                                <Text fontSize="sm" fontWeight="semibold">
                                    Ajouter
                                </Text>
                            </Flex>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenVisualizationModal} onClose={onCloseVisualizationModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Détails de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            {selectedEvent !== undefined && (
                                <Flex direction="column">
                                    <Text fontSize="2xl" fontWeight="bold">{selectedEvent.name}</Text>
                                    <Text><i>{selectedEvent.description}</i></Text>
                                    <Text>Du {selectedEvent.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replaceAll(':', 'h')} au {selectedEvent.endDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replaceAll(':', 'h')}</Text>
                                    <Text>Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(selectedEvent.referrerId)] : selectedEvent.referrerId}</Text>
                                    <Text>Participants: {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants}</Text>
                                    <Text>Plage{selectedEvent.timeWindows.length > 1 ? "s" : ""} horaire{selectedEvent.timeWindows.length > 1 ? "s" : ""}</Text>
                                    <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing='24px'>
                                        {selectedEvent.timeWindows.map((timeWindow, index) => (
                                            <Card key={index}>
                                                <Flex direction="column">
                                                    <Flex direction="row">
                                                        <Text fontSize="sm" fontWeight="semibold">De</Text>
                                                        <Text fontSize="sm" fontWeight="semibold">{timeWindow.startTime.toString()}</Text>
                                                        <Text fontSize="sm" fontWeight="semibold">à</Text>
                                                        <Text fontSize="sm" fontWeight="semibold">{timeWindow.endTime.toString()}</Text>
                                                    </Flex>
                                                    <Text>Participants: {timeWindow.participants.length} / {timeWindow.maxParticipants}</Text>
                                                    {timeWindow.participants.map((participant, index) => (
                                                        <Text key={index}>{participant}</Text>
                                                    ))}
                                                </Flex>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </Flex>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseVisualizationModal}>
                            Fermer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenEditionModal} onClose={onCloseEditionModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modification de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            <FormControl>
                                <FormLabel>Nom de l'événement</FormLabel>
                                <Input type="text" value={modifiedEvent?.name} onChange={(e) => setModifiedEvent({...modifiedEvent, name: e.target.value})} />
                                <FormLabel>Description de l'événement</FormLabel>
                                <Textarea value={modifiedEvent?.description} onChange={(e) => setModifiedEvent({...modifiedEvent, description: e.target.value})} />
                                <FormLabel>Référent</FormLabel>
                                <Select value={modifiedEvent?.referrerId} onChange={(e) => setModifiedEvent({...modifiedEvent, referrerId: e.target.value})}>
                                    {referrersId.length === referrersName.length && referrersId.map((referrerId, index) => {
                                        return (
                                            <option key={index} value={referrerId}>{referrersName[index]}</option>
                                        );
                                    })}
                                </Select>
                                <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='8px'>
                                    <FormLabel m="auto">Date de début</FormLabel>
                                    <Input type="date" value={modifiedEventStartDate}
                                           onChange={(e) => setModifiedEventStartDate(e.target.value)}/>
                                    <FormLabel m="auto">Heure de début</FormLabel>
                                    <Input type="time" value={modifiedEventStartTime}
                                           onChange={(e) => setModifiedEventStartTime(e.target.value)}/>
                                </SimpleGrid>
                                <SimpleGrid columns={{ md: 2, xl: 4 }} spacing='8px'>
                                    <FormLabel m="auto">Date de fin</FormLabel>
                                    <Input type="date" value={modifiedEventEndDate}
                                           onChange={(e) => setModifiedEventEndDate(e.target.value)}/>
                                    <FormLabel m="auto">Heure de fin</FormLabel>
                                    <Input type="time" value={modifiedEventEndTime}
                                           onChange={(e) => setModifiedEventEndTime(e.target.value)}/>
                                </SimpleGrid>
                                <FormLabel>Nombre maximum de participants</FormLabel>
                                <NumberInput type="number" min={1} value={modifiedEvent?.maxParticipants} onChange={(e) => setModifiedEvent({...modifiedEvent, maxParticipants: parseInt(e)})}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {modifiedEvent?.recurring && (
                                    <Flex direction="column">
                                        <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                            Attention, cet événement est récurrent. Si vous le nom, la description ou le référent, tous les événements associés seront modifiés.
                                        </Text>
                                        {modifiedEvent?.maxParticipants !== selectedEvent?.maxParticipants && (
                                            <Flex direction="column">
                                                <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                                    Si vous modifiez le nombre maximum de participants, les événements associés ne seront pas modifiés par défaut. Vous pouvez cependant demander à les modifier en cochant la case ci-dessous.
                                                </Text>
                                                <Flex direction="row" mt="4px" mb="4px" align="center">
                                                    <Switch size="md" onChange={() => setModifyAllSessions(!modifyAllSessions)} isChecked={modifyAllSessions} mr="8px" />
                                                    <Text>
                                                        {modifyAllSessions ? "Modifier le nombre max de participants pour tout les événements associés" : "Ne pas modifier le nombre max de participants pour les événements associés"}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        )}
                                    </Flex>
                                )}
                            </FormControl>
                            <Box h="48px" />
                            {selectedEvent !== undefined && modifiedEvent !== undefined && (
                                <Flex direction="row" justifyContent="space-between" alignItems="center">
                                    <Stat maxW="45%">
                                        <StatLabel>{selectedEvent.name} du {selectedEvent.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')} au {selectedEvent.endDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')}</StatLabel>
                                        <StatNumber><Icon as={FaUser}/> {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants} participants</StatNumber>
                                        <StatHelpText>{selectedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(selectedEvent.referrerId)] : selectedEvent.referrerId}</StatHelpText>
                                    </Stat>
                                    <Icon as={FaArrowRight} h="8" w="8" mr="12px" />
                                    <Stat maxW="45%">
                                        <StatLabel>{modifiedEvent.name} le {modifiedEvent.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')} au {selectedEvent.endDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')}</StatLabel>
                                        <StatNumber><Icon as={FaUser}/> {modifiedEvent.numberOfParticipants} / {modifiedEvent.maxParticipants} participants</StatNumber>
                                        <StatHelpText>{modifiedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(modifiedEvent.referrerId)] : modifiedEvent.referrerId}</StatHelpText>
                                    </Stat>
                                </Flex>
                            )}
                            {modifyEventError !== "" && (
                                <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                    {modifyEventError}
                                </Text>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseEditionModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" onClick={() => setCallModifyEvent(true)} isDisabled={
                            modifiedEvent === selectedEvent &&
                            modifiedEvent !== undefined &&
                            modifiedEventStartDate === modifiedEvent.startDate.toISOString().substring(0, 10) &&
                            modifiedEventStartTime === modifiedEvent.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) &&
                            modifiedEventEndDate === modifiedEvent.endDate.toISOString().substring(0, 10) &&
                            modifiedEventEndTime === modifiedEvent.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}>
                            Modifier
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenModifyAllModal} onClose={onCloseModifyAllModal} size="xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmer la modification de {eventSessions.length} événements</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                Attention, vous êtes sur le point de modifier {eventSessions.length} événements pour la raison suivante:
                            </Text>
                            {modifiedEvent?.name !== selectedEvent?.name && (
                                <Text fontSize="sm" color="red.500" >Mise à jour du nom de l'événement</Text>
                            )}
                            {modifiedEvent?.description !== selectedEvent?.description && (
                                <Text fontSize="sm" color="red.500" >Mise à jour de la description de l'événement</Text>
                            )}
                            {modifiedEvent?.referrerId !== selectedEvent?.referrerId && (
                                <Text fontSize="sm" color="red.500" >Mise à jour du référent de l'événement</Text>
                            )}
                            {modifyAllSessions && modifiedEvent?.maxParticipants !== selectedEvent?.maxParticipants && (
                                <Text fontSize="sm" color="red.500" >Mise à jour demandé du nombre maximum de participants pour tout les événements associés</Text>
                            )}
                            {eventSessions.map((event, index, arr) => {
                                return (
                                    <TimelineRow
                                        logo={event.endDate.getTime() < Date.now() ? CheckIcon : CalendarIcon}
                                        title={event.name}
                                        date={event.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')}
                                        color={event.endDate.getTime() < Date.now() ? "green.500" : "blue.500"}
                                        index={index}
                                        arrLength={arr.length}
                                    />
                                )
                            })}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseModifyAllModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" onClick={() => setCallModifyAllSessions(true)}>
                            Modifier tout les événements
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDeletionModal} onClose={onCloseDeletionModal} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            {selectedEvent !== undefined && (
                                <Stat>
                                    <StatLabel>{selectedEvent.name} le {selectedEvent.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')}</StatLabel>
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
                                    date={event.startDate.toISOString().substring(0, 16).replaceAll('-', '/').replace('T', ' à ').replace(':', 'h')}
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
