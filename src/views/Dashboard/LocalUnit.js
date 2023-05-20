import {Avatar, Flex, HStack, Text, useColorModeValue} from "@chakra-ui/react";

import crLogo from "assets/img/croix-rouge/logo-croix-rouge-cercle.png";

import React, {useContext, useState} from "react";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";
import {useHistory} from "react-router-dom";
import {getMyProfile} from "../../controller/VolunteerController";
import {getLocalUnit} from "../../controller/LocalUnitController";

function LocalUnit() {
    const borderProfileColor = useColorModeValue("white", "transparent");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const [luName, setLuName] = useState("");
    const [luAddress, setLuAddress] = useState("");
    const [luManager, setLuManager] = useState("");
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedLocalUnit, setLoadedLocalUnit] = useState(false);
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const history = useHistory();

    const loadVolunteer = () => {
        setLoadedVolunteer(true)
        if (token === undefined) {
            history.push("/auth/signin");
        } else {
            getMyProfile()
                .then((volunteer) => {
                    setVolunteer(volunteer);
                })
                .catch((error) => {
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
            .catch((error) => {
                setLoadedLocalUnit(false);
            });
    }

    return (
        <Flex
            direction='column'
            pt={{ base: "120px", md: "75px", lg: "100px" }}>
            {!loadedVolunteer && loadVolunteer()}
            {volunteer && !loadedLocalUnit && loadLocalUnit()}
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
                </CardBody>
            </Card>
        </Flex>
    )
}

export default LocalUnit;
