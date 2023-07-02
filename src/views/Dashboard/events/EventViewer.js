import React, {useContext, useState} from "react";
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    SimpleGrid,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import EventEdition from "./EventEdition";
import EventContext from "../../../contexts/EventContext";
import {getBeneficiaries} from "../../../controller/BeneficiariesController";
import {getVolunteers} from "../../../controller/VolunteerController";

export default function EventViewer(props) {
    const {isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal} = useDisclosure();
    const {events} = useContext(EventContext);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loadedBeneficiaries, setLoadedBeneficiaries] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [loadedVolunteers, setLoadedVolunteers] = useState(false);

    const loadBeneficiaries = () => {
        setLoadedBeneficiaries(true);
        getBeneficiaries()
            .then((res) => {
                setBeneficiaries(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if(props.eventSessionId === undefined){
        return null;
    }
    const event = events.find((ev) => ev.sessionId === props.eventSessionId);
    if(event === undefined){
        return null;
    }

    const loadVolunteers = () => {
        setLoadedVolunteers(true);
        getVolunteers()
            .then((res) => {
                setVolunteers(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            {!loadedBeneficiaries && loadBeneficiaries()}
            {!loadedVolunteers && loadVolunteers()}
            <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Détails de l'événement</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Flex direction="column">
                            <Flex direction="column">
                                <Text fontSize="2xl" fontWeight="bold">{event.name}</Text>
                                <Text><i>{event.description}</i></Text>
                                <Text>Du {event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")} au {event.endDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</Text>
                                {volunteers.length === 0 && (
                                    <Text>Référent: {event.referrerId}</Text>
                                )}
                                {volunteers.length > 0 && (
                                    <Text>Référent: {volunteers.filter(volunteer => volunteer.id === event.referrerId)[0].firstName} {volunteers.filter(volunteer => volunteer.id === event.referrerId)[0].lastName}</Text>
                                )}
                                <Text>Participants: {event.numberOfParticipants} / {event.maxParticipants}</Text>
                                <Text>Plage{event.timeWindows.length > 1 ? "s" : ""} horaire{event.timeWindows.length > 1 ? "s" : ""}</Text>
                                <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} spacing='24px'>
                                    {event.timeWindows.map((timeWindow, index) => (
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
                                                        {beneficiaries.length === 0 && (
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
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onOpenEditionModal}>
                            Editer
                        </Button>

                        <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                            Fermer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <EventEdition isOpen={isOpenEditionModal} onClose={onCloseEditionModal} volunteers={props.volunteers}
                          eventSessionId={props.eventSessionId}></EventEdition>
        </>
    );
}
