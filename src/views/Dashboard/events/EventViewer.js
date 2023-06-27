import React, {useContext} from "react";
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

export default function EventViewer(props) {

    if(props.eventSessionId === undefined){
        return null;
    }
    const {events} = useContext(EventContext);
    const event = events.find((ev) => ev.sessionId == props.eventSessionId);

    const {isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal} = useDisclosure();

    return (
        <>
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
                                <Text>Référent: {event.referrerId}</Text>
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
