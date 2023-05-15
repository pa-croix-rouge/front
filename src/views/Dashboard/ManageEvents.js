import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import {
    Button,
    Flex,
    Progress,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import CardBody from "../../components/Card/CardBody";
import React, {useContext, useState} from "react";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile, getVolunteerById} from "../../controller/VolunteerController";
import {getAllEvents} from "../../controller/EventController";

export default function ManageEvents() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [events, setEvents] = useState([]);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const history = useHistory();

    const loadVolunteer = () => {
        setLoadedVolunteer(true)
        if (token === undefined) {
            history.push("/auth/signin");
        } else if (volunteer === '') {
            getMyProfile()
                .then((volunteer) => {
                    setVolunteer(volunteer);
                })
                .catch((error) => {
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
            .catch((error) => {
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
                .catch((error) => {
                });
        });
    }

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            {!loadedVolunteer && loadVolunteer()}
            {!loadedEvents && volunteer && loadEvents()}
            {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
            <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Gestion des événements
                    </Text>
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
                                                {event.startDate.toISOString().substring(0, 19)}
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
                                            <Button p="0px" bg="transparent" variant="no-effects">
                                                <Text
                                                    fontSize="md"
                                                    color="gray.400"
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                >
                                                    Modifier
                                                </Text>
                                            </Button>
                                        </Td>
                                        <Td borderColor={borderColor} borderBottom={index === arr.length ? "none" : null}>
                                            <Button p="0px" bg="transparent" variant="no-effects">
                                                <Text
                                                    fontSize="md"
                                                    color="red"
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                >
                                                    Supprimer
                                                </Text>
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
    )
}
