import {
    Box,
    Button, Center,
    Flex, SimpleGrid, Stat, StatLabel, StatNumber,
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
import {getAllEvents, getEventsStats} from "../../controller/EventController";
import IconBox from "../../components/Icons/IconBox";
import {CartIcon, DocumentIcon, GlobeIcon, WalletIcon} from "../../components/Icons/Icons";
import {EventsStats} from "../../model/event/EventsStats";

export default function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textTableColor = useColorModeValue("gray.500", "white");
    const iconBlue = useColorModeValue("blue.500", "blue.500");
    const iconBoxInside = useColorModeValue("white", "white");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadedReferrers, setLoadedReferrers] = useState(false);
    const [loadedStats, setLoadedStats] = useState(false);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const {token} = useContext(TokenContext);
    const [events, setEvents] = useState([]);
    const [referrersId, setReferrersId] = useState([]);
    const [referrersName, setReferrersName] = useState([]);
    const [stats, setStats] = useState(new EventsStats(0, 0, 0, 0));

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

    const loadStats = () => {
        setLoadedStats(true);
        getEventsStats(volunteer.localUnitId)
            .then((stats) => {
                setStats(stats);
            })
            .catch((_) => {
                setLoadedStats(false);
            });
    }

    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }} mr='32px'>
            {!loadedVolunteer && loadVolunteer()}
            {!loadedEvents && volunteer && loadEvents()}
            {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
            {!loadedStats && volunteer && loadStats()}
            <SimpleGrid columns={{ sm: 1, md: 2, xl: 5 }} spacing='24px' mb='8px'>
                <Card minH='100px'>
                    <Flex direction='column'>
                        <Flex
                            flexDirection='row'
                            align='center'
                            justify='center'
                            w='100%'
                            mb='8px'>
                            <Stat me='auto'>
                                <StatLabel
                                    fontSize='xs'
                                    color='gray.400'
                                    fontWeight='bold'
                                    textTransform='uppercase'>
                                    Nombre d'événements dans le mois
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                        {stats.numberOfEventsOverTheMonth}
                                    </StatNumber>
                                </Flex>
                            </Stat>
                            <IconBox
                                borderRadius='50%'
                                as='box'
                                h={"45px"}
                                w={"45px"}
                                bg={iconBlue}>
                                <WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                            </IconBox>
                        </Flex>
                    </Flex>
                </Card>
                <Card minH='100px'>
                    <Flex direction='column'>
                        <Flex
                            flexDirection='row'
                            align='center'
                            justify='center'
                            w='100%'
                            mb='8px'>
                            <Stat me='auto'>
                                <StatLabel
                                    fontSize='xs'
                                    color='gray.400'
                                    fontWeight='bold'
                                    textTransform='uppercase'>
                                    Nombres de bénéficiaires ce mois
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                        {stats.totalParticipantsOverTheMonth}
                                    </StatNumber>
                                </Flex>
                            </Stat>
                            <IconBox
                                borderRadius='50%'
                                as='box'
                                h={"45px"}
                                w={"45px"}
                                bg={iconBlue}>
                                <DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                            </IconBox>
                        </Flex>
                    </Flex>
                </Card>
                <Card minH='100px'>
                    <Flex direction='column'>
                        <Flex
                            flexDirection='row'
                            align='center'
                            justify='center'
                            w='100%'
                            mb='8px'>
                            <Stat me='auto'>
                                <StatLabel
                                    fontSize='xs'
                                    color='gray.400'
                                    fontWeight='bold'
                                    textTransform='uppercase'>
                                    Nombre d'événements sur 12 mois
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                        {stats.numberOfEventsOverTheYear}
                                    </StatNumber>
                                </Flex>
                            </Stat>
                            <IconBox
                                borderRadius='50%'
                                as='box'
                                h={"45px"}
                                w={"45px"}
                                bg={iconBlue}>
                                <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                            </IconBox>
                        </Flex>
                    </Flex>
                </Card>
                <Card minH='100px'>
                    <Flex direction='column'>
                        <Flex
                            flexDirection='row'
                            align='center'
                            justify='center'
                            w='100%'
                            mb='8px'>
                            <Stat me='auto'>
                                <StatLabel
                                    fontSize='xs'
                                    color='gray.400'
                                    fontWeight='bold'
                                    textTransform='uppercase'>
                                    Nombre de bénéficiaires sur 12 mois
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                        {stats.totalParticipantsOverTheYear}
                                    </StatNumber>
                                </Flex>
                            </Stat>
                            <IconBox
                                borderRadius='50%'
                                as='box'
                                h={"45px"}
                                w={"45px"}
                                bg={iconBlue}>
                                <CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                            </IconBox>
                        </Flex>
                    </Flex>
                </Card>
                <Card minH='100px'>
                    <Flex direction='column'>
                        <Stat me='auto' minW='100%'>
                            <StatLabel
                                fontSize='xs'
                                color='gray.400'
                                fontWeight='bold'
                                textTransform='uppercase'>
                                Ajouter un événement
                            </StatLabel>
                            <Center>
                                <Button variant="outline" colorScheme="green" size="md">Ajouter</Button>
                            </Center>
                        </Stat>
                    </Flex>
                </Card>
            </SimpleGrid>
            <Flex
                flexDirection='row' overflow="scroll">
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
                                GERER LES EVENEMENTS
                            </Button>
                        </Flex>
                        <Box>
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
                                <Tbody maxH="100%">
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
                                                    {el.numberOfParticipants} / {el.maxParticipants}
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
