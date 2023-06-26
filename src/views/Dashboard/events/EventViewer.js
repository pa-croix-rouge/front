import React, {useContext, useState} from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Text,
    Tbody,
    Th,
    Thead,
    Tr,
    useDisclosure,
    Spacer,
    VStack,
    HStack,
    Grid,
    GridItem,
    SimpleGrid,
    Checkbox,
    Flex,
    RadioGroup,
    Radio,
    Textarea,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
    Icon,
    Progress
} from "@chakra-ui/react";
import { createRole, getRole, updateRole } from "../../../controller/RoleController";
import { Role, RoleCreation } from "../../../model/Role";
import Card from "../../../components/Card/Card";
import {FaPlus} from "react-icons/fa";
import {createRecurrentEvent, createSingleEvent} from "../../../controller/EventController";
import {SingleEventCreation} from "../../../model/event/SingleEventCreation";
import {RecurrentEventCreation} from "../../../model/event/RecurrentEventCreation";
import {getVolunteers} from "../../../controller/VolunteerController";
import VolunteerContext from "../../../contexts/VolunteerContext";

export default function EventViewer(props) {


    return (
        <Modal  isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Détails de l'événement</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column">
                        {props.event !== undefined && (
                            <Flex direction="column">
                                <Text fontSize="2xl" fontWeight="bold">{props.event.name}</Text>
                                <Text><i>{props.event.description}</i></Text>
                                <Text>Du {props.event.startDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")} au {props.event.endDate.toLocaleString().substring(0, 16).replace(" ", " à ").replace(":", "h")}</Text>
                                <Text>Référent: {props.event.referrerId}</Text>
                                <Text>Participants: {props.event.numberOfParticipants} / {props.event.maxParticipants}</Text>
                                <Text>Plage{props.event.timeWindows.length > 1 ? "s" : ""} horaire{props.event.timeWindows.length > 1 ? "s" : ""}</Text>
                                <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing='24px'>
                                    {props.event.timeWindows.map((timeWindow, index) => (
                                        <Card key={index}>
                                            <Flex direction="column">
                                                <Flex direction="row">
                                                    <Text fontSize="sm" fontWeight="semibold">De {timeWindow.startTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')} à {timeWindow.endTime.toLocaleTimeString().substring(0, 5).replaceAll(':', 'h')}</Text>
                                                </Flex>
                                                <Text>Participants: {timeWindow.participants.length} / {timeWindow.maxParticipants}</Text>
                                                <Progress
                                                    colorScheme={(timeWindow.participants.length / timeWindow.maxParticipants) * 100 > 50 ? "green" : (timeWindow.participants.length / timeWindow.maxParticipants) * 100 > 85 ? "orange" : "red"}
                                                    size="xs"
                                                    value={timeWindow.participants.length / timeWindow.maxParticipants * 100}
                                                    borderRadius="15px"
                                                />
                                                {timeWindow.participants.map((participant, index) => (
                                                    <Text key={index}>{participant}</Text>
                                                ))}
                                            </Flex>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Flex>
                        )}
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        Fermer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
