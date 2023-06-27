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
    Textarea,
    useDisclosure
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import {FaArrowRight, FaUser} from "react-icons/fa";
import {getEventSessions, updateAllEventSessions, updateEventSession} from "../../../controller/EventController";
import TimelineRow from "../../../components/Tables/TimelineRow";
import {CalendarIcon, CheckIcon} from "@chakra-ui/icons";
import EventContext from "../../../contexts/EventContext";

export default function EventEdition(props) {

    if(props.eventSessionId === undefined){
        return null;
    }

    const {events, setEvents, reloadEvents} = useContext(EventContext);
    const initialEvent = events.find((event) => event.sessionId == props.eventSessionId);


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

    useEffect(() => {
            setModifiedEvent(initialEvent)

            setModifiedEventStartDate(initialEvent.startDate.toISOString().substring(0, 10));
            setModifiedEventStartTime(initialEvent.startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
            setModifiedEventEndDate(initialEvent.endDate.toISOString().substring(0, 10));
            setModifiedEventEndTime(initialEvent.endDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));

            setModifiedEventMaxParticipants(initialEvent.timeWindows.length > 0 ? initialEvent.timeWindows[0].maxParticipants : 10);
            setModifiedEventTimeWindowDuration(initialEvent.timeWindows.length > 0 ? (initialEvent.timeWindows[0].endTime.getTime() - initialEvent.timeWindows[0].startTime.getTime()) / (60 * 1000) : 20);
            setModifiedEventNumberOfTimeWindow(initialEvent.timeWindows.length > 0 ? initialEvent.timeWindows.length : 3);
        }
        ,[props.eventSessionId])

    const {
        isOpen: isOpenModifyAllModal,
        onOpen: onOpenModifyAllModal,
        onClose: onCloseModifyAllModal
    } = useDisclosure();


    if ( modifiedEvent === undefined) {
        return null;
    }

    // useEffect(() => {
    //
    //     setModifiedEventMaxParticipants(modifiedEvent.timeWindows.length > 0 ? modifiedEvent.timeWindows[0].maxParticipants : 10);
    //     setModifiedEventTimeWindowDuration(modifiedEvent.timeWindows.length > 0 ? (modifiedEvent.timeWindows[0].endTime.getTime() - modifiedEvent.timeWindows[0].startTime.getTime()) / (60 * 1000) : 20);
    //     setModifiedEventNumberOfTimeWindow(modifiedEvent.timeWindows.length > 0 ? modifiedEvent.timeWindows.length : 3);
    // }, [modifiedEvent]);

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

        const [yearsEnd, monthsEnd, daysEnd] = modifiedEventEndDate.split("-");
        const [hoursEnd, minutesEnd] = modifiedEventEndTime.split(":");
        const eventEnd = new Date(
            parseInt(yearsEnd),
            parseInt(monthsEnd) - 1,
            parseInt(daysEnd),
            parseInt(hoursEnd),
            parseInt(minutesEnd),
        );

        setModifiedEvent({
            ...modifiedEvent,
            startDate: eventStart,
            endDate: eventEnd
        });

    }, [modifiedEventStartDate, modifiedEventStartTime, modifiedEventEndDate, modifiedEventEndTime]);

    const modifyAllEventSessions = () => {

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
            setUpdateInProgress(true);
            updateAllEventSessions(modifiedEvent, eventStart, eventEnd, modifiedEventTimeWindowDuration, modifiedEventNumberOfTimeWindow, modifiedEventMaxParticipants)
                .then(() => {
                    reloadEvents();
                    setUpdateInProgress(false);
                    onCloseModifyAllModal();
                    props.onClose();
                    setModifyAllSessions(false);
                })
                .catch((_) => {
                    setUpdateInProgress(false);
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
        if (modifiedEventMaxParticipants < modifiedEvent.timeWindows.reduce((acc, el) => acc + el.participants.length, 0)) {
            setModifyEventError("Le nombre maximum de participants ne peut pas être inférieur au nombre de participants déjà inscrits");
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

        if (!modifyAllSessions) {
            setUpdateInProgress(true);
            updateEventSession(modifiedEvent, eventStart, eventEnd, modifiedEventTimeWindowDuration, modifiedEventNumberOfTimeWindow, modifiedEventMaxParticipants)
                .then(() => {
                    reloadEvents();
                    setUpdateInProgress(false);
                    props.onClose();
                })
                .catch((_) => {
                    setUpdateInProgress(false);
                });
        } else {
            getAllSessions();
            onOpenModifyAllModal();
        }
    }

    const getAllSessions = () => {
        const eventId = modifiedEvent.eventId;
        getEventSessions(eventId)
            .then((sessions) => {
                setEventSessions(sessions);
            })
            .catch((_) => {
            });
    }

    return (
        <>
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
                                        <NumberInput defaultValue={10} min={1} value={modifiedEventMaxParticipants}
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
                                            calculé: {eventMaxParticipants * eventNumberOfTimeWindow}</Text>
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
                                            Attention, cet événement est récurrent. Si vous le nom, la description ou le
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
                                                    modifier en cochant la case ci-dessous.
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
                            <Text>Plage{modifiedEvent.timeWindows.length > 1 ? "s" : ""} horaire{modifiedEvent.timeWindows.length > 1 ? "s" : ""} avant
                                modification</Text>
                            <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} spacing='24px'>
                                {modifiedEvent.timeWindows.map((timeWindow, index) => (
                                    <Card key={index}>
                                        <Flex direction="column">
                                            <Flex direction="row">
                                                <Text fontSize="sm"
                                                      fontWeight="semibold">De {timeWindow.startTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')} à {timeWindow.endTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')}</Text>
                                            </Flex>
                                            <Text>Participants: {timeWindow.participants.length} / {timeWindow.maxParticipants}</Text>
                                            <Progress
                                                colorScheme={(timeWindow.participants.length / timeWindow.maxParticipants) * 100 > 50 ? "green" : (timeWindow.participants.length / timeWindow.maxParticipants) * 100 > 85 ? "orange" : "red"}
                                                size="xs"
                                                value={timeWindow.participants.length / timeWindow.maxParticipants * 100}
                                                borderRadius="15px"
                                            />
                                            {timeWindow.participants.map((participant, index) => (
                                                <Text key={index}>{participant}</Text>
                                            ))}
                                        </Flex>
                                    </Card>
                                ))}
                            </SimpleGrid>
                            <Text>Plage {modifiedEvent.timeWindows.length > 1 ? "s" : ""} horaire{modifiedEvent.timeWindows.length > 1 ? "s" : ""} après
                                modification</Text>
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
                                    <StatNumber><Icon
                                        as={FaUser}/> {initialEvent.numberOfParticipants} / {initialEvent.maxParticipants} participants</StatNumber>
                                    <StatHelpText>{initialEvent.description}<br/>Référent: {initialEvent.referrerId}
                                    </StatHelpText>
                                </Stat>
                                <Icon as={FaArrowRight} h="8" w="8" mr="12px"/>
                                <Stat maxW="45%">
                                    <StatLabel>{modifiedEvent.name} le {modifiedEvent.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")} au {modifiedEvent.endDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</StatLabel>
                                    <StatNumber><Icon
                                        as={FaUser}/> {modifiedEvent.numberOfParticipants} / {modifiedEventMaxParticipants * modifiedEventNumberOfTimeWindow} participants</StatNumber>
                                    <StatHelpText>{modifiedEvent.description}<br/>Référent: {modifiedEvent.referrerId}
                                    </StatHelpText>
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
                        <Button variant="outline" isLoading={updateInProgress} onClick={modifyEvent} isDisabled={
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
                    <ModalHeader>Confirmer la modification de {eventSessions.length} événements</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex direction="column">
                            <Text fontSize="sm" color="red.500" fontWeight="semibold">
                                Attention, vous êtes sur le point de modifier {eventSessions.length} événements pour la
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
                            {modifyAllSessions && modifiedEvent?.maxParticipants !== initialEvent.maxParticipants && (
                                <Text fontSize="sm" color="red.500">Mise à jour demandé du nombre maximum de
                                    participants pour tout les événements associés</Text>
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
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseModifyAllModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" onClick={modifyAllEventSessions}>
                            Modifier tout les événements
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
