import {
  Box,
  Button, CircularProgress,
  Flex,
  Grid,
  SimpleGrid,
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
  useColorModeValue, useToast,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import IconBox from "components/Icons/IconBox";
import {CartIcon} from "components/Icons/Icons.js";
import {FaCalendar, FaMedkit, FaUsers} from "react-icons/fa";
import React, {useContext, useEffect, useRef, useState} from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {getLocalUnit, getLocalUnitStats} from "../../controller/LocalUnitController";
import VolunteerContext from "../../contexts/VolunteerContext";
import {getEventForSpecificMonth, getEventsStats} from "../../controller/EventController";
import {getVolunteers} from "../../controller/VolunteerController";
import {useHistory} from "react-router-dom";
import {LocalUnitStats} from "../../model/LocalUnitStats";
import {EventsStats} from "../../model/event/EventsStats";
import {getProductsStats, getSoonExpiredFood} from "../../controller/StorageController";
import {ProductsStats} from "../../model/stock/ProductsStats";
import {getMyAuthorizations} from "../../controller/RoleController";

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
  const [loadedSoonExpiredFood, setLoadedSoonExpiredFood] = useState(false);
  const [endLoadingSoonExpiredFood, setEndLoadingSoonExpiredFood] = useState(false);
  const [loadedVolunteers, setLoadedVolunteers] = useState(false);
  const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
  const [endLoadingVolunteers, setEndLoadingVolunteers] = useState(false);
  const {volunteer, setVolunteer} = useContext(VolunteerContext);
  const [tableMaxHeight, setTableMaxHeight] = useState('320px');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const calendarContainerRef = useRef(null);
  const [loadedEvents, setLoadedEvents] = useState(false);
  const [endLoadingEvents, setEndLoadingEvents] = useState(false);
  const [localUnit, setLocalUnit] = useState({});
  const [events, setEvents] = useState([]);
  const [referrersName, setReferrersName] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [localUnitStats, setLocalUnitStats] = useState(new LocalUnitStats(-1, -1));
  const [eventStats, setEventStats] = useState(new EventsStats(-1, -1, -1, -1));
  const [productStats, setProductStats] = useState(new ProductsStats(-1, -1));
  const [soonExpiredFood, setSoonExpiredFood] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerAuthorizations, setVolunteerAuthorizations] = useState([]);
  const history = useHistory();
  const toast = useToast();

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

  const goToBeneficiaries = () => {
    history.push("/admin/beneficiaries");
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
          setTimeout(() => {setLoadedLocalUnit(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement de l'unité locale.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const loadEvents = () => {
    setLoadedEvents(true);
    getEventForSpecificMonth(volunteer.localUnitId, currentMonth, currentYear)
        .then((events) => {
          setEvents(events);
          setEndLoadingEvents(true)
        })
        .catch((_) => {
          setTimeout(() => {setLoadedEvents(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des événements.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
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
          setTimeout(() => {setLoadedLocalUnitStats(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des statisques de l'unité locale.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const loadEventStats = () => {
    setLoadedEventStats(true);
    getEventsStats()
        .then((stats) => {
          setEventStats(stats);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedEventStats(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des statisques des événements.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const loadProductStats = () => {
    setLoadedProductStats(true);
    getProductsStats()
        .then((stats) => {
            setProductStats(stats);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedProductStats(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des statisques des produits.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const loadSoonExpiredFood = () => {
    setLoadedSoonExpiredFood(true);
    getSoonExpiredFood()
        .then((food) => {
            setSoonExpiredFood(food);
            setEndLoadingSoonExpiredFood(true);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedSoonExpiredFood(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des produits bientôt périmés.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const loadVolunteers = () => {
    setLoadedVolunteers(true);
    getVolunteers()
        .then((volunteers) => {
            setVolunteers(volunteers);
            setEndLoadingVolunteers(true);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedVolunteers(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des volontaires.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
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

  const canReadVolunteer = () => {
    return volunteerAuthorizations.VOLUNTEER?.filter((r) => r === 'READ').length > 0;
  }

  const canReadBeneficiary = () => {
    return volunteerAuthorizations.BENEFICIARY?.filter((r) => r === 'READ').length > 0;
  }

  const canReadEvent = () => {
    return volunteerAuthorizations.EVENT?.filter((r) => r === 'READ').length > 0;
  }

  const canReadProduct = () => {
    return volunteerAuthorizations.PRODUCT?.filter((r) => r === 'READ').length > 0;
  }

  const canReadStorage = () => {
    return volunteerAuthorizations.STORAGE?.filter((r) => r === 'READ').length > 0;
  }

  const canReadLocalUnit = () => {
    return volunteerAuthorizations.LOCAL_UNIT?.filter((r) => r === 'READ').length > 0;
  }

    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
          {loadedVolunteerAuthorizations && volunteer && !loadedLocalUnit && canReadLocalUnit() && loadLocalUnit()}
          {loadedVolunteerAuthorizations && loadedLocalUnit && !loadedEvents && volunteer && canReadEvent() && loadEvents()}
          {loadedVolunteerAuthorizations && loadedLocalUnit && !loadedLocalUnitStats && canReadLocalUnit() && loadLocalUnitStats()}
          {loadedVolunteerAuthorizations && !loadedEventStats  && canReadEvent() && loadEventStats()}
          {loadedVolunteerAuthorizations && loadedLocalUnit && !loadedProductStats && canReadStorage() && loadProductStats()}
          {loadedVolunteerAuthorizations && !loadedSoonExpiredFood && canReadProduct() && loadSoonExpiredFood()}
          {loadedVolunteerAuthorizations && !loadedVolunteers && canReadVolunteer() && loadVolunteers()}
          {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
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
                      {localUnitStats.numberOfVolunteers === -1 && canReadLocalUnit() && (
                          <CircularProgress isIndeterminate color='green.300'/>
                      )}
                      {localUnitStats.numberOfVolunteers !== -1 && canReadLocalUnit() && (
                          <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                            {localUnitStats.numberOfVolunteers}
                          </StatNumber>
                      )}
                      {!canReadLocalUnit() && (
                          <Tooltip label="Vous n'avez pas les droits">
                            <StatNumber fontSize='lg' color="transparent" fontWeight='bold' textShadow="0 0 8px #000">
                              00
                            </StatNumber>
                          </Tooltip>
                      )}
                    </Flex>
                  </Stat>
                  <IconBox
                      borderRadius='50%'
                      h={"45px"}
                      w={"45px"}
                      bg={iconBlue}>
                    <FaUsers h={"24px"} w={"24px"} color={iconBoxInside} />
                  </IconBox>
                </Flex>
                <Button variant="link" color='gray.400' fontSize='sm' onClick={goToLocalUnit} disabled={!canReadVolunteer()}>
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
                      {localUnitStats.numberOfBeneficiaries === -1 && canReadLocalUnit() && (
                          <CircularProgress isIndeterminate color='green.300'/>
                      )}
                      {localUnitStats.numberOfBeneficiaries !== -1 && canReadLocalUnit() && (
                          <StatNumber fontSize='lg' color={textColor} fontWeight='bold' href='/local-unit'>
                            {localUnitStats.numberOfBeneficiaries}
                          </StatNumber>
                      )}
                      {!canReadLocalUnit() && (
                          <Tooltip label="Vous n'avez pas les droits">
                            <StatNumber fontSize='lg' color="transparent" fontWeight='bold' textShadow="0 0 8px #000">
                              00
                            </StatNumber>
                          </Tooltip>
                      )}
                    </Flex>
                  </Stat>
                  <IconBox
                      borderRadius='50%'
                      h={"45px"}
                      w={"45px"}
                      bg={iconBlue}>
                    <FaMedkit h={"24px"} w={"24px"} color={iconBoxInside} />
                  </IconBox>
                </Flex>
                <Button variant="link" color='gray.400' fontSize='sm' onClick={goToBeneficiaries} disabled={!canReadBeneficiary()}>
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
                      {eventStats.numberOfEventsOverTheMonth === -1 && canReadEvent() && (
                          <CircularProgress isIndeterminate color='green.300'/>
                      )}
                      {eventStats.numberOfEventsOverTheMonth !== -1 && canReadEvent() && (
                          <StatNumber fontSize='lg' color={textColor} fontWeight='bold' href='/events'>
                            {eventStats.numberOfEventsOverTheMonth}
                          </StatNumber>
                      )}
                      {!canReadEvent() && (
                          <Tooltip label="Vous n'avez pas les droits">
                            <StatNumber fontSize='lg' color="transparent" fontWeight='bold' textShadow="0 0 8px #000">
                              00
                            </StatNumber>
                          </Tooltip>
                      )}
                    </Flex>
                  </Stat>
                  <IconBox
                      borderRadius='50%'
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
                      {productStats.totalFoodQuantity === -1 && canReadStorage() && (
                          <CircularProgress isIndeterminate color='green.300'/>
                      )}
                      {productStats.totalFoodQuantity !== -1 && canReadStorage() && (
                          <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                            {productStats.totalFoodQuantity + productStats.totalClothesQuantity} produits
                          </StatNumber>
                      )}
                      {!canReadStorage() && (
                          <Tooltip label="Vous n'avez pas les droits">
                            <StatNumber fontSize='lg' color="transparent" fontWeight='bold' textShadow="0 0 8px #000">
                              00
                            </StatNumber>
                          </Tooltip>
                      )}
                    </Flex>
                  </Stat>
                  <IconBox
                      borderRadius='50%'
                      h={"45px"}
                      w={"45px"}
                      bg={iconBlue}>
                    <CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                  </IconBox>
                </Flex>
                <Button variant="link" color='gray.400' fontSize='sm' onClick={goToStocks} disabled={!canReadStorage()}>
                  Consulter les stocks
                </Button>
              </Flex>
            </Card>
          </SimpleGrid>
          <Flex flexDirection='row' overflow="auto">
            <Card p='8px' maxW={{ sm: "320px", md: "100%" }} m='24px'>
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
                  <Button variant='primary' maxH='30px' onClick={goToManageEvent} disabled={!canReadEvent()}>
                    GERER TOUT LES EVENEMENTS
                  </Button>
                </Flex>
                <Box maxH={tableMaxHeight} overflow="auto">
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
                      {!endLoadingEvents && canReadEvent() && (
                          <CircularProgress isIndeterminate color='green.300' m="50% 140%"/>
                      )}
                      {!canReadEvent() && (
                          <Tr>
                            <Td colSpan={4} textAlign="center">
                              <Text color={textTableColor} fontSize="md">
                                Vous n'avez pas les droits
                              </Text>
                            </Td>
                          </Tr>
                      )}
                      {endLoadingEvents && events.length === 0 && canReadEvent() && (
                          <Tr>
                            <Td colSpan={4} textAlign="center">
                              <Text color={textTableColor} fontSize="md">
                                Aucun évènement ce mois
                              </Text>
                            </Td>
                          </Tr>
                      )}
                      {endLoadingEvents && canReadEvent() && events.map((el, index, arr) => {
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
                              {volunteers.length === 0 && (
                                  <Td
                                      color={textTableColor}
                                      fontSize='sm'
                                      border={index === arr.length - 1 ? "none" : null}
                                      borderColor={borderColor}>
                                    {el.referrerId}
                                  </Td>
                              )}
                              {volunteers.length !== 0 && (
                                  <Td
                                      color={textTableColor}
                                      fontSize='sm'
                                      border={index === arr.length - 1 ? "none" : null}
                                      borderColor={borderColor}>
                                    {volunteers.filter(v => v.id === el.referrerId)[0].firstName} {volunteers.filter(v => v.id === el.referrerId)[0].lastName}
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
                    Aliments dont la date de péremption nécessite une attention
                  </Text>
                  <Button variant='primary' maxH='30px' onClick={goToStocks} disabled={!canReadProduct()}>
                    VOIR TOUS
                  </Button>
                </Flex>
              </Flex>
              <Box h="320px" overflow="scroll">
                <Table>
                  <Thead>
                    <Tr bg={tableRowColor}>
                      <Th color='gray.400' borderColor={borderColor}>
                        Nom
                      </Th>
                      <Th color='gray.400' borderColor={borderColor}>
                        DLC
                      </Th>
                      <Th color='gray.400' borderColor={borderColor}>
                        Quantité total
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {!canReadProduct() && (
                        <Tr>
                          <Td colSpan={3} textAlign="center">
                            <Text color={textTableColor} fontSize="md">
                              Vous n'avez pas les droits
                            </Text>
                          </Td>
                        </Tr>
                    )}
                    {!endLoadingSoonExpiredFood && canReadProduct() && (
                        <CircularProgress isIndeterminate color='green.300' m="30% 130%"/>
                    )}
                    {endLoadingSoonExpiredFood && soonExpiredFood.sort((a, b) => a.expirationDate.getTime() > b.expirationDate.getTime()).map((el, index, arr) => {
                      return (
                          <Tr key={index}>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                fontWeight='bold'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {el.product.name}
                            </Td>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {el.expirationDate.toLocaleDateString()}
                            </Td>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {Number(el.product.quantity) * Number(el.product.quantityQuantifier)} {el.product.quantifierName}
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
                    Volontaires de votre unité locale
                  </Text>
                  <Button variant='primary' maxH='30px' onClick={goToLocalUnit} disabled={!canReadVolunteer()}>
                    VOIR TOUT
                  </Button>
                </Flex>
              </Flex>
              <Box h="320px" overflow="scroll">
                <Table>
                  <Thead>
                    <Tr bg={tableRowColor}>
                      <Th color='gray.400' borderColor={borderColor}>
                        Prénom
                      </Th>
                      <Th color='gray.400' borderColor={borderColor}>
                        Nom
                      </Th>
                      <Th color='gray.400' borderColor={borderColor}>
                        Téléphone
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {!canReadVolunteer() && (
                        <Tr>
                          <Td colSpan={3} textAlign="center">
                            <Text color={textTableColor} fontSize="md">
                              Vous n'avez pas les droits
                            </Text>
                          </Td>
                        </Tr>
                    )}
                    {!endLoadingVolunteers && canReadVolunteer() && (
                        <CircularProgress isIndeterminate color='green.300' m="30% 130%"/>
                    )}
                    {endLoadingVolunteers && volunteers.filter(v => v.isValidated).map((el, index, arr) => {
                      return (
                          <Tr key={index}>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                fontWeight='bold'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {el.firstName}
                            </Td>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {el.lastName}
                            </Td>
                            <Td
                                color={textTableColor}
                                fontSize='sm'
                                borderColor={borderColor}
                                border={index === arr.length - 1 ? "none" : null}>
                              {el.phoneNumber}
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
