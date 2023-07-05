import React, {createContext, useContext, useState} from "react";
import {
    deleteBeneficiary,
    getBeneficiaries,
    registerBeneficiary, setBeneficiaryValidationStatus,
    updateBeneficiary
} from "../../../controller/BeneficiariesController";
import {
    Button,
    Center,
    CircularProgress,
    Flex,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input, Menu, MenuButton, MenuItem, MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useDisclosure, useToast,
    VStack, Wrap, WrapItem
} from "@chakra-ui/react";

import {Beneficiary} from "../../../model/Beneficiaries/Beneficiary";
import {BeneficiaryRegistration} from "../../../model/Beneficiaries/BeneficiaryRegistration";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import {NotAllowedIcon, CheckIcon, DeleteIcon, EditIcon, InfoOutlineIcon, PhoneIcon} from "@chakra-ui/icons";
import Card from "../../../components/Card/Card";
import BeneficiaryProduct from "./BeneficiaryProduct";
import {FaCog, FaPencilAlt, FaTrashAlt, FaUserPlus} from "react-icons/fa";
import {MdReceipt} from "react-icons/md";

const BeneficiariesContext = createContext({
    beneficiaries: [],
    setBeneficiaries: () => {
    },
});

function Beneficiaries() {

    const {
        isOpen: isOpenProductModal,
        onOpen: onOpenProductModal,
        onClose: onCloseProductModal
    } = useDisclosure();

    const {
        isOpen: isOpenCreationModal,
        onOpen: onOpenCreationModal,
        onClose: onCloseCreationModal
    } = useDisclosure();

    const {
        isOpen: isOpenViewModal,
        onOpen: onOpenViewModal,
        onClose: onCloseViewModal
    } = useDisclosure();

    const {
        isOpen: isOpenEditionModal,
        onOpen: onOpenEditionModal,
        onClose: onCloseEditionModal
    } = useDisclosure();

    const {localUnit} = useContext(LocalUnitContext);

    if (localUnit === undefined || localUnit.id === undefined) {
        return (
            <Center w='100%' h='100%'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Center>
        );
    }

    const [newBeneficiary, setNewBeneficiary] = useState(new BeneficiaryRegistration('', '', '', '', '', localUnit.code, '', '', []));

    const [creatingNewBeneficiaries, setCreatingNewBeneficiaries] = useState(false);

    const [loadedBeneficiaries, setLoadedBeneficiaries] = useState(false);
    const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([]);

    const [search, setSearch] = useState('');

    const [selectedBeneficiary, setSelectedBeneficiary] = useState(new Beneficiary(undefined, '', '', '', undefined, '', '', ''));
    const toast = useToast();

    if (!loadedBeneficiaries && !loadingBeneficiaries) {
        setLoadingBeneficiaries(true);
        getBeneficiaries().then((res) => {
            setBeneficiaries(res);
            setLoadingBeneficiaries(false);
            setLoadedBeneficiaries(true);
        }).catch((err) => {
            setLoadingBeneficiaries(false);
            setLoadedBeneficiaries(false);
            toast({
                title: "Erreur",
                description: "Echec du chargement des bénéficiares.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    if (loadingBeneficiaries) {
        return (
            <Center w='100%' h='100%'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Center>
        );
    }

    const createBeneficiary = () => {
        setCreatingNewBeneficiaries(true);
        registerBeneficiary(newBeneficiary)
            .then((res) => {
                setCreatingNewBeneficiaries(false);
                setLoadedBeneficiaries(false);
                onCloseCreationModal();
            }).catch((err) => {
            setCreatingNewBeneficiaries(false);
            console.log(err);
            toast({
                title: "Erreur",
                description: "Echec de la création du bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const onUpdateBeneficiary = () => {
        setCreatingNewBeneficiaries(true);
        updateBeneficiary(selectedBeneficiary.id, selectedBeneficiary)
            .then((res) => {
                setCreatingNewBeneficiaries(false);
                setLoadedBeneficiaries(false);
                onCloseEditionModal();
            }).catch((err) => {
            setCreatingNewBeneficiaries(false);
            console.log(err);
            toast({
                title: "Erreur",
                description: "Echec de la mise à jour bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const veiwBeneficiaries = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        onOpenViewModal();
    }

    const deleteBeneficiaries = (beneficiary) => {
        deleteBeneficiary(beneficiary.id)
            .then((res) => {
                setLoadedBeneficiaries(false);
            }).catch((err) => {
            console.log(err)
            toast({
                title: "Erreur",
                description: "Echec de la suppression du bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const onProduct = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        onOpenProductModal();
    }

    const editBeneficiaries = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        onOpenEditionModal();
    }

    const onBeneficiaryValidation = (beneficiary) => {
        setBeneficiaryValidationStatus(beneficiary.id, !beneficiary.isValidated).then((res) => {
            setLoadedBeneficiaries(false);
        }).catch((err) => {
            console.log(err)
            toast({
                title: "Erreur",
                description: "Echec de la validation dus bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const getBeneficiaryCardValidateMenItem = (beneficiary) => {
        return (
            <MenuItem onClick={() => onBeneficiaryValidation(beneficiary)}>
                <Flex direction="row" cursor="pointer" p="12px">
                    <Icon as={beneficiary.isValidated ? NotAllowedIcon : CheckIcon} mr="8px"/>
                    <Text fontSize="sm" fontWeight="semibold">{beneficiary.isValidated ? 'invalider' : 'valider'}</Text>
                </Flex>
            </MenuItem>
        );
    }

    const searchBeneficiaries = (beneficiary) => {
        if (search === '') return true;
        return beneficiary.firstName.search(search) !== -1 ||
            beneficiary.lastName.search(search) !== -1 ||
            beneficiary.phoneNumber.search(search) !== -1 ||
            beneficiary.username.search(search) !== -1
    }

    const getFilteredBeneficiaries = (valid) => {
        return beneficiaries.filter((beneficiary) => {
            return beneficiary.isValidated === valid && searchBeneficiaries(beneficiary);
        });
    }

    const getBeneficiariesCards = (beneficiary) => {
        return (
            <Card maxW='max'>
                <HStack align={'start'}>
                    <VStack align={'stretch'}>
                        <HStack align={'stretch'}>
                            <Text fontWeight="semibold"> Prénom : </Text>
                            <Text> {beneficiary.firstName} </Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="semibold"> Nom de famille : </Text>
                            <Text> {beneficiary.lastName} </Text>
                        </HStack>
                        <HStack>
                            <Icon as={PhoneIcon} mr="8px"/>
                            <Text> {beneficiary.phoneNumber} </Text>
                        </HStack>
                    </VStack>
                    <Menu>
                        <MenuButton>
                            <Icon as={FaCog}/>
                        </MenuButton>
                        <MenuList>
                            <Flex direction="column">
                                <MenuItem onClick={() => veiwBeneficiaries(beneficiary)}>
                                    <Flex direction="row" cursor="pointer" p="12px">
                                        <Icon as={FaUserPlus} mr="8px"/>
                                        <Text fontSize="sm" fontWeight="semibold">détails</Text>
                                    </Flex>
                                </MenuItem>
                                <MenuItem onClick={() => editBeneficiaries(beneficiary)}>
                                    <Flex direction="row" cursor="pointer" p="12px">
                                        <Icon as={FaPencilAlt} mr="8px"/>
                                        <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                                    </Flex>
                                </MenuItem>
                                {beneficiary.isValidated && <MenuItem onClick={() => onProduct(beneficiary)}>
                                    <Flex direction="row" cursor="pointer" p="12px">
                                        <Icon as={MdReceipt} mr="8px"/>
                                        <Text fontSize="sm" fontWeight="semibold">Voir les produits</Text>
                                    </Flex>
                                </MenuItem>}
                                {getBeneficiaryCardValidateMenItem(beneficiary)}
                                <MenuItem onClick={() => deleteBeneficiaries(beneficiary)}>
                                    <Flex direction="row" cursor="pointer" p="12px">
                                        <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                                        <Text color="red.500" fontSize="sm" fontWeight="semibold">Supprimer</Text>
                                    </Flex>
                                </MenuItem>
                            </Flex>
                        </MenuList>
                    </Menu>
                </HStack>
            </Card>
        );
    }

    return (
        <BeneficiariesContext.Provider value={{beneficiaries, setBeneficiaries}}>
            <VStack pt={{base: "120px", md: "75px"}} mr='32px' align={'stretch'} overflow={'hidden'}>
                <Card>
                    <Flex justify="space-between">
                        <Text fontSize="xl" fontWeight="bold">Gestion des bénéficiaires</Text>
                        <Button onClick={onOpenCreationModal} colorScheme="green">Ajouter un bénéficiaire</Button>
                    </Flex>
                </Card>
                <HStack>
                    <Text fontSize="xl" fontWeight="bold">Recherche</Text>
                    <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </HStack>
                <Card>
                    <Text fontSize="xl" fontWeight="bold">Bénéficiares non validés</Text>
                    <SimpleGrid columns={{sm: 1, md: 3, xl: 6}} spacing='24px' mb='8px'>
                        {getFilteredBeneficiaries(false).map((beneficiary) => getBeneficiariesCards(beneficiary))}
                    </SimpleGrid>
                </Card>
                <Card>
                    <Text fontSize="xl" fontWeight="bold">Bénéficiares validés</Text>
                    <SimpleGrid columns={{sm: 1, md: 3, xl: 6}} spacing='24px' mb='8px'>
                        {getFilteredBeneficiaries(true).map((beneficiary) => getBeneficiariesCards(beneficiary))}
                    </SimpleGrid>
                </Card>
            </VStack>

            <BeneficiaryProduct isOpen={isOpenProductModal} onClose={onCloseProductModal} size="6xl"
                                scrollBehavior="outside" beneficiary={selectedBeneficiary}> </BeneficiaryProduct>

            <Modal isOpen={isOpenCreationModal} onClose={onCloseCreationModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Ajouter un nouveau bénéficiare</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                            <FormLabel>Login</FormLabel>
                            <Input type="text" placeholder="Login" value={newBeneficiary.username}
                                   onChange={(e) => setNewBeneficiary({...newBeneficiary, username: e.target.value})}/>

                            <FormLabel>Most de pass</FormLabel>
                            <Input type="text" placeholder="Most de pass" value={newBeneficiary.password}
                                   onChange={(e) => setNewBeneficiary({...newBeneficiary, password: e.target.value})}/>

                            <FormLabel>Nom</FormLabel>
                            <Input type="text" placeholder="nom" value={newBeneficiary.lastName}
                                   onChange={(e) => setNewBeneficiary({...newBeneficiary, lastName: e.target.value})}/>

                            <FormLabel>Prenom</FormLabel>
                            <Input flex={1} type="text" placeholder="prenom" value={newBeneficiary.firstName}
                                   onChange={(e) => setNewBeneficiary({...newBeneficiary, firstName: e.target.value})}/>

                            <FormLabel>Date de naissance</FormLabel>
                            <Input flex={1} type="date" placeholder="Date de naissance" value={newBeneficiary.birthDate}
                                   onChange={(e) => setNewBeneficiary({...newBeneficiary, birthDate: e.target.value})}/>

                            <FormLabel>Numéro de téléphone</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de téléphone"
                                   value={newBeneficiary.phoneNumber}
                                   onChange={(e) => setNewBeneficiary({
                                       ...newBeneficiary,
                                       phoneNumber: e.target.value
                                   })}/>

                            <FormLabel>Numéro de sécu</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de sécu"
                                   value={newBeneficiary.socialWorkerNumber}
                                   onChange={(e) => setNewBeneficiary({
                                       ...newBeneficiary,
                                       socialWorkerNumber: e.target.value
                                   })}/>

                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseCreationModal}>
                            Annuler
                        </Button>
                        <Button isLoading={creatingNewBeneficiaries} colorScheme="blue" mr={3}
                                onClick={createBeneficiary}>
                            Confirmer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenEditionModal} onClose={onCloseEditionModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Modifier bénéficiare</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                            <FormLabel>Login</FormLabel>
                            <Input type="text" placeholder="Login" value={selectedBeneficiary.username}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       username: e.target.value
                                   })}/>

                            <FormLabel>Most de pass</FormLabel>
                            <Input type="text" placeholder="Most de pass" value={selectedBeneficiary.password}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       password: e.target.value
                                   })}/>

                            <FormLabel>Nom</FormLabel>
                            <Input type="text" placeholder="nom" value={selectedBeneficiary.lastName}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       lastName: e.target.value
                                   })}/>

                            <FormLabel>Prenom</FormLabel>
                            <Input flex={1} type="text" placeholder="prenom" value={selectedBeneficiary.firstName}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       firstName: e.target.value
                                   })}/>

                            <FormLabel>Date de naissance</FormLabel>
                            <Input flex={1} type="date" placeholder="Date de naissance"
                                   value={selectedBeneficiary.birthDate}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       birthDate: e.target.value
                                   })}/>

                            <FormLabel>Numéro de téléphone</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de téléphone"
                                   value={selectedBeneficiary.phoneNumber}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       phoneNumber: e.target.value
                                   })}/>

                            <FormLabel>Numéro de sécu</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de sécu"
                                   value={selectedBeneficiary.socialWorkerNumber}
                                   onChange={(e) => setSelectedBeneficiary({
                                       ...selectedBeneficiary,
                                       socialWorkerNumber: e.target.value
                                   })}/>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseEditionModal}>
                            Annuler
                        </Button>
                        <Button isLoading={creatingNewBeneficiaries} colorScheme="blue" mr={3}
                                onClick={onUpdateBeneficiary}>
                            Confirmer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenViewModal} onClose={onCloseViewModal} size="6xl" scrollBehavior="outside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                            <FormLabel>Login</FormLabel>
                            <Input type="text" placeholder="Login" readOnly={true} isDisabled={true}
                                   value={selectedBeneficiary.username}/>

                            <FormLabel>Nom</FormLabel>
                            <Input type="text" placeholder="nom" readOnly={true} isDisabled={true}
                                   value={selectedBeneficiary.lastName}/>

                            <FormLabel>Prenom</FormLabel>
                            <Input flex={1} type="text" placeholder="prenom" readOnly={true} isDisabled={true}
                                   value={selectedBeneficiary.firstName}/>

                            <FormLabel>Date de naissance</FormLabel>
                            <Input flex={1} type="date" placeholder="Date de naissance" readOnly={true}
                                   isDisabled={true}
                                   value={selectedBeneficiary.birthDate}/>

                            <FormLabel>Numéro de téléphone</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de téléphone" readOnly={true}
                                   isDisabled={true}
                                   value={selectedBeneficiary.phoneNumber}/>

                            <FormLabel>Numéro de sécu</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de sécu" readOnly={true} isDisabled={true}
                                   value={newBeneficiary.socialWorkerNumber}/>

                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseViewModal}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </BeneficiariesContext.Provider>
    )
}

export default Beneficiaries;
