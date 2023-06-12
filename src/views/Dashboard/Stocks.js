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
import {createStockage, getAllProducts, getStockages} from "../../controller/StorageController";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import {getAllDepartment} from "../../controller/AddressController";
import VolunteerContext from "../../contexts/VolunteerContext";
import {ProductList} from "../../model/stock/ProductList";

export default function Stocks() {
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadedStorages, setLoadedStorages] = useState(false);
    const [loadedDepartments, setLoadedDepartments] = useState(false);
    const [loadedAllProducts, setLoadedAllProducts] = useState(false);
    const [storages, setStorages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [allProducts, setAllProducts] = useState(new ProductList([], []));
    const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
    const { isOpen: isOpenViewStorageModal, onOpen: onOpenViewStorageModal, onClose: onCloseViewStorageModal } = useDisclosure();
    const [storageName, setStorageName] = useState("");
    const [storageDepartment, setStorageDepartment] = useState("");
    const [storagePostalCode, setStoragePostalCode] = useState("");
    const [storageCity, setStorageCity] = useState("");
    const [storageAddress, setStorageAddress] = useState("");
    const [errorAddingStorage, setErrorAddingStorage] = useState("");
    const [createEventLoading, setCreateEventLoading] = useState(false);
    const [callAddStockage, setCallAddStockage] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);

    useEffect(() => {
        if (storageDepartment !== '' && departments.length > 0) {
            setStoragePostalCode(departments[storageDepartment].code);
        }
    }, [storageDepartment]);

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

    const loadProducts = () => {
        setLoadedAllProducts(true);
        getAllProducts()
            .then((products) => {
                setAllProducts(products);
            })
            .catch((_) => {
                setLoadedAllProducts(false);
            })
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

    const selectStorageForModal = (storage, onOpenModal) => {
        setSelectedStorage(storage);
        onOpenModal();
    }

    return (
        <>
            {!loadedStorages && loadStorages()}
            {!loadedDepartments && loadDepartments()}
            {!loadedAllProducts && loadProducts()}
            {callAddStockage && addStorage()}
            {console.log(allProducts)}
            <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                <Card pb="0px">
                    <CardHeader>
                        <Flex justify="space-between" m="12px 8px">
                            <Text fontSize="2xl">Stock de l'unité locale</Text>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Text fontSize="xl" fontWeight="semibold">
                            Nourriture
                        </Text>
                        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4, xl: 5 }} spacing="24px" m="12px">
                            {allProducts.foods.map((foodStorageProduct, key) => (
                                <Card key={key}>
                                    <CardHeader>
                                        <Text>{foodStorageProduct.product.name}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>Total: {foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                        <Text>{foodStorageProduct.product.quantity} * {foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                        <Text fontSize="xl" mt="16px" fontWeight="semibold">
                            Vêtements
                        </Text>
                        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4, xl: 5 }} spacing="24px" m="12px">
                            {allProducts.clothes.map((clothStorageProduct, key) => (
                                <Card key={key}>
                                    <CardHeader>
                                        <Text>{clothStorageProduct.product.name}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>Total: {clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                        <Text>{clothStorageProduct.product.quantity} * {clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </CardBody>
                </Card>
                <Card pb="0px" mt="24px">
                    <CardHeader>
                        <Flex justify="space-between" m="12px 8px">
                            <Text fontSize="2xl">Gestion des espaces de stockage</Text>
                            <Button onClick={onOpenAddModal} colorScheme="green">
                                AJOUTER
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing="40px">
                            {storages.map((storage) => (
                                <Card key={storage.id}>
                                    <CardHeader>
                                        <Text fontSize="xl">{storage.name}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Button colorScheme="orange" onClick={() => selectStorageForModal(storage, onOpenViewStorageModal)}>
                                            VOIR LE CONTENU
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
            <Modal isOpen={isOpenViewStorageModal} onClose={onCloseViewStorageModal} size="4xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contenu de l'espace de stockage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {console.log(selectedStorage)}
                        <Flex direction="column">
                            <Text>{selectedStorage.name}</Text>
                            <Text>{selectedStorage.address.city} ({selectedStorage.address.departmentCode} - {departments.filter(d => d.code === selectedStorage.address.departmentCode)[0].name})</Text>
                            <Text>{selectedStorage.address.streetNumberAndName} - {selectedStorage.address.postalCode}</Text>
                            <Text fontSize="xl" fontWeight="semibold">
                                Nourriture
                            </Text>
                            <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                {allProducts.foods.map((foodStorageProduct, key) => (
                                    <Card key={key}>
                                        <CardHeader>
                                            <Text>{foodStorageProduct.product.name}</Text>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>Total: {foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                            <Text>{foodStorageProduct.product.quantity} * {foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                            <Text fontSize="xl" mt="16px" fontWeight="semibold">
                                Vêtements
                            </Text>
                            <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                {allProducts.clothes.map((clothStorageProduct, key) => (
                                    <Card key={key}>
                                        <CardHeader>
                                            <Text>{clothStorageProduct.product.name}</Text>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>Total: {clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                            <Text>{clothStorageProduct.product.quantity} * {clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseViewStorageModal}>
                            Fermer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
