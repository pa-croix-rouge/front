import {
    Avatar,
    Flex,
    HStack,
    Icon,
    SimpleGrid,
    Text,
    useColorModeValue
} from "@chakra-ui/react";

import crLogo from "assets/img/croix-rouge/logo-croix-rouge-cercle.png";

import React, {useContext, useState} from "react";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile, getVolunteers} from "../../controller/VolunteerController";
import {getLocalUnit} from "../../controller/LocalUnitController";
import {PersonIcon} from "../../components/Icons/Icons";

function LocalUnit() {
    const borderProfileColor = useColorModeValue("white", "transparent");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const [luName, setLuName] = useState("");
    const [luAddress, setLuAddress] = useState("");
    const [luManager, setLuManager] = useState("");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
    const [loadedVolunteers, setLoadedVolunteers] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const history = useHistory();

    const loadVolunteer = () => {
        setLoadedVolunteer(true)
        if (token === undefined || token === '') {
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

    const loadLocalUnit = () => {
        setLoadedLocalUnit(true);
        getLocalUnit(volunteer.localUnitId)
            .then((localUnit) => {
                setLuName(localUnit.name);
                setLuAddress(localUnit.address.streetNumberAndName + ", " + localUnit.address.postalCode + " " + localUnit.address.city);
                setLuManager(localUnit.managerName);
            })
            .catch((_) => {
                setLoadedLocalUnit(false);
            });
    }

    const loadVolunteers = () => {
        setLoadedVolunteers(true);
        getVolunteers()
            .then((volunteers) => {
                setVolunteers(volunteers);
            })
            .catch((_) => {
                setLoadedVolunteers(false);
            });
    }

    return (
        <Flex
            direction='column'
            pt={{ base: "120px", md: "75px", lg: "100px" }}>
            {!loadedVolunteer && loadVolunteer()}
            {volunteer && !loadedLocalUnit && loadLocalUnit()}
            {!loadedVolunteers && loadVolunteers()}
            <Flex
                direction={{ sm: "column", md: "row" }}
                mb='24px'
                maxH='330px'
                align='center'
                backdropFilter='blur(21px)'
                boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
                border='1.5px solid'
                borderColor={borderProfileColor}
                bg={bgProfile}
                p='24px'
                borderRadius='20px'>
                <HStack spacing='32px'>
                    <Avatar
                        h='96px'
                        w='96px'
                        src={crLogo}/>
                    <Flex
                        direction='column'>
                        <Text
                            fontWeight="bold">
                            {luName}
                        </Text>
                        <Text>
                            {luAddress}
                        </Text>
                    </Flex>
                </HStack>
            </Flex>
            <Card>
                <CardHeader>
                    <Text fontWeight="bold">
                        Information générales
                    </Text>
                </CardHeader>
                <CardBody>
                    <Text>
                        Gérant: {luManager}
                    </Text>
                    <Text>
                        Bénévoles: {volunteers.length}
                    </Text>
                    <SimpleGrid columns={{ sm: 1, md: 3, xl: 6 }} spacing='24px' mb='8px'>
                        {volunteers.map((volunteer) => (
                            <Card minH='72px'>
                                <Flex direction='row'>
                                    <Icon as={PersonIcon} mr="8px"/>
                                    <Text fontWeight="bold">
                                        {volunteer.firstName} {volunteer.lastName}
                                    </Text>
                                </Flex>
                            </Card>
                        ))}
                    </SimpleGrid>
                </CardBody>
            </Card>
        </Flex>
    )
}

export default LocalUnit;
