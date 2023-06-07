import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Flex, FormControl, FormLabel, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select,
    SimpleGrid,
    Text, useDisclosure
} from "@chakra-ui/react";
import {createStockage, getStockages} from "../../controller/StorageController";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import {getAllDepartment} from "../../controller/AddressController";
import {getMyProfile} from "../../controller/VolunteerController";
import {useHistory} from "react-router-dom";
import TokenContext from "../../contexts/TokenContext";
import VolunteerContext from "../../contexts/VolunteerContext";

export default function Stocks() {
    const history = useHistory();
    const {token} = useContext(TokenContext);
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadedVolunteer, setLoadedVolunteer] = useState(false);
    const [loadedStorages, setLoadedStorages] = useState(false);
    const [loadedDepartments, setLoadedDepartments] = useState(false);
    const [storages, setStorages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
    const [storageName, setStorageName] = useState("");
    const [storageDepartment, setStorageDepartment] = useState("");
    const [storagePostalCode, setStoragePostalCode] = useState("");
    const [storageCity, setStorageCity] = useState("");
    const [storageAddress, setStorageAddress] = useState("");
    const [errorAddingStorage, setErrorAddingStorage] = useState("");
    const [createEventLoading, setCreateEventLoading] = useState(false);
    const [callAddStockage, setCallAddStockage] = useState(false);

    useEffect(() => {
        if (storageDepartment !== '' && departments.length > 0) {
            setStoragePostalCode(departments[storageDepartment].code);
        }
    }, [storageDepartment]);

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

    const loadStorages = () => {
        setLoadedStorages(true);
        getStockages()
            .then((storages) => {
                setStorages(storages);
            })
            .catch((_) => {
                setLoadedStorages(false);
            });
    }

    const loadDepartments = () => {
        setLoadedDepartments(true);
        getAllDepartment()
            .then((departments) => {
                setDepartments(departments);
            })
            .catch((_) => {
                setLoadedDepartments(false);
            });
    }

    const addStorage = () => {
        setCallAddStockage(false);
        setCreateEventLoading(true);
        setErrorAddingStorage("");
        if (storageName === "") {
            setErrorAddingStorage("Veuillez renseigner un nom pour l'espace de stockage");
            return;
        }

        if (storageDepartment === "") {
            setErrorAddingStorage("Veuillez renseigner un département pour l'espace de stockage");
            return;
        }

        if (storagePostalCode === "") {
            setErrorAddingStorage("Veuillez renseigner un code postale pour l'espace de stockage");
            return;
        }

        if (storageCity === "") {
            setErrorAddingStorage("Veuillez renseigner une ville pour l'espace de stockage");
            return;
        }

        if (storageAddress === "") {
            setErrorAddingStorage("Veuillez renseigner une adresse pour l'espace de stockage");
            return;
        }

        createStockage(storageName, volunteer.localUnitId, departments[storageDepartment].code, storagePostalCode, storageCity, storageAddress)
            .then(() => {
                onCloseAddModal();
                setLoadedStorages(false);
                setCreateEventLoading(false);
            })
            .catch((_) => {
                setCreateEventLoading(false);
            });
    }

    return (
        <>
            {!loadedVolunteer && loadVolunteer()}
            {!loadedStorages && loadStorages()}
            {!loadedDepartments && loadDepartments()}
            {callAddStockage && addStorage()}
            <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                <Card pb="0px">
                    <CardHeader>
                        <Flex justify="space-between" m="12px 8px">
                            <Text fontSize="2xl">Gestion des espaces de stockage</Text>
                            <Button onClick={onOpenAddModal} colorScheme="green">
                                AJOUTER
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{ lg: 1, md: 2, xl: 3 }} spacing="40px">
                            {storages.map((storage) => (
                                <Card key={storage.id}>
                                    <CardHeader>
                                        <Text fontSize="xl">{storage.name}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Button colorScheme="orange">
                                            CONSULTER
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Flex>
            <Modal isOpen={isOpenAddModal} onClose={onCloseAddModal} size="xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Ajouter un espace de stockage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nom de l'espace de stockage</FormLabel>
                            <Input type="text" placeholder="Nom de l'espace de stockage" value={storageName} onChange={(e) => setStorageName(e.target.value)}/>
                            <Text size="md" mt="8px" fontWeight="semibold">Emplacement de l'espace de stockage</Text>
                            <FormLabel>Département</FormLabel>
                            <Select placeholder="Sélectionnez un département" value={storageDepartment} onChange={(e) => setStorageDepartment(e.target.value)}>
                                {departments.map((department, index) => {
                                    return (
                                        <option key={index} value={index}>{department.code} - {department.name}</option>
                                    );
                                })}
                            </Select>
                            <FormLabel>Code postale</FormLabel>
                            <Input type="text" placeholder="Code postale" value={storagePostalCode} onChange={(e) => setStoragePostalCode(e.target.value)}/>
                            <FormLabel>Ville</FormLabel>
                            <Input type="text" placeholder="Ville" value={storageCity} onChange={(e) => setStorageCity(e.target.value)}/>
                            <FormLabel>Adresse</FormLabel>
                            <Input type="text" placeholder="Adresse" value={storageAddress} onChange={(e) => setStorageAddress(e.target.value)}/>
                        </FormControl>
                        {errorAddingStorage !== "" && (
                            <Text color="red" mt="8px">{errorAddingStorage}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseAddModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="green" onClick={() => setCallAddStockage(true)} isDisabled={createEventLoading}>
                            Ajouter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
