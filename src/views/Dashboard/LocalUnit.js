import {Avatar, Flex, HStack, Text, useColorModeValue} from "@chakra-ui/react";

import crLogo from "assets/img/croix-rouge/logo-croix-rouge-cercle.png";

import React from "react";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";

function LocalUnit() {
    const borderProfileColor = useColorModeValue("white", "transparent");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");

    return (
        <Flex
            direction='column'
            pt={{ base: "120px", md: "75px", lg: "100px" }}>
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
                            Unité Locale du Val d'Orge
                        </Text>
                        <Text>
                            34, avenue d’Orgeval, 91360 Villemoisson-sur-Orge
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
                        Gérant: Bernard
                    </Text>
                </CardBody>
            </Card>
        </Flex>
    )
}

export default LocalUnit;
