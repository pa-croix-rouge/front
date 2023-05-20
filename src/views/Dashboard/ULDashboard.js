// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
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
// Custom components
import Card from "components/Card/Card.js";
import BarChart from "components/Charts/BarChart";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {CartIcon, DocumentIcon, GlobeIcon, WalletIcon,} from "components/Icons/Icons.js";
import React, {useContext, useState} from "react";
// Variables
import {barChartDataEvents, barChartOptionsEvents} from "variables/charts";
import {eventList, eventTraffic, stockClothCategories, stockFoodCategories} from "variables/general";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import {getMyProfile} from "../../controller/VolunteerController";
import TokenContext from "../../contexts/TokenContext";
import {useHistory} from "react-router-dom";
import {getLocalUnit} from "../../controller/LocalUnitController";
import VolunteerContext from "../../contexts/VolunteerContext"; // a plugin!

export default function ULDashboard() {
  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");
  const [loadedVolunteer, setLoadedVolunteer] = useState(false);
  const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
  const {token} = useContext(TokenContext);
  const {volunteer, setVolunteer} = useContext(VolunteerContext);
  const history = useHistory();

  const loadVolunteer = () => {
    setLoadedVolunteer(true)
    if (token === undefined || token === '') {
      history.push("/auth/signin");
    } else {
      getMyProfile()
          .then((volunteer) => {
            setVolunteer(volunteer);
          })
          .catch((_) => {
            setLoadedVolunteer(false);
          });
    }
  }

  const loadLocalUnit = () => {
    setLoadedLocalUnit(true);
    getLocalUnit(volunteer.localUnitId)
        .then((localUnit) => {
          console.log(localUnit);
        })
        .catch((_) => {
          setLoadedLocalUnit(false);
        });
  }

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      {!loadedVolunteer && loadVolunteer()}
      {volunteer && !loadedLocalUnit && loadLocalUnit()}
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
                    50
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
            <Link color='gray.400' fontSize='sm'>
              Voir la liste
            </Link>
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
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    300
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
            <Link color='gray.400' fontSize='sm'>
              Voir la liste
            </Link>
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
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    8
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
            <Text color='gray.400' fontSize='sm'>
              Consulter le calendrier des événements
            </Text>
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
                    678 produits
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
            <Flex
              direction='row'
              justifyContent='space-between'>
              <Link color='gray.400' fontSize='sm'>
                Consulter le stock alimentaires
              </Link>
              <Link color='gray.400' fontSize='sm'>
                Consulter le stock vestimentaire
              </Link>
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap='20px'>
        <Card
          p='0px'
          maxW={{ sm: "320px", md: "100%" }}>
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
            />
          </Box>
        </Card>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='40px' p='28px 0px 0px 22px'>
            <Text color='gray.400' fontSize='sm' fontWeight='bold' mb='6px'>
              EVENEMENTS
            </Text>
            <Text color={textColor} fontSize='lg' fontWeight='bold'>
              Nombres d'évènements par mois
            </Text>
          </Flex>
          <Box minH='300px'>
            <BarChart chartData={barChartDataEvents} chartOptions={barChartOptionsEvents} />
          </Box>
        </Card>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
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
                <Tbody>
                  {eventList.map((el, index, arr) => {
                    return (
                      <Tr key={index}>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          fontWeight='bold'
                          borderColor={borderColor}
                          border={index === arr.length - 1 ? "none" : null}>
                          {el.eventName}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el.eventDate}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el.eventManager}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el.eventParticipants}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Card>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column'>
            <Flex align='center' justify='space-between' p='22px'>
              <Text fontSize='lg' color={textColor} fontWeight='bold'>
                Taux de participation aux derniers évènements
              </Text>
            </Flex>
          </Flex>
          <Box overflow={{ sm: "scroll", lg: "hidden" }}>
            <Table>
              <Thead>
                <Tr bg={tableRowColor}>
                  <Th color='gray.400' borderColor={borderColor}>
                    Nom de l'évènement
                  </Th>
                  <Th color='gray.400' borderColor={borderColor}>
                    Participants
                  </Th>
                  <Th color='gray.400' borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {eventTraffic.map((el, index, arr) => {
                  return (
                    <Tr key={index}>
                      <Td
                        color={textTableColor}
                        fontSize='sm'
                        fontWeight='bold'
                        borderColor={borderColor}
                        border={index === arr.length - 1 ? "none" : null}>
                        {el.eventName}
                      </Td>
                      <Td
                        color={textTableColor}
                        fontSize='sm'
                        borderColor={borderColor}
                        border={index === arr.length - 1 ? "none" : null}>
                        {el.eventParticipants}
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
