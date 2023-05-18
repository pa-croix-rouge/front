import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import {
    Button,
    Flex, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Progress, Stat, StatHelpText, StatLabel, StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import CardBody from "../../components/Card/CardBody";
import React, {useContext, useState} from "react";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile, getVolunteerById} from "../../controller/VolunteerController";
import {deleteEventById, getAllEvents} from "../../controller/EventController";
import {FaArrowRight, FaPencilAlt, FaPlus, FaTrashAlt, FaUser} from "react-icons/fa";

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
    const { isOpen: isOpenCreationModal, onOpen: onOpenCreationModal, onClose: onCloseCreationModal } = useDisclosure();
    const { isOpen: isOpenEditionModal, onOpen: onOpenEditionModal, onClose: onCloseEditionModal } = useDisclosure();
    const [modifiedEvent, setModifiedEvent] = useState(undefined);
    const { isOpen: isOpenDeletionModal, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();
    const [callDeleteEvent, setCallDeleteEvent] = useState(false);

    const loadVolunteer = () => {
        setLoadedVolunteer(true)
        if (token === undefined) {
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

    const deleteEvent = () => {
        setCallDeleteEvent(false);
        if (selectedEvent !== undefined) {
            const eventId = selectedEvent.eventId;
            const sessionId = selectedEvent.sessionId;
            deleteEventById(eventId, sessionId)
                .then(() => {
                    onCloseDeletionModal();
                    setSelectedEvent(undefined);
                    setEvents(events.filter((el) => el.id !== eventId));
                    setLoadedEvents(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("No event selected");
        }
    }

    return (
        <>
            <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                {!loadedVolunteer && loadVolunteer()}
                {!loadedEvents && volunteer && loadEvents()}
                {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
                <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex direction='row' justifyContent="space-between">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                Gestion des événements
                            </Text>
                            <Button p="0px" variant="outline" colorScheme="green" mr="10%" onClick={onOpenCreationModal}>
                                <Flex cursor="pointer" align="center" p="12px">
                                    <Icon as={FaPlus} />
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
                                </Tr>
                            </Thead>
                            <Tbody>
                                {events.map((event, index, arr) => {
                                    return (
                                        <Tr key={index}>
                                            <Td
                                                pl="0px"
                                                borderColor={borderColor}
                                                borderBottom={index === arr.length - 1 ? "none" : null}>
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
                                                    {event.startDate.toISOString().substring(0, 19).replaceAll('-', '/').replace('T', ' à ')}
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
                                                <Button p="0px" bg="transparent" variant="no-effects" onClick={() => {setModifiedEvent(selectedEvent); selectEventForModal(event, onOpenEditionModal)}}>
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
            <Modal isOpen={isOpenCreationModal} onClose={onCloseCreationModal} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Etes-vous sûr de vouloir creer un événement ?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseCreationModal}>
                            Annuler
                        </Button>
                        <Button variant="ghost">
                            Ajouter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenEditionModal} onClose={onCloseEditionModal} size="6xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modification de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column">
                            <Text>
                                Etes-vous sûr de vouloir editer cet événement ?
                            </Text>
                            {selectedEvent !== undefined && modifiedEvent !== undefined && (
                                <Flex direction="row" justifyContent="space-between" alignItems="center">
                                    <Stat maxW="45%">
                                        <StatLabel>{selectedEvent.name} le {selectedEvent.startDate.toISOString().substring(0, 19).replaceAll('-', '/').replace('T', ' à ')}</StatLabel>
                                        <StatNumber><Icon as={FaUser}/> {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants} participants</StatNumber>
                                        <StatHelpText>{selectedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(selectedEvent.referrerId)] : selectedEvent.referrerId}</StatHelpText>
                                    </Stat>
                                    <Icon as={FaArrowRight} h="8" w="8" mr="12px" />
                                    <Stat maxW="45%">
                                        <StatLabel>{modifiedEvent.name} le {modifiedEvent.startDate.toISOString().substring(0, 19).replaceAll('-', '/').replace('T', ' à ')}</StatLabel>
                                        <StatNumber><Icon as={FaUser}/> {modifiedEvent.numberOfParticipants} / {modifiedEvent.maxParticipants} participants</StatNumber>
                                        <StatHelpText>{modifiedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(modifiedEvent.referrerId)] : modifiedEvent.referrerId}</StatHelpText>
                                    </Stat>
                                </Flex>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseEditionModal}>
                            Annuler
                        </Button>
                        <Button variant="outline">
                            Modifier
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDeletionModal} onClose={onCloseDeletionModal} size="full" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmer la suppression de l'événement</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedEvent !== undefined && (
                            <Stat>
                                <StatLabel>{selectedEvent.name} le {selectedEvent.startDate.toISOString().substring(0, 19).replaceAll('-', '/').replace('T', ' à ')}</StatLabel>
                                <StatNumber><Icon as={FaUser}/> {selectedEvent.numberOfParticipants} / {selectedEvent.maxParticipants} participants</StatNumber>
                                <StatHelpText>{selectedEvent.description}<br />Référent: {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(selectedEvent.referrerId)] : selectedEvent.referrerId}</StatHelpText>
                            </Stat>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseDeletionModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="red" onClick={() => setCallDeleteEvent(true)}>
                            Supprimer
                        </Button>
                    </ModalFooter>
                    {selectedEvent !== undefined && callDeleteEvent && deleteEvent()}
                </ModalContent>
            </Modal>
        </>
    )
}
