import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Progress,
    Select,
    SimpleGrid,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Switch,
    Text,
    Textarea, Tooltip,
    useDisclosure, useToast
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import {FaArrowRight, FaUser} from "react-icons/fa";
import {getEventSessions, updateAllEventSessions, updateEventSession} from "../../../controller/EventController";
import TimelineRow from "../../../components/Tables/TimelineRow";
import {CalendarIcon, CheckIcon} from "@chakra-ui/icons";
import EventContext from "../../../contexts/EventContext";
import {getBeneficiaries} from "../../../controller/BeneficiariesController";
import {getVolunteers} from "../../../controller/VolunteerController";
import {getMyAuthorizations} from "../../../controller/RoleController";

export default function EventEdition(props) {

    const {events, setEvents, reloadEvents} = useContext(EventContext);

    if(props.eventSessionId === undefined){
        return null;
    }

    const initialEvent = events.find((event) => event.sessionId === props.eventSessionId);
    if(initialEvent === undefined){
        return null;
    }

    const [eventSessions, setEventSessions] = useState([]);
    const [modifiedEvent, setModifiedEvent] = useState(initialEvent);

    const [modifiedEventStartDate, setModifiedEventStartDate] = useState(new Date(0).toISOString().substring(0, 10));
    const [modifiedEventStartTime, setModifiedEventStartTime] = useState(new Date(0).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    }));
    const [modifiedEventEndDate, setModifiedEventEndDate] = useState(new Date(0).toISOString().substring(0, 10));
    const [modifiedEventEndTime, setModifiedEventEndTime] = useState(new Date(0).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    }));

    const [modifiedEventMaxParticipants, setModifiedEventMaxParticipants] = useState(10);
    const [modifiedEventTimeWindowDuration, setModifiedEventTimeWindowDuration] = useState(20);
    const [modifiedEventNumberOfTimeWindow, setModifiedEventNumberOfTimeWindow] = useState(3);

    const [modifyEventError, setModifyEventError] = useState("");

    const [modifyAllSessions, setModifyAllSessions] = useState(false);
    const [updateInProgress, setUpdateInProgress] = useState(false);

    const [eventMaxParticipants, setEventMaxParticipants] = useState(10);
    const [eventNumberOfTimeWindow, setEventNumberOfTimeWindow] = useState(3);

    const [volunteers, setVolunteers] = useState([]);
    const [loadedVolunteers, setLoadedVolunteers] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loadedBeneficiaries, setLoadedBeneficiaries] = useState(false);
    const [isCallingGetAllSessions, setIsCallingGetAllSessions] = useState(false);
    const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
    const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
    const toast = useToast();

    const loadVolunteers = () => {
        setLoadedVolunteers(true);
        getVolunteers()
            .then((res) => {
                setVolunteers(res);
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

    const loadBeneficiaries = () => {
        setLoadedBeneficiaries(true);
        getBeneficiaries()
            .then((res) => {
                setBeneficiaries(res);
            })
            .catch((_) => {
                setTimeout(() => {setLoadedBeneficiaries(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des bénéficiaires.",
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

    useEffect(() => {
            const event = events.find((event) => event.sessionId === props.eventSessionId);
            setModifiedEvent(event)

            setModifiedEventStartDate(event.startDate.toISOString().substring(0, 10));
            setModifiedEventStartTime(event.startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
            setModifiedEventEndDate(event.endDate.toISOString().substring(0, 10));
            setModifiedEventEndTime(event.endDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));

            setModifiedEventMaxParticipants(event.timeWindows.length > 0 ? event.timeWindows[0].maxParticipants : 10);
            setModifiedEventTimeWindowDuration(event.timeWindows.length > 0 ? (event.timeWindows[0].endTime.getTime() - event.timeWindows[0].startTime.getTime()) / (60 * 1000) : 20);
            setModifiedEventNumberOfTimeWindow(event.timeWindows.length > 0 ? event.timeWindows.length : 3);
        }
        ,[props.eventSessionId, events])

    const {isOpen: isOpenModifyAllModal, onOpen: onOpenModifyAllModal, onClose: onCloseModifyAllModal} = useDisclosure();

    if ( modifiedEvent === undefined) {
        return null;
    }

    useEffect(() => {
        const [yearsStart, monthsStart, daysStart] = modifiedEventStartDate.split("-");
        const [hoursStart, minutesStart] = modifiedEventStartTime.split(":");
        const eventStart = new Date(
            parseInt(yearsStart),
            parseInt(monthsStart) - 1,
            parseInt(daysStart),
            parseInt(hoursStart),
            parseInt(minutesStart),
        );

        const eventEnd = new Date(eventStart.getTime() + modifiedEventTimeWindowDuration * modifiedEventNumberOfTimeWindow * 60 * 1000);

        setModifiedEvent({
            ...modifiedEvent,
            startDate: eventStart,
            endDate: eventEnd
        });

    }, [modifiedEventStartDate, modifiedEventStartTime, modifiedEventEndDate, modifiedEventEndTime]);

    const modifyAllEventSessions = () => {
        const [yearsStart, monthsStart, daysStart] = modifiedEventStartDate.split("-");
        const [hoursStart, minutesStart] = modifiedEventStartTime.split(":");
        let eventStart = new Date(parseInt(yearsStart), parseInt(monthsStart) - 1, parseInt(daysStart), parseInt(hoursStart), parseInt(minutesStart));

        const [yearsEnd, monthsEnd, daysEnd] = modifiedEventEndDate.split("-");
        const [hoursEnd, minutesEnd] = modifiedEventEndTime.split(":");
        let eventEnd = new Date(parseInt(yearsEnd), parseInt(monthsEnd) - 1, parseInt(daysEnd), parseInt(hoursEnd), parseInt(minutesEnd));

        if (modifiedEvent !== undefined) {
            setUpdateInProgress(true);
            setIsCallingGetAllSessions(true);
            updateAllEventSessions(modifiedEvent, eventStart, eventEnd, modifiedEventTimeWindowDuration, modifiedEventNumberOfTimeWindow, modifiedEventMaxParticipants)
                .then(() => {
                    setIsCallingGetAllSessions(false);
                    reloadEvents();
                    setUpdateInProgress(false);
                    onCloseModifyAllModal();
                    props.onClose();
                    setModifyAllSessions(false);
                })
                .catch((_) => {
                    setIsCallingGetAllSessions(false);
                    setUpdateInProgress(false);
                    setModifyEventError("Une erreur server est survenue lors de la modification de l'évènement, veuillez réessayer plus tard");
                });
        }
    }

    const modifyEvent = () => {
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
        if ((modifiedEventMaxParticipants * modifiedEventNumberOfTimeWindow) < modifiedEvent.timeWindows.reduce((acc, el) => acc + el.participants.length, 0)) {
            setModifyEventError("Le nombre maximum de participants ne peut pas être inférieur au nombre de participants déjà inscrits");
            return;
        }
        if (modifiedEventStartDate === "") {
            setModifyEventError("Veuillez entrer une date de début");
            return;
        }
        if (modifiedEventStartTime === "") {
            setModifyEventError("Veuillez entrer une heure de début");
            return;
        }

        let eventStart;
        let eventEnd;
        try {
            const [years, months, days] = modifiedEventStartDate.split("-");
            const [hours, minutes] = modifiedEventStartTime.split(":");
            eventStart = new Date(parseInt(years), parseInt(months) - 1, parseInt(days), parseInt(hours), parseInt(minutes));
            if (eventStart < new Date()) {
                setModifyEventError("La date de début doit être dans le futur");
                return;
            }
        } catch (error) {
            setModifyEventError("Veuillez entrer une date de début valide");
            return;
        }

        if (!modifyAllSessions) {
            setUpdateInProgress(true);
            updateEventSession(modifiedEvent, eventStart, eventEnd, modifiedEventTimeWindowDuration, modifiedEventNumberOfTimeWindow, modifiedEventMaxParticipants)
                .then(() => {
                    reloadEvents();
                    setUpdateInProgress(false);
                    props.onClose();
                })
                .catch((e) => {
                    console.log(e)
                    setUpdateInProgress(false);
                    setModifyEventError("Une erreur server est survenue lors de la modification de l'évènement, veuillez réessayer plus tard");
                });
        } else {
            getAllSessions();
            onOpenModifyAllModal();
        }
    }

    const getAllSessions = () => {
        const eventId = modifiedEvent.eventId;
        setIsCallingGetAllSessions(true);
        getEventSessions(eventId)
            .then((sessions) => {
                for (let i = 0; i < sessions.length; i++) {
                    const participants = sessions[i].timeWindows.map(t => t.participants.length).reduce((acc, el) => acc + el, 0);
                    if (sessions[i].startDate.getTime() > Date.now() && participants > modifiedEventMaxParticipants) {
                        onCloseModifyAllModal();
                        setModifyEventError("Impossible de modifier l'événement car la session du " + sessions[i].startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h") + " a plus de participants que le nombre maximum de participants définit.");
                        return;
                    }
                }
                setEventSessions(sessions);
                setIsCallingGetAllSessions(false);
            })
            .catch((_) => {
                setIsCallingGetAllSessions(false);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des sessions de l'événement.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const canReadVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'READ').length > 0;
    }

    const canReadBeneficiary = () => {
        return volunteerAuthorizations.BENEFICIARY?.filter((r) => r === 'READ').length > 0;
    }

    return (
        <>
            {loadedVolunteerAuthorizations && !loadedVolunteers && canReadVolunteer() && loadVolunteers()}
            {loadedVolunteerAuthorizations && !loadedBeneficiaries && canReadBeneficiary() && loadBeneficiaries()}
            {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
            {isNaN(modifiedEventMaxParticipants) && setModifiedEventMaxParticipants(0)}
            {isNaN(modifiedEventNumberOfTimeWindow) && setModifiedEventNumberOfTimeWindow(1)}
            {isNaN(modifiedEventTimeWindowDuration) && setModifiedEventTimeWindowDuration(1)}
            <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Modification de l'événement</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex direction="column">
                            <FormControl>
                                <FormLabel>Nom de l'événement</FormLabel>
                                <Input type="text" value={modifiedEvent?.name}
                                       onChange={(e) => setModifiedEvent({...modifiedEvent, name: e.target.value})}/>
                                <FormLabel>Description de l'événement</FormLabel>
                                <Textarea value={modifiedEvent?.description} onChange={(e) => setModifiedEvent({
                                    ...modifiedEvent,
                                    description: e.target.value
                                })}/>
                                <FormLabel>Référent</FormLabel>
                                <Select value={modifiedEvent?.referrerId} onChange={(e) => setModifiedEvent({
                                    ...modifiedEvent,
                                    referrerId: e.target.value
                                })}>
                                    {props.volunteers.map((v, index) => {
                                        return (
                                            <option key={index} value={v.id}>{v.firstName} {v.lastName}</option>
                                        );
                                    })}
                                </Select>
                                <SimpleGrid columns={{sm: 1, md: 2, xl: 4}} spacing='8px' mt="8px" ml="16px" mr="16px">
                                    <FormLabel m="auto">Date de début</FormLabel>
                                    <Input type="date" value={modifiedEventStartDate}
                                           onChange={(e) => setModifiedEventStartDate(e.target.value)}/>
                                    <FormLabel m="auto">Heure de début</FormLabel>
                                    <Input type="time" value={modifiedEventStartTime}
                                           onChange={(e) => setModifiedEventStartTime(e.target.value)}/>
                                </SimpleGrid>
                                <SimpleGrid columns={{sm: 1, md: 2}} spacing='24px' mt="8px">
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Nombre de participants par plage horaire</FormLabel>
                                        <NumberInput defaultValue={10} min={0} value={modifiedEventMaxParticipants}
                                                     onChange={(e) => setModifiedEventMaxParticipants(parseInt(e))}>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <Text m="auto">Nombre maximum de participants
                                            calculé: {modifiedEventMaxParticipants * modifiedEventNumberOfTimeWindow}</Text>
                                    </Flex>
                                </SimpleGrid>
                                <SimpleGrid columns={{sm: 1, md: 2}} spacing='8px' mt="8px">
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Durée d'une session en minutes</FormLabel>
                                        <NumberInput defaultValue={20} min={1} value={modifiedEventTimeWindowDuration}
                                                     onChange={(e) => setModifiedEventTimeWindowDuration(parseInt(e))}>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Nombre de session</FormLabel>
                                        <NumberInput defaultValue={3} min={1} value={modifiedEventNumberOfTimeWindow}
                                                     onChange={(e) => setModifiedEventNumberOfTimeWindow(parseInt(e))}>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                </SimpleGrid>
                                {modifiedEvent?.recurring && (
                                    <Flex direction="column">
                                        <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                            Attention, cet événement est récurrent. Si vous modifiez le nom, la description ou le
                                            référent, tous les événements associés seront modifiés.
                                        </Text>
                                        {(modifiedEventMaxParticipants !== modifiedEvent.timeWindows[0].maxParticipants ||
                                            modifiedEventTimeWindowDuration !== (modifiedEvent.timeWindows[0].endTime.getTime() - modifiedEvent.timeWindows[0].startTime.getTime()) / (60 * 1000) ||
                                            modifiedEventNumberOfTimeWindow !== modifiedEvent.timeWindows.length) && (
                                            <Flex direction="column">
                                                <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                                    Si vous modifiez le nombre maximum de participants, la durée des
                                                    sessions ou le nombre de session, les événements associés ne seront
                                                    pas modifiés par défaut. Vous pouvez cependant demander à les
                                                    modifier en cochant la case ci-dessous. Dans ce cas, seuls les
                                                    événements futurs seront modifiés.
                                                </Text>
                                                <Flex direction="row" mt="4px" mb="4px" align="center">
                                                    <Switch size="md"
                                                            onChange={() => setModifyAllSessions(!modifyAllSessions)}
                                                            isChecked={modifyAllSessions} mr="8px"/>
                                                    <Text>
                                                        {modifyAllSessions ? "Modifier le nombre max de participants, la durée des sessions ou le nombre de session pour tout les événements associés" : "Ne pas modifier le nombre max de participants, la durée des sessions ou le nombre de session pour les événements associés"}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        )}
                                    </Flex>
                                )}
                            </FormControl>
                            <Text> Plage{modifiedEvent.timeWindows.length > 1 ? "s" : ""} horaire{modifiedEvent.timeWindows.length > 1 ? "s" : ""} avant modification</Text>
                            <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} spacing='24px'>
                                {modifiedEvent.timeWindows.sort((a, b) => a.startTime.getTime() > b.startTime.getTime()).map((timeWindow, index) => (
                                    <Card key={index}>
                                        <Flex direction="column">
                                            <Flex direction="row">
                                                <Text fontSize="sm"
                                                      fontWeight="semibold">De {timeWindow.startTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')} à {timeWindow.endTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')}</Text>
                                            </Flex>
                                            <Text>Participants: {timeWindow.participants.length} / {timeWindow.maxParticipants}</Text>
                                            <Progress
                                                colorScheme={(timeWindow.participants.length / timeWindow.maxParticipants) * 100 < 50 ? "green" : (timeWindow.participants.length / timeWindow.maxParticipants) * 100 < 85 ? "orange" : "red"}
                                                size="xs"
                                                value={timeWindow.participants.length / timeWindow.maxParticipants * 100}
                                                borderRadius="15px"
                                            />
                                            {timeWindow.participants.map((participant, index) => (
                                                <>
                                                    {!canReadVolunteer() && (
                                                        <Tooltip label="Vous n'avez pas les droits">
                                                            <Text color="transparent" textShadow="0 0 8px #000">
                                                                James bond
                                                            </Text>
                                                        </Tooltip>
                                                    )}
                                                    {beneficiaries.length === 0 && canReadBeneficiary() && (
                                                        <Text key={index}>{participant}</Text>
                                                    )}
                                                    {beneficiaries.length > 0 && (
                                                        <Text key={index}>{beneficiaries.filter(beneficiary => beneficiary.id === participant)[0].firstName} {beneficiaries.filter(beneficiary => beneficiary.id === participant)[0].lastName}</Text>
                                                    )}
                                                </>
                                            ))}
                                        </Flex>
                                    </Card>
                                ))}
                            </SimpleGrid>
                            <Text>Plage{modifiedEvent.timeWindows.length > 1 ? "s" : ""} horaire{modifiedEvent.timeWindows.length > 1 ? "s" : ""} après modification</Text>
                            <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} spacing='24px'>
                                {[...Array(modifiedEventNumberOfTimeWindow)].map((e, i) => (
                                    <Card key={i}>
                                        <Flex direction="column">
                                            <Flex direction="row">
                                                <Text fontSize="sm" fontWeight="semibold">De {new Date(new Date(
                                                    parseInt(modifiedEventStartDate.split("-")[0]),
                                                    parseInt(modifiedEventStartDate.split("-")[1]) - 1,
                                                    parseInt(modifiedEventStartDate.split("-")[2]),
                                                    parseInt(modifiedEventStartTime.split(":")[0]),
                                                    parseInt(modifiedEventStartTime.split(":")[1])
                                                ).getTime() + (modifiedEventTimeWindowDuration * i) * 60 * 1000).toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')} à {new Date(new Date(
                                                    parseInt(modifiedEventStartDate.split("-")[0]),
                                                    parseInt(modifiedEventStartDate.split("-")[1]) - 1,
                                                    parseInt(modifiedEventStartDate.split("-")[2]),
                                                    parseInt(modifiedEventStartTime.split(":")[0]),
                                                    parseInt(modifiedEventStartTime.split(":")[1])
                                                ).getTime() + (modifiedEventTimeWindowDuration * (i + 1)) * 60 * 1000).toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')}</Text>
                                            </Flex>
                                            <Text>Participants: {modifiedEventMaxParticipants}</Text>
                                        </Flex>
                                    </Card>
                                ))}
                            </SimpleGrid>
                            <Box h="48px"/>
                            <Flex direction="row" justifyContent="space-between" alignItems="center">
                                <Stat maxW="45%">
                                    <StatLabel>{initialEvent.name} du {initialEvent.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")} au {initialEvent.endDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</StatLabel>
                                    <StatNumber>
                                        <Icon as={FaUser}/>
                                        {initialEvent.numberOfParticipants} / {initialEvent.maxParticipants} participants
                                    </StatNumber>
                                    {volunteers.length === 0 && (
                                        <StatHelpText>
                                            {modifiedEvent.description}<br/>Référent: {initialEvent.referrerId}
                                        </StatHelpText>
                                    )}
                                    {volunteers.length > 0 && (
                                        <StatHelpText>
                                            {modifiedEvent.description}<br/>Référent: {volunteers.filter(v => v.id == initialEvent.referrerId)[0].firstName} {volunteers.filter(v => v.id == initialEvent.referrerId)[0].lastName}
                                        </StatHelpText>
                                    )}
                                </Stat>
                                <Icon as={FaArrowRight} h="8" w="8" mr="12px"/>
                                <Stat maxW="45%">
                                    <StatLabel>{modifiedEvent.name} le {modifiedEvent.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")} au {modifiedEvent.endDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</StatLabel>
                                    <StatNumber>
                                        <Icon as={FaUser}/>
                                        {modifiedEvent.numberOfParticipants} / {modifiedEventMaxParticipants * modifiedEventNumberOfTimeWindow} participants
                                    </StatNumber>
                                    {volunteers.length === 0 && (
                                        <StatHelpText>
                                            {modifiedEvent.description}<br/>Référent: {modifiedEvent.referrerId}
                                        </StatHelpText>
                                    )}
                                    {volunteers.length > 0 && (
                                        <StatHelpText>
                                            {modifiedEvent.description}<br/>Référent: {volunteers.filter(v => v.id == modifiedEvent.referrerId)[0].firstName} {volunteers.filter(v => v.id == modifiedEvent.referrerId)[0].lastName}
                                        </StatHelpText>
                                    )}
                                </Stat>
                            </Flex>
                            {modifyEventError !== "" && (
                                <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                    {modifyEventError}
                                </Text>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="green" isLoading={updateInProgress} onClick={modifyEvent} isDisabled={
                            modifiedEvent === initialEvent &&
                            modifiedEvent !== undefined &&
                            modifiedEventStartDate === modifiedEvent.startDate.toISOString().substring(0, 10) &&
                            modifiedEventStartTime === modifiedEvent.startDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) &&
                            modifiedEventEndDate === modifiedEvent.endDate.toISOString().substring(0, 10) &&
                            modifiedEventEndTime === modifiedEvent.endDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) &&
                            modifiedEventMaxParticipants === modifiedEvent.timeWindows[0].maxParticipants &&
                            modifiedEventTimeWindowDuration === (modifiedEvent.timeWindows[0].endTime.getTime() - modifiedEvent.timeWindows[0].startTime.getTime()) / (60 * 1000) &&
                            modifiedEventNumberOfTimeWindow === modifiedEvent.timeWindows.length}>
                            Modifier
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenModifyAllModal} onClose={onCloseModifyAllModal} size="xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Confirmer la modification de {eventSessions.filter(event => event.startDate.getTime() > Date.now()).length} événements</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {isCallingGetAllSessions && (
                            <Flex direction="column">
                                <Progress isIndeterminate="true" />
                            </Flex>
                        )}
                        {!isCallingGetAllSessions && (
                            <Flex direction="column">
                                <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                    Attention, vous êtes sur le point de modifier {eventSessions.filter(event => event.startDate.getTime() > Date.now()).length} événements pour la
                                    raison suivante:
                                </Text>
                                {modifiedEvent?.name !== initialEvent.name && (
                                    <Text fontSize="sm" color="red.500">Mise à jour du nom de l'événement</Text>
                                )}
                                {modifiedEvent?.description !== initialEvent.description && (
                                    <Text fontSize="sm" color="red.500">Mise à jour de la description de l'événement</Text>
                                )}
                                {modifiedEvent?.referrerId !== initialEvent.referrerId && (
                                    <Text fontSize="sm" color="red.500">Mise à jour du référent de l'événement</Text>
                                )}
                                {modifyAllSessions && (modifiedEventMaxParticipants * modifiedEventNumberOfTimeWindow !== initialEvent.maxParticipants || modifiedEventNumberOfTimeWindow !== initialEvent.timeWindows.length) && (
                                    <Text fontSize="sm" color="red.500">Mise à jour demandé des sessions pour l'événement. Seuls les événements futurs seront impactées.</Text>
                                )}
                                {eventSessions.filter(event => event.startDate.getTime() > Date.now()).map((event, index, arr) => {
                                    return (
                                        <TimelineRow
                                            logo={event.endDate.getTime() < Date.now() ? CheckIcon : CalendarIcon}
                                            title={event.name}
                                            date={event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                            color={event.endDate.getTime() < Date.now() ? "green.500" : "blue.500"}
                                            index={index}
                                            arrLength={arr.length}
                                            key={index}
                                        />
                                    )
                                })}
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseModifyAllModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" onClick={modifyAllEventSessions} disabled={isCallingGetAllSessions}>
                            Modifier tout les événements
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
