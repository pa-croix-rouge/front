import React, {useContext, useState} from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    SimpleGrid,
    Flex,
    RadioGroup,
    Radio,
    Textarea,
    Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Box, Icon
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import {FaPlus} from "react-icons/fa";
import {createRecurrentEvent, createSingleEvent} from "../../../controller/EventController";
import {SingleEventCreation} from "../../../model/event/SingleEventCreation";
import {RecurrentEventCreation} from "../../../model/event/RecurrentEventCreation";
import VolunteerContext from "../../../contexts/VolunteerContext";

export default function EventCreation(props) {

    const {volunteer, setVolunteer} = useContext(VolunteerContext);

    const [eventType, setEventType] = useState("unique");
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventReferrer, setEventReferrer] = useState("");
    const [eventMaxParticipants, setEventMaxParticipants] = useState(10);
    const [eventTimeWindowDuration, setEventTimeWindowDuration] = useState(20);
    const [eventNumberOfTimeWindow, setEventNumberOfTimeWindow] = useState(3);
    const [eventStartDate, setEventStartDate] = useState(new Date().toISOString().substring(0, 10));
    const [eventStartTime, setEventStartTime] = useState(new Date(0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [eventLastDate, setEventLastDate] = useState(new Date().toISOString().substring(0, 10));
    const [eventRecurrence, setEventRecurrence] = useState(7);
    const [eventError, setEventError] = useState("");
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);

    const createEvent = () => {
        setEventError("");
        if (eventName === "") {
            setEventError("Veuillez entrer un nom pour l'évènement");
            return;
        }
        if (eventReferrer === "") {
            setEventError("Veuillez sélectionner un référent");
            return;
        }
        if (eventStartDate === "") {
            setEventError("Veuillez entrer une date de début");
            return;
        }
        if (eventStartTime === "") {
            setEventError("Veuillez entrer une heure de début");
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

        if (eventNumberOfTimeWindow < 1) {
            setEventError("Veuillez entrer au moins une session");
            return;
        }

        if (eventTimeWindowDuration < 1) {
            setEventError("Une session ne peut pas durer moins d'une minute");
            return;
        }

        if (eventMaxParticipants < 0) {
            setEventError("Une session doit avoir un nombre de participants positif");
            return;
        }

        if (eventType === "unique") {
            setIsCreatingEvent(true)
            createSingleEvent(new SingleEventCreation(eventName, eventDescription, eventStart.getTime(), eventReferrer, volunteer.localUnitId, eventTimeWindowDuration, eventNumberOfTimeWindow, eventMaxParticipants))
                .then((id) => {
                    setIsCreatingEvent(false)
                    props.onNewEvent(id);
                    props.onClose();
                    // setLoadedEvents(false);
                })
                .catch((_) => {
                    setIsCreatingEvent(false)
                    setEventError("Impossible de créer l'évènement, une erreur serveur c'est produite, veuillez réessayer plus tard");
                });
        } else {
            try {
                const [years, months, days] = eventLastDate.split("-");
                eventEnd = new Date(
                    parseInt(years),
                    parseInt(months) - 1,
                    parseInt(days),
                    23,
                    59,
                );
                if (eventStart < new Date()) {
                    setEventError("La date de début doit être dans le futur");
                    return;
                }
            } catch (error) {
                setEventError("Veuillez entrer une date de fin valide");
                return;
            }
            if (eventEnd.getTime() < eventStart.getTime()) {
                setEventError("La date de fin doit être après la date de début");
                return;
            }
            setIsCreatingEvent(true)
            createRecurrentEvent(new RecurrentEventCreation(eventName, eventDescription, eventReferrer, volunteer.localUnitId, eventStart.getTime(), eventEnd.getTime(), eventRecurrence, eventTimeWindowDuration, eventNumberOfTimeWindow, eventMaxParticipants))
                .then((id) => {
                    setIsCreatingEvent(false)
                    props.onNewEvent(id);
                    props.onClose();
                    // setLoadedEvents(false);
                })
                .catch((_) => {
                    setIsCreatingEvent(false)
                    setEventError("Impossible de créer l'évènement, une erreur serveur c'est produite, veuillez réessayer plus tard");
                });
        }
    }

    return (
        <>
            {isNaN(eventMaxParticipants) && setEventMaxParticipants(0)}
            {isNaN(eventTimeWindowDuration) && setEventTimeWindowDuration(1)}
            {isNaN(eventNumberOfTimeWindow) && setEventNumberOfTimeWindow(1)}
            {isNaN(eventRecurrence) && setEventRecurrence(1)}
            <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
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
                                    {props.volunteers.map((v, index) => {
                                        return (
                                            <option key={index} value={v.id}>{v.firstName} {v.lastName}</option>
                                        );
                                    })}
                                </Select>
                                <Text mt="16px" fontWeight="semibold" fontSize="md">Configuration des plages horaires</Text>
                                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='24px' mt="8px">
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Nombre de participants par plage horaire</FormLabel>
                                        <NumberInput defaultValue={10} min={0} value={eventMaxParticipants} onChange={(e) => setEventMaxParticipants(parseInt(e))}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <Text m="auto">Nombre maximum de participants calculé: {eventMaxParticipants * eventNumberOfTimeWindow}</Text>
                                    </Flex>
                                </SimpleGrid>
                                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='8px' mt="8px">
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Durée d'une session en minutes</FormLabel>
                                        <NumberInput defaultValue={20} min={1} value={eventTimeWindowDuration} onChange={(e) => setEventTimeWindowDuration(parseInt(e))}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                    <Flex direction="column" ml="16px" mr="16px">
                                        <FormLabel>Nombre de session</FormLabel>
                                        <NumberInput defaultValue={3} min={1} value={eventNumberOfTimeWindow} onChange={(e) => setEventNumberOfTimeWindow(parseInt(e))}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Flex>
                                </SimpleGrid>
                                {eventType === "unique" && (
                                    <Box>
                                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='8px' mt="8px" ml="16px" mr="16px">
                                            <FormLabel m="auto">Date de début</FormLabel>
                                            <Input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)}/>
                                            <FormLabel m="auto">Heure de début</FormLabel>
                                            <Input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)}/>
                                        </SimpleGrid>
                                        {(eventStartDate === "" || eventStartTime === "") && (
                                            <Text m="auto" color="red.500">
                                                Date de fin incalculable, veuillez entrer une date et une heure de début
                                            </Text>
                                        )}
                                        {eventStartDate !== "" && eventStartTime !== "" && (
                                            <Text m="auto">
                                                Date de fin calculée: {new Date(new Date(
                                                parseInt(eventStartDate.split("-")[0]),
                                                parseInt(eventStartDate.split("-")[1]) - 1,
                                                parseInt(eventStartDate.split("-")[2]),
                                                parseInt(eventStartTime.split(":")[0]),
                                                parseInt(eventStartTime.split(":")[1])
                                            ).getTime() + (eventTimeWindowDuration * eventNumberOfTimeWindow) * 60 * 1000).toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}
                                            </Text>
                                        )}
                                    </Box>
                                )}
                                {eventType === "recurring" && (
                                    <Box>
                                        <FormLabel>Période de l'événement récurrent</FormLabel>
                                        <SimpleGrid columns={{ sm: 1, md: 1, xl: 2 }} spacing='8px'>
                                            <Flex direction="row" ml="16px" mr="16px">
                                                <FormLabel m="auto" maxW="50%" >Premier jour</FormLabel>
                                                <Input type="date" maxW="50%" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)}/>
                                            </Flex>
                                            <Flex direction="row" ml="16px" mr="16px">
                                                <FormLabel m="auto" maxW="50%">Dernier jour</FormLabel>
                                                <Input type="date" maxW="50%" value={eventLastDate} onChange={(e) => setEventLastDate(e.target.value)}/>
                                            </Flex>
                                            <Flex direction="row" ml="16px" mr="16px">
                                                <FormLabel maxW="50%" m="auto">Heure de début de l'événement</FormLabel>
                                                <Input type="time" maxW="50%" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)}/>
                                            </Flex>
                                            <Text m="auto">Date de fin calculée: {new Date(new Date(
                                                parseInt(eventStartDate.split("-")[0]),
                                                parseInt(eventStartDate.split("-")[1]) - 1,
                                                parseInt(eventStartDate.split("-")[2]),
                                                parseInt(eventStartTime.split(":")[0]),
                                                parseInt(eventStartTime.split(":")[1])
                                            ).getTime() + (eventTimeWindowDuration * eventNumberOfTimeWindow) * 60 * 1000).toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</Text>
                                        </SimpleGrid>
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
                                <Text mt="16px" fontWeight="semibold" fontSize="md">Visualisation des plages horaires:</Text>
                                {(eventStartDate === "" || eventStartTime === "") && (
                                    <Text m="auto" color="red.500">
                                        Plages horaires incalculables, veuillez entrer une date et une heure de début
                                    </Text>
                                )}
                                <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing='24px'>
                                    {!isNaN(eventNumberOfTimeWindow) && eventStartDate !== "" && eventStartTime !== "" && (
                                        <>
                                            {[...Array(eventNumberOfTimeWindow)].map((e, i) => (
                                                <Card key={i}>
                                                    <Flex direction="column">
                                                        <Flex direction="row">
                                                            <Text fontSize="sm" fontWeight="semibold">De {new Date(new Date(
                                                                parseInt(eventStartDate.split("-")[0]),
                                                                parseInt(eventStartDate.split("-")[1]) - 1,
                                                                parseInt(eventStartDate.split("-")[2]),
                                                                parseInt(eventStartTime.split(":")[0]),
                                                                parseInt(eventStartTime.split(":")[1])
                                                            ).getTime() + (eventTimeWindowDuration * i) * 60 * 1000).toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')} à {new Date(new Date(
                                                                parseInt(eventStartDate.split("-")[0]),
                                                                parseInt(eventStartDate.split("-")[1]) - 1,
                                                                parseInt(eventStartDate.split("-")[2]),
                                                                parseInt(eventStartTime.split(":")[0]),
                                                                parseInt(eventStartTime.split(":")[1])
                                                            ).getTime() + (eventTimeWindowDuration * (i + 1)) * 60 * 1000).toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')}</Text>
                                                        </Flex>
                                                        <Text>Participants: {eventMaxParticipants}</Text>
                                                    </Flex>
                                                </Card>
                                            ))}
                                        </>
                                    )}
                                </SimpleGrid>
                                {eventError !== "" && (
                                    <Text fontSize="sm" color="red" fontWeight="semibold">
                                        {eventError}
                                    </Text>
                                )}
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                            Annuler
                        </Button>
                        <Button p="0px" variant="outline" colorScheme="green" mr="10%" onClick={createEvent} disabled={isCreatingEvent}>
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
        </>
    );
}
