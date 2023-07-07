// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input, InputGroup, InputRightElement,
    Progress,
    Spacer,
    Text,
    useColorModeValue, useToast,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "./../../assets/img/BgSignUp.jpg";
import React, {useContext, useState} from "react";
import {VolunteerRegistration} from "../../model/volunteer/VolunteerRegistration";
import {register} from "../../controller/VolunteerController";
import TokenContext from "../../contexts/TokenContext";
import {useHistory} from "react-router-dom";

function SignUp() {
    const bgForm = useColorModeValue("white", "navy.800");
    const titleColor = useColorModeValue("gray.700", "blue.500");
    const textColor = useColorModeValue("gray.700", "white");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const handleShowPasswordClick = () => setShowPassword(!showPassword);
    const handleShowPasswordConfirmationClick = () => setShowPasswordConfirmation(!showPasswordConfirmation);

    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [localUnitCode, setLocalUnitCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const history = useHistory();
    const {token} = useContext(TokenContext);
    const toast = useToast();

    if(token) {
        history.push("/admin/ul-dashboard");
    }


    const checkPasswordValidity = () => {
        if (password !== passwordConfirmation) {
            setIsError(true);
            setErrorMessage('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    }

    const handleRegisterClick = () => {
        setLoading(true);
        setIsError(false);
        setIsSuccess(false);

        if (lastName === "") {
            setLoading(false);
            setIsError(true);
            setErrorMessage('Le nom est obligatoire');
            return;
        }

        if (firstName === "") {
            setLoading(false);
            setIsError(true);
            setErrorMessage('Le prénom est obligatoire');
            return;
        }

        if (/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) === false) {
            setLoading(false);
            setIsError(true);
            setErrorMessage('L\'address mail est invalide');
            return;
        }

        if (/^\+33 [1-9] \d{2} \d{2} \d{2} \d{2}$/.test(phoneNumber) === false) {
            setLoading(false);
            setIsError(true);
            setErrorMessage('Le numéro de téléphone doit respecter le format +33 X XX XX XX XX');
            return;
        }

        if (/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,})$/.test(password) === false) {
            setLoading(false);
            setIsError(true);
            setErrorMessage('Le mot de passe est obligatoire et doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
            return;
        }

        if (/^\d{1}(A|B|\d)\d{3}-\d{3}$/.test(localUnitCode) === false) {
            setLoading(false);
            setIsError(true);
            setErrorMessage('Le code de l\'unité local est invalide');
            return;
        }

        const passwordValidity = checkPasswordValidity();

        if (!passwordValidity) {
            setLoading(false);
            return;
        }

        const volunteerRegistration = new VolunteerRegistration(email, password, firstName, lastName, phoneNumber, localUnitCode);

        register(volunteerRegistration)
            .then(() => {
                setLoading(false);
                setLastName('');
                setFirstName('');
                setEmail('');
                setPhoneNumber('');
                setPassword('');
                setPasswordConfirmation('');
                setLocalUnitCode('');
                setIsSuccess(true);
                toast({
                    title: 'Succès',
                    description: "Inscription réussie, pensez à valider votre mail !",
                    status: 'success',
                    duration: 8_000,
                    isClosable: true,
                });
            })
            .catch((_) => {
                setLoading(false);
                setIsError(true);
                setErrorMessage('Erreur lors de l\'inscription, veuillez réessayer plus tard');
            });
    }

    const goToSignIn = () => {
        history.push("/auth/sign-in");
    }

    return (
        <Flex
            direction='column'
            alignSelf='center'
            justifySelf='center'
            overflow='hidden'>
            <Box
                position='absolute'
                minH={{base: "70vh", md: "75vh"}}
                maxH={{base: "70vh", md: "75vh"}}
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
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
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
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    placeholder='+33 6 01 02 03 04'
                                    mb='24px'
                                    size='lg'
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowPasswordConfirmationClick}>
                                    {showPasswordConfirmation ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {password !== passwordConfirmation && (
                            <>
                                <Progress colorScheme="red" size="sm" value={100}/>
                                <Text color='red.500' fontSize='sm' fontWeight='normal'>
                                    Les mots de passe ne correspondent pas
                                </Text>
                            </>
                        )}
                        {password === passwordConfirmation && (
                            <Progress colorScheme="green" size="sm" value={100}/>
                        )}
                        <Flex mb='24px' />
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
                            value={localUnitCode}
                            onChange={(e) => setLocalUnitCode(e.target.value)}
                        />
                        <Button
                            fontSize='10px'
                            variant='dark'
                            fontWeight='bold'
                            w='100%'
                            h='45'
                            mb='24px'
                            disabled={loading}
                            onClick={handleRegisterClick}>
                            S'ENREGISTRER
                        </Button>
                    </FormControl>
                    {loading && (
                        <Progress size="xs" isIndeterminate mb='12px'/>
                    )}
                    {isError && (
                        <Text color='red.500' fontSize='sm' fontWeight='semibold' mb='12px'>
                            {errorMessage}
                        </Text>
                    )}
                    {isSuccess && (
                        <Text color='green.500' fontSize='sm' fontWeight='bold' mb='12px'>
                            Demande d'inscription réussie ! Veuillez validez votre email, puis vous rapprocher du responsable de votre unité locale pour valider votre compte.
                        </Text>
                    )}
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        maxW='100%'
                        mt='0px'>
                        <Text color={textColor} fontWeight='medium'>
                            Vous avez déjà un compte?
                            <Button variant="link" color={titleColor} ml="4px" onClick={goToSignIn}>
                                Se connecter
                            </Button>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default SignUp;
