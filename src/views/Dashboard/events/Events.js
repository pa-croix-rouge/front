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
    Thead, Tooltip,
    Tr,
    useColorModeValue,
    useDisclosure, useToast,
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card.js";
import React, {useContext, useEffect, useRef, useState} from "react";
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
import {getMyAuthorizations} from "../../../controller/RoleController";

export default function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textTableColor = useColorModeValue("gray.500", "white");
    const iconBlue = useColorModeValue("orange.500", "orange.500");
    const iconBoxInside = useColorModeValue("white", "white");
    const history = useHistory();

    const calendarContainerRef = useRef(null);
    const [tableMaxHeight, setTableMaxHeight] = useState('320px');
    const [isInitialRender, setIsInitialRender] = useState(true);

    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadedStats, setLoadedStats] = useState(false);
    const [stats, setStats] = useState(new EventsStats(-1, -1, -1, -1));

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [loadedEvents, setLoadedEvents] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [events, setEvents] = useState([]);

    const [localUnitVolunteer, setLocalUnitVolunteer] = useState([]);
    const [localUnitVolunteerLoaded, setLocalUnitVolunteerLoaded] = useState(false);
    const [localUnitVolunteerLoading, setLocalUnitVolunteerLoading] = useState(false);

    const [selectedEventSessionId, setSelectedEventSessionId] = useState(undefined);
    const {isOpen: isOpenVisualizationModal, onOpen: onOpenVisualizationModal, onClose: onCloseVisualizationModal} = useDisclosure();
    const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
    const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
    const toast = useToast();

    const updateTableMaxHeight = () => {
        if(calendarContainerRef.current === null) return;
        setTimeout(() => {
            const calendarContainerHeight = calendarContainerRef.current.offsetHeight;
            const newTableMaxHeight = `${calendarContainerHeight}px`;
            setTableMaxHeight(newTableMaxHeight);
        }, 100);
    };

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            updateTableMaxHeight();
        } else {
            window.addEventListener('resize', updateTableMaxHeight);
            return () => {
                window.removeEventListener('resize', updateTableMaxHeight);
            };
        }
    }, [isInitialRender]);

    const canReadVolunteer = () => {
        return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'READ').length > 0;
    }

    if (!localUnitVolunteerLoaded && !localUnitVolunteerLoading && loadedVolunteerAuthorizations && canReadVolunteer()) {
        setLocalUnitVolunteerLoading(true);
        getVolunteers()
            .then((volunteers) => {
                setLocalUnitVolunteerLoading(false);
                setLocalUnitVolunteer(volunteers);
                setLocalUnitVolunteerLoaded(true);
            })
            .catch((e) => {
                setTimeout(() => {setLocalUnitVolunteerLoaded(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des volontaires.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
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
        setLoadingEvents(true);
        getEventForSpecificMonth(volunteer.localUnitId, selectedDate.getMonth() + 1, selectedDate.getFullYear())
            .then((events) => {
                setLoadingEvents(false);
                setEvents(events);
                setLoadedEvents(true);
            })
            .catch((e) => {
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
                setTimeout(() => {setLoadedStats(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des statistiques d'événements.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
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
        <EventContext.Provider value={{events, setEvents, reloadEvents}}>
            {!loadedStats && loadStats()}
            {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
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
                                        {stats.numberOfEventsOverTheMonth === -1 && (
                                            <CircularProgress isIndeterminate color='green.300'/>
                                        )}
                                        {stats.numberOfEventsOverTheMonth !== -1  && (
                                            <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                                {stats.numberOfEventsOverTheMonth}
                                            </StatNumber>
                                        )}
                                    </Flex>
                                </Stat>
                                <IconBox
                                    borderRadius='50%'
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
                                        {stats.totalParticipantsOverTheMonth === -1 && (
                                            <CircularProgress isIndeterminate color='green.300'/>
                                        )}
                                        {stats.totalParticipantsOverTheMonth !== -1  && (
                                            <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                                {stats.totalParticipantsOverTheMonth}
                                            </StatNumber>
                                        )}
                                    </Flex>
                                </Stat>
                                <IconBox
                                    borderRadius='50%'
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
                                        {stats.numberOfEventsOverTheYear === -1 && (
                                            <CircularProgress isIndeterminate color='green.300'/>
                                        )}
                                        {stats.numberOfEventsOverTheYear !== -1  && (
                                            <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                                {stats.numberOfEventsOverTheYear}
                                            </StatNumber>
                                        )}
                                    </Flex>
                                </Stat>
                                <IconBox
                                    borderRadius='50%'
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
                                        {stats.totalParticipantsOverTheYear === -1 && (
                                            <CircularProgress isIndeterminate color='green.300'/>
                                        )}
                                        {stats.totalParticipantsOverTheYear !== -1  && (
                                            <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                                                {stats.totalParticipantsOverTheYear}
                                            </StatNumber>
                                        )}
                                    </Flex>
                                </Stat>
                                <IconBox
                                    borderRadius='50%'
                                    h={"45px"}
                                    w={"45px"}
                                    bg={iconBlue}>
                                    <CartIcon h={"24px"} w={"24px"} color={iconBoxInside}/>
                                </IconBox>
                            </Flex>
                        </Flex>
                    </Card>
                </SimpleGrid>
                <Flex>
                    <Card m='24px' minWidth={'500'}>
                        <Skeleton isLoaded={loadedEvents}>
                            <Box minH='320px' margin='8px' ref={calendarContainerRef}>
                                <FullCalendar
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
                            </Box>
                        </Skeleton>
                    </Card>
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
                            <Box maxH={calendarContainerRef.current !== null ? calendarContainerRef.current.offsetHeight : tableMaxHeight} overflow="auto">
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
                                                        {!canReadVolunteer() && (
                                                            <Td
                                                                color={textTableColor}
                                                                fontSize='sm'
                                                                border={index === arr.length - 1 ? "none" : null}
                                                                borderColor={borderColor}>
                                                                <Tooltip label="Vous n'avez pas les droits">
                                                                    <Text color="transparent" textShadow="0 0 8px #000">
                                                                        James bond
                                                                    </Text>
                                                                </Tooltip>
                                                            </Td>
                                                        )}
                                                        {localUnitVolunteer.length === 0 && canReadVolunteer() && (
                                                            <Td
                                                                color={textTableColor}
                                                                fontSize='sm'
                                                                border={index === arr.length - 1 ? "none" : null}
                                                                borderColor={borderColor}>
                                                                {el.referrerId}
                                                            </Td>
                                                        )}
                                                        {localUnitVolunteer.length !== 0 && (
                                                            <Td
                                                                color={textTableColor}
                                                                fontSize='sm'
                                                                border={index === arr.length - 1 ? "none" : null}
                                                                borderColor={borderColor}>
                                                                {localUnitVolunteer.find((volunteer) => volunteer.id === el.referrerId).firstName} {localUnitVolunteer.find((volunteer) => volunteer.id === el.referrerId).lastName}
                                                            </Td>
                                                        )}
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
                </Flex>
                <Box h="20px"/>
            </Flex>
            <EventViewer isOpen={isOpenVisualizationModal} onClose={onCloseVisualizationModal}
                         eventSessionId={selectedEventSessionId}
                         volunteers={localUnitVolunteer}
            ></EventViewer>
        </EventContext.Provider>
    );
}
