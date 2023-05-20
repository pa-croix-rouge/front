// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input, InputGroup, InputRightElement,
    Link,
    Progress,
    Spacer,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "./../../assets/img/BgSignUp.jpg";
import React, {useState} from "react";

function SignUp() {
    const bgForm = useColorModeValue("white", "navy.800");
    const titleColor = useColorModeValue("gray.700", "blue.500");
    const textColor = useColorModeValue("gray.700", "white");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const handleShowPasswordClick = () => setShowPassword(!showPassword);
    const handleShowPasswordConfirmationClick = () => setShowPasswordConfirmation(!showPasswordConfirmation);

    return (
        <Flex
            direction='column'
            alignSelf='center'
            justifySelf='center'
            overflow='hidden'>
            <Box
                position='absolute'
                minH={{base: "70vh", md: "50vh"}}
                maxH={{base: "70vh", md: "50vh"}}
                w={{md: "calc(100vw - 50px)"}}
                maxW={{md: "calc(100vw - 50px)"}}
                left='0'
                right='0'
                bgRepeat='no-repeat'
                overflow='hidden'
                zIndex='-1'
                top='0'
                bgImage={BgSignUp}
                bgSize='cover'
                mx={{md: "auto"}}
                mt={{md: "14px"}}
                borderRadius={{base: "0px", md: "20px"}}>
                <Box w='100vw' h='100vh' bg='gray.700' opacity='0.8'></Box>
            </Box>
            <Flex
                direction='column'
                textAlign='center'
                justifyContent='center'
                align='center'
                mt='125px'
                mb='30px'>
                <Text fontSize='4xl' color='white' fontWeight='bold'>
                    Bienvenue!
                </Text>
                <Text
                    fontSize='md'
                    color='white'
                    fontWeight='normal'
                    mt='10px'
                    mb='26px'
                    w={{base: "90%", sm: "60%", lg: "40%", xl: "333px"}}>
                    Une fois votre demande d'inscription prise en compte, merci de contacter les référents de votre
                    unité locale
                    afin que ces derniers valident votre inscription.
                </Text>
            </Flex>
            <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
                <Flex
                    direction='column'
                    w='545px'
                    background='transparent'
                    borderRadius='15px'
                    p='40px'
                    mx={{base: "100px"}}
                    bg={bgForm}
                    boxShadow={useColorModeValue(
                        "0px 5px 14px rgba(0, 0, 0, 0.05)",
                        "unset"
                    )}>
                    <FormControl>
                        <Flex
                            direction='row'>
                            <Flex
                                direction='column'>
                                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                                    Nom
                                </FormLabel>
                                <Input
                                    variant='auth'
                                    fontSize='sm'
                                    ms='4px'
                                    type='text'
                                    placeholder='Votre nom'
                                    mb='24px'
                                    size='lg'
                                />
                            </Flex>
                            <Spacer/>
                            <Flex
                                direction='column'>
                                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                                    Prénom
                                </FormLabel>
                                <Input
                                    variant='auth'
                                    fontSize='sm'
                                    ms='4px'
                                    type='text'
                                    placeholder='Votre prénom'
                                    mb='24px'
                                    size='lg'
                                />
                            </Flex>
                        </Flex>
                        <Flex
                            direction='row'>
                            <Flex
                                direction='column'>
                                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                                    Email
                                </FormLabel>
                                <Input
                                    variant='auth'
                                    fontSize='sm'
                                    ms='4px'
                                    type='email'
                                    placeholder='example@croix-rouge.fr'
                                    mb='24px'
                                    size='lg'
                                />
                            </Flex>
                            <Spacer/>
                            <Flex
                                direction='column'>
                                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                                    Numéro de téléphone
                                </FormLabel>
                                <Input
                                    variant='auth'
                                    fontSize='sm'
                                    ms='4px'
                                    type='phone'
                                    placeholder='06 01 02 03 04'
                                    mb='24px'
                                    size='lg'
                                />
                            </Flex>
                        </Flex>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                            Mot de passe
                        </FormLabel>
                        <InputGroup>
                            <Input
                                variant='auth'
                                fontSize='sm'
                                ms='4px'
                                type={showPassword ? "text" : "password"}
                                placeholder='Votre mot de passe'
                                mb='24px'
                                size='lg'
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowPasswordClick}>
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                            Confirmer le mot de passe
                        </FormLabel>
                        <InputGroup>
                            <Input
                                variant='auth'
                                fontSize='sm'
                                ms='4px'
                                type={showPasswordConfirmation ? "text" : "password"}
                                placeholder='Votre mot de passe'
                                mb='24px'
                                size='lg'
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowPasswordConfirmationClick}>
                                    {showPasswordConfirmation ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Progress colorScheme="green" size="sm" value={100}/>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                            Code de l'unité locale
                        </FormLabel>
                        <Input
                            variant='auth'
                            fontSize='sm'
                            ms='4px'
                            type='text'
                            placeholder='01000-000'
                            mb='24px'
                            size='lg'
                        />
                        <Button
                            fontSize='10px'
                            variant='dark'
                            fontWeight='bold'
                            w='100%'
                            h='45'
                            mb='24px'>
                            S'ENREGISTRER
                        </Button>
                    </FormControl>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        maxW='100%'
                        mt='0px'>
                        <Text color={textColor} fontWeight='medium'>
                            Vous avez déjà un compte?
                            <Link
                                color={titleColor}
                                as='span'
                                ms='5px'
                                href='#'
                                fontWeight='bold'>
                                Se connecter
                            </Link>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default SignUp;
