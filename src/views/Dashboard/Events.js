import {
    Box,
    Button,
    Flex,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import Card from "./../../components/Card/Card.js";
import React, {useContext, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import VolunteerContext from "../../contexts/VolunteerContext";
import {getMyProfile, getVolunteerById} from "../../controller/VolunteerController";
import TokenContext from "../../contexts/TokenContext";
import {getAllEvents} from "../../controller/EventController";

export default function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textTableColor = useColorModeValue("gray.500", "white");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const {token} = useContext(TokenContext);
    const [events, setEvents] = useState([]);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);

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
                console.log(events);
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
        console.log(referrersId);
        referrersId.forEach(el => {
            getVolunteerById(el)
                .then((volunteer) => {
                    console.log(volunteer);
                    setReferrersName([...referrersName, volunteer.firstName + ' ' + volunteer.lastName]);
                })
                .catch((error) => {
                });
        });
    }

    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }} mr='32px'>
            {!loadedVolunteer && loadVolunteer()}
            {!loadedEvents && volunteer && loadEvents()}
            {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
            <Flex
                flexDirection='row'>
                <Card
                    p='8px'
                    maxW={{ sm: "320px", md: "100%" }}
                    m='24px'>
                    <Box minH='320px' margin='8px'>
                        <FullCalendar
                            plugins={[ dayGridPlugin ]}
                            initialView="dayGridMonth"
                            locale='fr'
                            footerToolbar={
                                {
                                    left: '',
                                    center: '',
                                    right: ''
                                }
                            }
                            events={events !== [] ? events.map((el, index) => {return {id: index, title: el.name, start: el.startDate.toISOString().substring(0, 10), end: el.endDate.toISOString().substring(0, 10)}}) : []}
                        />
                    </Box>
                </Card>
                <Card p='0px' maxW={{ sm: "320px", md: "100%" }} m='24px'>
                    <Flex direction='column'>
                        <Flex align='center' justify='space-between' p='22px'>
                            <Text fontSize='lg' color={textColor} fontWeight='bold'>
                                Liste des évènements
                            </Text>
                            <Button variant='primary' maxH='30px'>
                                VOIR TOUS
                            </Button>
                        </Flex>
                        <Box overflow={{ sm: "scroll", lg: "hidden" }}>
                            <Table>
                                <Thead>
                                    <Tr bg={tableRowColor}>
                                        <Th color='gray.400' borderColor={borderColor}>
                                            Nom de l'évènement
                                        </Th>
                                        <Th color='gray.400' borderColor={borderColor}>
                                            Date
                                        </Th>
                                        <Th color='gray.400' borderColor={borderColor}>
                                            Responsable
                                        </Th>
                                        <Th color='gray.400' borderColor={borderColor}>
                                            Nombre d'inscrits
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody overflow="scroll" maxH="100%">
                                    {events.map((el, index, arr) => {
                                        return (
                                            <Tr key={index}>
                                                <Td
                                                    color={textTableColor}
                                                    fontSize='sm'
                                                    fontWeight='bold'
                                                    borderColor={borderColor}
                                                    border={index === arr.length - 1 ? "none" : null}>
                                                    {el.name}
                                                </Td>
                                                <Td
                                                    color={textTableColor}
                                                    fontSize='sm'
                                                    border={index === arr.length - 1 ? "none" : null}
                                                    borderColor={borderColor}>
                                                    {`${el.startDate.getDate().toString().padStart(2, '0')}/${(el.startDate.getMonth() + 1).toString().padStart(2, '0')}/${el.startDate.getFullYear()} - ${el.startDate.getHours().toString().padStart(2, '0')}:${el.startDate.getMinutes().toString().padStart(2, '0')}`}
                                                </Td>
                                                <Td
                                                    color={textTableColor}
                                                    fontSize='sm'
                                                    border={index === arr.length - 1 ? "none" : null}
                                                    borderColor={borderColor}>
                                                    {referrersId.length === referrersName.length ? referrersName[referrersId.indexOf(el.referrerId)] : el.referrerId}
                                                </Td>
                                                <Td
                                                    color={textTableColor}
                                                    fontSize='sm'
                                                    border={index === arr.length - 1 ? "none" : null}
                                                    borderColor={borderColor}>
                                                    {el.numberOfParticipants}
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </Box>
                    </Flex>
                </Card>
            </Flex>
            <Box
                h="20px"/>
        </Flex>
    );
}
