import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Link,
    Progress,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import signInImage from "./../../assets/img/signInImage.jpg";
import {User} from "../../model/User";
import {login} from "../../controller/LoginController";
import TokenContext from "../../contexts/TokenContext";
import {useHistory} from "react-router-dom";

function SignIn() {
    const textColor = useColorModeValue("gray.700", "white");
    const bgForm = useColorModeValue("white", "red.800");
    const titleColor = useColorModeValue("gray.700", "blue.500");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const {token, setToken} = useContext(TokenContext);
    const history = useHistory();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleLoginClick = () => {
        setLoading(true);
        const user = new User(username, password);

        login(user)
            .then((jwtToken) => {
                setLoading(false);
                setToken(jwtToken.token);
            })
            .catch((_) => {
                setLoading(false);
                setIsError(true);
            });
    }

    useEffect(() => {
        if (token) {
            history.push("/admin/dashboard");
        }
    }, [token]);

    return (
        <Flex position='relative' mb='40px'>
            <Flex
                minH={{md: "1000px"}}
                h={{sm: "initial", md: "75vh", lg: "85vh"}}
                w='100%'
                maxW='1044px'
                mx='auto'
                justifyContent='space-between'
                mb='30px'
                pt={{md: "0px"}}>
                <Flex
                    w='100%'
                    h='100%'
                    alignItems='center'
                    justifyContent='center'
                    mb='60px'
                    mt={{base: "50px", md: "20px"}}>
                    <Flex
                        zIndex='2'
                        direction='column'
                        w='445px'
                        background='transparent'
                        borderRadius='15px'
                        p='40px'
                        mx={{base: "100px"}}
                        m={{base: "20px", md: "auto"}}
                        bg={bgForm}
                        boxShadow={useColorModeValue(
                            "0px 5px 14px rgba(0, 0, 0, 0.05)",
                            "unset"
                        )}>
                        <FormControl>
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
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                                Mot de passe
                            </FormLabel>
                            <Input
                                variant='auth'
                                fontSize='sm'
                                ms='4px'
                                type='password'
                                placeholder='Votre mot de passe'
                                mb='24px'
                                size='lg'
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <Button
                                fontSize='10px'
                                variant='dark'
                                fontWeight='bold'
                                w='100%'
                                h='45'
                                mb='24px'
                                onClick={handleLoginClick}
                                disabled={loading}>
                                SE CONNECTER
                            </Button>
                        </FormControl>
                        <Flex
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='center'
                            maxW='100%'
                            mt='0px'>
                            <Text color={textColor} fontWeight='medium'>
                                Vous n'avez pas encore de compte?
                                <Link
                                    color={titleColor}
                                    as='span'
                                    ms='5px'
                                    href='/sign-up'
                                    fontWeight='bold'>
                                    S'enregistrer
                                </Link>
                            </Text>
                        </Flex>
                        {loading && (
                            <Progress size="xs" isIndeterminate/>
                        )}
                        {isError && !loading && (
                            <Text color='red.500' fontWeight='medium'>
                                La connexion a échoué, vérifiez vos identifiants.
                            </Text>
                        )}
                    </Flex>
                </Flex>
                <Box
                    overflowX='hidden'
                    h='100%'
                    w='100%'
                    left='0px'
                    position='absolute'
                    bgImage={signInImage}>
                    <Box
                        w='100%'
                        h='100%'
                        bgSize='cover'
                        bg='gray.700'
                        opacity='0.8'>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}

export default SignIn;
