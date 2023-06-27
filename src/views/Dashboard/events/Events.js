import {
    Box,
    Button,
    Center,
    CircularProgress,
    Flex,
    SimpleGrid,
    Skeleton,
    Stat,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card.js";
import React, {useContext, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getVolunteers} from "../../../controller/VolunteerController";
import {getEventForSpecificMonth, getEventsStats} from "../../../controller/EventController";
import IconBox from "../../../components/Icons/IconBox";
import {CartIcon, DocumentIcon, GlobeIcon, WalletIcon} from "../../../components/Icons/Icons";
import {EventsStats} from "../../../model/event/EventsStats";
import {useHistory} from "react-router-dom";
import EventViewer from "./EventViewer";
import EventContext from "../../../contexts/EventContext";

export default function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textTableColor = useColorModeValue("gray.500", "white");
    const iconBlue = useColorModeValue("orange.500", "orange.500");
    const iconBoxInside = useColorModeValue("white", "white");
    const history = useHistory();
    const [tableMaxHeight, setTableMaxHeight] = useState('320px');

    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [stats, setStats] = useState(new EventsStats(0, 0, 0, 0));

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [events, setEvents] = useState([]);

    const [localUnitVolunteer, setLocalUnitVolunteer] = useState([]);
    const [localUnitVolunteerLoaded, setLocalUnitVolunteerLoaded] = useState(false);
    const [localUnitVolunteerLoading, setLocalUnitVolunteerLoading] = useState(false);

    const [selectedEventSessionId, setSelectedEventSessionId] = useState(undefined);
    const {
        isOpen: isOpenVisualizationModal,
        onOpen: onOpenVisualizationModal,
        onClose: onCloseVisualizationModal
    } = useDisclosure();

    if (!localUnitVolunteerLoaded && !localUnitVolunteerLoading) {
        setLocalUnitVolunteerLoading(true);
        console.log('getVolunteers')
        getVolunteers()
            .then((volunteers) => {
                setLocalUnitVolunteerLoading(false);
                setLocalUnitVolunteer(volunteers);
                setLocalUnitVolunteerLoaded(true);
            })
            .catch((e) => {
                setLocalUnitVolunteerLoaded(false);
                setLocalUnitVolunteerLoading(false);
            });
    }

    if (localUnitVolunteerLoading) {
        return (
            <Center w='100%' h='100%'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Center>
        );
    }

    if (!loadedEvents && !loadingEvents) {
        console.log('loading events' + selectedDate.getMonth() + 1 + ' ' + selectedDate.getFullYear());
        setLoadingEvents(true);
        getEventForSpecificMonth(volunteer.localUnitId, selectedDate.getMonth() + 1, selectedDate.getFullYear())
            .then((events) => {
                setLoadingEvents(false);
                setEvents(events);
                setLoadedEvents(true);
            })
            .catch((e) => {
                console.log('loading event error: ' + e);
                setLoadingEvents(false);
                setLoadedEvents(false);
            });
    }

    if (events === undefined) {
        return (
            <Center w='100%' h='100%'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Center>
        );
    }

    const getReferrerName = (id) => {
        const vol = localUnitVolunteer.find((vol) => vol.id === volunteer.localUnitId);
        if (vol === undefined) {
            return vol.id;
        } else {
            return vol.firstName + ' ' + vol.lastName;
        }
    }

    const goToManageEvent = () => {
        history.push("/admin/manage-events");
    }

    const handleDateChange = (arg) => {
        const newDate = arg.view.currentStart;
        if (newDate.getTime() !== selectedDate.getTime()) {
            setSelectedDate(newDate);
            setLoadedEvents(false);
        }
    };

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

    const handleEventClick = (arg) => {
        setSelectedEventSessionId(arg.event.id);
        onOpenVisualizationModal();
    }

    const reloadEvents = () => {
        setLoadedEvents(false);
    }

    return (
        <EventContext.Provider value={{events, setEvents, reloadEvents}} >
            <Flex flexDirection='column' pt={{base: "120px", md: "75px"}} mr='32px'>
                <SimpleGrid columns={{sm: 1, md: 2, xl: 4}} spacing='24px' mb='8px'>
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
                                    <WalletIcon h={"24px"} w={"24px"} color={iconBoxInside}/>
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
                                    <DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside}/>
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
                                    <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside}/>
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
                                    <CartIcon h={"24px"} w={"24px"} color={iconBoxInside}/>
                                </IconBox>
                            </Flex>
                        </Flex>
                    </Card>
                </SimpleGrid>
                <Wrap>
                    <WrapItem>
                        <Card m='24px' minWidth={'500'}>
                            <Skeleton isLoaded={loadedEvents}>
                                <FullCalendar
                                    aspectRatio={0.9}
                                    plugins={[dayGridPlugin]}
                                    datesSet={handleDateChange}
                                    initialDate={selectedDate}
                                    initialView="dayGridMonth"
                                    locale='fr'
                                    footerToolbar={
                                        {
                                            left: '',
                                            center: '',
                                            right: ''
                                        }
                                    }
                                    events={events.map((el, index) => {
                                        return {
                                            id: el.sessionId,
                                            title: el.name,
                                            start: el.startDate.toISOString().substring(0, 10),
                                            end: el.endDate.toISOString().substring(0, 10)
                                        }
                                    })}
                                    eventClick={handleEventClick}
                                />
                            </Skeleton>
                        </Card>
                    </WrapItem>
                    <WrapItem>
                        <Card p='0px' maxW={{sm: "320px", md: "100%"}} m='24px'>
                            <Flex direction='column'>
                                <Flex align='center' justify='space-between' p='22px'>
                                    <Text fontSize='lg' color={textColor} fontWeight='bold'>
                                        Liste des évènements du mois
                                        de {new Date(Date.UTC(2000, selectedDate.getMonth())).toLocaleString('fr-FR', {month: 'long'})} {selectedDate.getFullYear()}
                                    </Text>
                                    <Button variant='primary' maxH='30px' onClick={goToManageEvent}>
                                        GERER TOUT LES EVENEMENTS
                                    </Button>
                                </Flex>
                                <Box maxH={tableMaxHeight} overflow="auto">
                                    <Skeleton isLoaded={loadedEvents}>
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
                                            <Tbody w="100%">
                                                {events.length === 0 && (
                                                    <Tr>
                                                        <Td colSpan={4} textAlign="center">
                                                            <Text color={textTableColor} fontSize="md">
                                                                Aucun évènement ce mois
                                                            </Text>
                                                        </Td>
                                                    </Tr>
                                                )}
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
                                                                {`${el.startDate.getDate().toString().padStart(2, '0')}/${(el.startDate.getMonth() + 1).toString().padStart(2, '0')}/${el.startDate.getFullYear()} - ${el.startDate.getHours().toString().padStart(2, '0')}h${el.startDate.getMinutes().toString().padStart(2, '0')}`}
                                                            </Td>
                                                            <Td
                                                                color={textTableColor}
                                                                fontSize='sm'
                                                                border={index === arr.length - 1 ? "none" : null}
                                                                borderColor={borderColor}>
                                                                {getReferrerName(el.referrerId)}
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
                                    </Skeleton>
                                </Box>
                            </Flex>
                        </Card>
                    </WrapItem>
                </Wrap>
                <Box h="20px"/>
            </Flex>
            <EventViewer isOpen={isOpenVisualizationModal} onClose={onCloseVisualizationModal}
                         eventSessionId={selectedEventSessionId}
                         volunteers={localUnitVolunteer}
            ></EventViewer>
        </EventContext.Provider>
    );
}
