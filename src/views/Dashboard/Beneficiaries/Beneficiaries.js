import React, {createContext, useContext, useState} from "react";
import {
    deleteBeneficiary,
    getBeneficiaries,
    registerBeneficiary,
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
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useDisclosure,
    VStack, Wrap, WrapItem,
} from "@chakra-ui/react";

import {Beneficiary} from "../../../model/Beneficiaries/Beneficiary";
import {BeneficiaryRegistration} from "../../../model/Beneficiaries/BeneficiaryRegistration";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import {DeleteIcon, EditIcon, InfoOutlineIcon, PhoneIcon} from "@chakra-ui/icons";
import Card from "../../../components/Card/Card";

const BeneficiariesContext = createContext({
    beneficiaries: [],
    setBeneficiaries: () => {
    },
});

function Beneficiaries() {

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

    const [selectedBeneficiary, setSelectedBeneficiary] = useState(new Beneficiary('', '', '', '', undefined, '', '', ''));

    if (!loadedBeneficiaries && !loadingBeneficiaries) {
        setLoadingBeneficiaries(true);
        getBeneficiaries().then((res) => {
            setBeneficiaries(res);
            console.log(res);
            setLoadingBeneficiaries(false);
            setLoadedBeneficiaries(true);
        }).catch((err) => {
            setLoadingBeneficiaries(false);
            setLoadedBeneficiaries(false);
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
        console.log(newBeneficiary)
        setCreatingNewBeneficiaries(true);
        registerBeneficiary(newBeneficiary)
            .then((res) => {
                setCreatingNewBeneficiaries(false);
                setLoadedBeneficiaries(false);
                onCloseCreationModal();
            }).catch((err) => {
            setCreatingNewBeneficiaries(false);
            console.log(err);
        });
    }

    const onUpdateBeneficiary = () => {
        console.log(selectedBeneficiary)
        setCreatingNewBeneficiaries(true);
        updateBeneficiary(selectedBeneficiary.id, selectedBeneficiary)
            .then((res) => {
                setCreatingNewBeneficiaries(false);
                setLoadedBeneficiaries(false);
                onCloseEditionModal();
            }).catch((err) => {
            setCreatingNewBeneficiaries(false);
            console.log(err);
        });
    }

    const veiwBeneficiaries = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        onOpenViewModal();
    }

    const deleteBeneficiaries = (beneficiary) => {
        console.log('deleteBeneficiaries')
        console.log(beneficiary)
        deleteBeneficiary(beneficiary.id)
            .then((res) => {
                setLoadedBeneficiaries(false);
            }).catch((err) => {
            console.log(err)
        });
    }

    const editBeneficiaries = (beneficiary) => {
        console.log('editBeneficiaries')
        console.log(beneficiary)
        setSelectedBeneficiary(beneficiary);
        onOpenEditionModal();
    }

    const getBeneficiariesCards = (beneficiary) => {
        return (
            <WrapItem>
                <Card key={beneficiary.id} maxW='max'>
                    <HStack align={'stretch'}>
                        <Text> Prénom : </Text>
                        <Text> {beneficiary.firstName} </Text>
                    </HStack>
                    <HStack>
                        <Text> Nom de famille : </Text>
                        <Text> {beneficiary.lastName} </Text>
                    </HStack>
                    <HStack>
                        <Icon as={PhoneIcon} mr="8px"/>
                        <Text> {beneficiary.phoneNumber} </Text>
                    </HStack>
                    <HStack>
                        <IconButton colorScheme="blue" aria-label="View"
                                    icon={<InfoOutlineIcon/>}
                                    onClick={() => veiwBeneficiaries(beneficiary)}/>
                        <IconButton colorScheme="yellow" aria-label="Modifier"
                                    icon={<EditIcon/>}
                                    onClick={() => editBeneficiaries(beneficiary)}/>
                        <IconButton colorScheme="red" aria-label="Supprimer"
                                    icon={<DeleteIcon/>}
                                    onClick={() => deleteBeneficiaries(beneficiary)}/>
                    </HStack>
                </Card>
            </WrapItem>
        );
    }

    return (
        <BeneficiariesContext.Provider value={{beneficiaries, setBeneficiaries}}>
            <VStack color={'green'} pt={{base: "120px", md: "75px"}} mr='32px' align={'stretch'}>
                <HStack color={'bleu'}>
                    <Button onClick={onOpenCreationModal}>
                        ajouter nouveau bénéficiaire
                    </Button>
                </HStack>
                <Wrap>
                    {beneficiaries.map((beneficiary) => getBeneficiariesCards(beneficiary))}
                </Wrap>
            </VStack>

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
                            <Input type="text" placeholder="Login" value={selectedBeneficiary.username}/>

                            <FormLabel>Nom</FormLabel>
                            <Input type="text" placeholder="nom" value={selectedBeneficiary.lastName}/>

                            <FormLabel>Prenom</FormLabel>
                            <Input flex={1} type="text" placeholder="prenom" value={selectedBeneficiary.firstName}/>

                            <FormLabel>Date de naissance</FormLabel>
                            <Input flex={1} type="date" placeholder="Date de naissance"
                                   value={selectedBeneficiary.birthDate}/>

                            <FormLabel>Numéro de téléphone</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de téléphone"
                                   value={selectedBeneficiary.phoneNumber}/>

                            <FormLabel>Numéro de sécu</FormLabel>
                            <Input flex={1} type="text" placeholder="Numéro de sécu"
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
