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
import React from "react";
import {
    eventList
} from "../../variables/general";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textTableColor = useColorModeValue("gray.500", "white");

    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }} mr='32px'>
            <Flex
                flexDirection='column'>
                <Card
                    p='0px'
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
            </Flex>
            <Box
                h="20px"/>
        </Flex>
    );
}
