import {
  Box,
  Button,
  Flex,
  Grid,
  Progress,
  SimpleGrid,
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
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import IconBox from "components/Icons/IconBox";
import {CartIcon} from "components/Icons/Icons.js";
import {FaCalendar, FaMedkit, FaUsers} from "react-icons/fa";
import React, {useContext, useEffect, useRef, useState} from "react";
import {stockClothCategories, stockFoodCategories} from "variables/general";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {getLocalUnit, getLocalUnitStats} from "../../controller/LocalUnitController";
import VolunteerContext from "../../contexts/VolunteerContext";
import {getEventForSpecificMonth, getEventsStats} from "../../controller/EventController";
import {getVolunteerById} from "../../controller/VolunteerController";
import {useHistory} from "react-router-dom";
import {LocalUnitStats} from "../../model/LocalUnitStats";
import {EventsStats} from "../../model/event/EventsStats";
import {getProductsStats} from "../../controller/StorageController";
import {ProductsStats} from "../../model/stock/ProductsStats";

export default function ULDashboard() {
  // Chakra Color Mode
  const iconBlue = useColorModeValue("orange.500", "orange.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");
  const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
  const [loadedLocalUnitStats, setLoadedLocalUnitStats] = useState(false);
  const [loadedEventStats, setLoadedEventStats] = useState(false);
  const [loadedProductStats, setLoadedProductStats] = useState(false);
  const {volunteer, setVolunteer} = useContext(VolunteerContext);
  const [tableMaxHeight, setTableMaxHeight] = useState('320px');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const calendarContainerRef = useRef(null);
  const [loadedEvents, setLoadedEvents] = useState(false);
  const [loadedReferrers, setLoadedReferrers] = useState(false);
  const [localUnit, setLocalUnit] = useState({});
  const [events, setEvents] = useState([]);
  const [referrersId, setReferrersId] = useState([]);
  const [referrersName, setReferrersName] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [localUnitStats, setLocalUnitStats] = useState(new LocalUnitStats(0, 0));
  const [eventStats, setEventStats] = useState(new EventsStats(0, 0, 0, 0));
  const [productStats, setProductStats] = useState(new ProductsStats(0, 0));
  const history = useHistory();

  useEffect(() => {
    setLoadedEvents(false);
  }, [currentMonth, currentYear]);

  const updateTableMaxHeight = () => {
    const calendarContainerHeight = calendarContainerRef.current.offsetHeight;
    const newTableMaxHeight = `${calendarContainerHeight}px`;
    setTableMaxHeight(newTableMaxHeight);
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

  const goToLocalUnit = () => {
    history.push("/admin/local-unit");
  }

  const goToManageEvent = () => {
    history.push("/admin/manage-events");
  }

  const goToStocks = () => {
    history.push("/admin/stocks");
  }

  const loadLocalUnit = () => {
    setLoadedLocalUnit(true);
    getLocalUnit(volunteer.localUnitId)
        .then((localUnit) => {
          setLocalUnit(localUnit);
        })
        .catch((_) => {
          setLoadedLocalUnit(false);
        });
  }

  const loadEvents = () => {
    setLoadedEvents(true);
    getEventForSpecificMonth(volunteer.localUnitId, currentMonth, currentYear)
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

  const handleDateChange = (arg) => {
    const newDate = arg.view.currentStart;
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth() + 1);
  };

  const loadLocalUnitStats = () => {
    setLoadedLocalUnitStats(true);
    getLocalUnitStats()
        .then((stats) => {
            setLocalUnitStats(stats);
        })
        .catch((_) => {
            setLoadedLocalUnitStats(false);
        });
  }

  const loadEventStats = () => {
    setLoadedEventStats(true);
    getEventsStats(localUnit.id)
        .then((stats) => {
          setEventStats(stats);
        })
        .catch((_) => {
          setLoadedEventStats(false);
        });
  }

  const loadProductStats = () => {
    setLoadedProductStats(true);
    getProductsStats()
        .then((stats) => {
            setProductStats(stats);
        })
        .catch((_) => {
            setLoadedProductStats(false);
        });
  }

  return (
      <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
        {volunteer && !loadedLocalUnit && loadLocalUnit()}
        {!loadedEvents && volunteer && loadEvents()}
        {!loadedReferrers && referrersId.length > 0 && loadReferrersName()}
        {!loadedLocalUnitStats && loadLocalUnitStats()}
        {!loadedEventStats && loadEventStats()}
        {!loadedProductStats && loadProductStats()}
        <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px' mb='20px'>
          <Card minH='125px'>
            <Flex direction='column'>
              <Flex
                  flexDirection='row'
                  align='center'
                  justify='center'
                  w='100%'
                  mb='25px'>
                <Stat me='auto'>
                  <StatLabel
                      fontSize='xs'
                      color='gray.400'
                      fontWeight='bold'
                      textTransform='uppercase'>
                    Nombre de bénévoles
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                      {localUnitStats.numberOfVolunteers}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                    borderRadius='50%'
                    as='box'
                    h={"45px"}
                    w={"45px"}
                    bg={iconBlue}>
                  <FaUsers h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Button variant="link" color='gray.400' fontSize='sm' onClick={goToLocalUnit}>
                Voir la liste
              </Button>
            </Flex>
          </Card>
          <Card minH='125px'>
            <Flex direction='column'>
              <Flex
                  flexDirection='row'
                  align='center'
                  justify='center'
                  w='100%'
                  mb='25px'>
                <Stat me='auto'>
                  <StatLabel
                      fontSize='xs'
                      color='gray.400'
                      fontWeight='bold'
                      textTransform='uppercase'>
                    Nombre de bénéficiaires
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold' href='/local-unit'>
                        {localUnitStats.numberOfBeneficiaries}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                    borderRadius='50%'
                    as='box'
                    h={"45px"}
                    w={"45px"}
                    bg={iconBlue}>
                  <FaMedkit h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Button variant="link" color='gray.400' fontSize='sm' onClick={goToLocalUnit}>
                Voir la liste
              </Button>
            </Flex>
          </Card>
          <Card minH='125px'>
            <Flex direction='column'>
              <Flex
                  flexDirection='row'
                  align='center'
                  justify='center'
                  w='100%'
                  mb='25px'>
                <Stat me='auto'>
                  <StatLabel
                      fontSize='xs'
                      color='gray.400'
                      fontWeight='bold'
                      textTransform='uppercase'>
                    Nombres d'événements ce mois
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold' href='/events'>
                      {eventStats.numberOfEventsOverTheMonth}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                    borderRadius='50%'
                    as='box'
                    h={"45px"}
                    w={"45px"}
                    bg={iconBlue}>
                  <FaCalendar h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Button variant="link" color='gray.400' fontSize='sm' onClick={goToManageEvent}>
                Gérer les événements
              </Button>
            </Flex>
          </Card>
          <Card minH='125px'>
            <Flex direction='column'>
              <Flex
                  flexDirection='row'
                  align='center'
                  justify='center'
                  w='100%'
                  mb='25px'>
                <Stat me='auto'>
                  <StatLabel
                      fontSize='xs'
                      color='gray.400'
                      fontWeight='bold'
                      textTransform='uppercase'>
                    Etat des stocks
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                      {productStats.totalFoodQuantity + productStats.totalClothesQuantity} produits
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
                <Button variant="link" color='gray.400' fontSize='sm' onClick={goToStocks}>
                  Consulter les stocks
                </Button>
            </Flex>
          </Card>
        </SimpleGrid>

        <Flex
            flexDirection='row' overflow="scroll">
          <Card
              p='8px'
              maxW={{ sm: "320px", md: "100%" }}
              m='24px'>
            <Box minH='320px' margin='8px' ref={calendarContainerRef}>
              <FullCalendar
                  plugins={[ dayGridPlugin ]}
                  datesSet={handleDateChange}
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
                  Liste des évènements du mois de {new Date(Date.UTC(2000, currentMonth - 1)).toLocaleString('fr-FR', { month: 'long' })} {currentYear}
                </Text>
                <Button variant='primary' maxH='30px' onClick={goToManageEvent}>
                  GERER TOUT LES EVENEMENTS
                </Button>
              </Flex>
              <Box  maxH={tableMaxHeight} overflow="auto">
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
        <Grid
            templateColumns={{ sm: "1fr", lg: "1fr 1fr" }}
            templateRows={{ lg: "repeat(2, auto)" }}
            gap='20px'>
          <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction='column'>
              <Flex align='center' justify='space-between' p='22px'>
                <Text fontSize='lg' color={textColor} fontWeight='bold'>
                  Stock alimentaire
                </Text>
                <Button variant='primary' maxH='30px'>
                  VOIR TOUS
                </Button>
              </Flex>
            </Flex>
            <Box overflow={{ sm: "scroll", lg: "hidden" }}>
              <Table>
                <Thead>
                  <Tr bg={tableRowColor}>
                    <Th color='gray.400' borderColor={borderColor}>
                      Catégorie
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Quantité
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stockFoodCategories.map((el, index, arr) => {
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
                              borderColor={borderColor}
                              border={index === arr.length - 1 ? "none" : null}>
                            {el.quantity}
                          </Td>
                          <Td
                              color={textTableColor}
                              fontSize='sm'
                              borderColor={borderColor}
                              border={index === arr.length - 1 ? "none" : null}>
                            <Flex align='center'>
                              <Text
                                  color={textTableColor}
                                  fontWeight='bold'
                                  fontSize='sm'
                                  me='12px'>{`${el.percentage}%`}</Text>
                              <Progress
                                  size='xs'
                                  colorScheme={el.color}
                                  value={el.percentage}
                                  minW='120px'
                              />
                            </Flex>
                          </Td>
                        </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Card>
          <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction='column'>
              <Flex align='center' justify='space-between' p='22px'>
                <Text fontSize='lg' color={textColor} fontWeight='bold'>
                  Stock vestimentaire
                </Text>
                <Button variant='primary' maxH='30px'>
                  VOIR TOUT
                </Button>
              </Flex>
            </Flex>
            <Box overflow={{ sm: "scroll", lg: "hidden" }}>
              <Table>
                <Thead>
                  <Tr bg={tableRowColor}>
                    <Th color='gray.400' borderColor={borderColor}>
                      Type de vêtement
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Quantité
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stockClothCategories.map((el, index, arr) => {
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
                              borderColor={borderColor}
                              border={index === arr.length - 1 ? "none" : null}>
                            {el.quantity}
                          </Td>
                          <Td
                              color={textTableColor}
                              fontSize='sm'
                              borderColor={borderColor}
                              border={index === arr.length - 1 ? "none" : null}>
                            <Flex align='center'>
                              <Text
                                  color={textTableColor}
                                  fontWeight='bold'
                                  fontSize='sm'
                                  me='12px'>{`${el.percentage}%`}</Text>
                              <Progress
                                  size='xs'
                                  colorScheme={el.color}
                                  value={el.percentage}
                                  minW='120px'
                              />
                            </Flex>
                          </Td>
                        </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Card>
        </Grid>
      </Flex>
  );
}
