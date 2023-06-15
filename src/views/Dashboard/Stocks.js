import React, {useContext, useEffect, useState} from "react";
import {
    Badge,
    Button,
    Flex,
    FormControl,
    FormLabel, IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper, NumberInput,
    NumberInputField,
    NumberInputStepper,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {createStockage, getAllProducts, getStockages} from "../../controller/StorageController";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import {getAllDepartment} from "../../controller/AddressController";
import VolunteerContext from "../../contexts/VolunteerContext";
import {ProductList} from "../../model/stock/ProductList";
import {
    createClothProduct,
    createFoodProduct, deleteClothProduct, deleteFoodProduct,
    getConservations,
    getMeasurementUnits, getSizes
} from "../../controller/ProductController";
import {FaEdit, FaTrash} from "react-icons/fa";

export default function Stocks() {
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadedStorages, setLoadedStorages] = useState(false);
    const [loadedDepartments, setLoadedDepartments] = useState(false);
    const [loadedSizes, setLoadedSizes] = useState(false);
    const [loadedAllProducts, setLoadedAllProducts] = useState(false);
    const [loadedUnits, setLoadedUnits] = useState(false);
    const [loadedConservations, setLoadedConservations] = useState(false);
    const [storages, setStorages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [allProducts, setAllProducts] = useState(new ProductList([], []));
    const [units, setUnits] = useState([]);
    const [conservations, setConservations] = useState([]);
    const { isOpen: isOpenAddStorageModal, onOpen: onOpenAddStorageModal, onClose: onCloseAddStorageModal } = useDisclosure();
    const { isOpen: isOpenViewStorageModal, onOpen: onOpenViewStorageModal, onClose: onCloseViewStorageModal } = useDisclosure();
    const [storageName, setStorageName] = useState("");
    const [storageDepartment, setStorageDepartment] = useState("");
    const [storagePostalCode, setStoragePostalCode] = useState("");
    const [storageCity, setStorageCity] = useState("");
    const [storageAddress, setStorageAddress] = useState("");
    const [errorAddingStorage, setErrorAddingStorage] = useState("");
    const [createEventLoading, setCreateEventLoading] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    //Add new product
    const [callAddStockage, setCallAddStockage] = useState(false);
    const [addProductType, setAddProductType] = useState("food");
    const [addProductName, setAddProductName] = useState("");
    const [addProductQuantity, setAddProductQuantity] = useState(1);
    const [addProductUnit, setAddProductUnit] = useState("");
    const [addProductConservation, setAddProductConservation] = useState("");
    const [addProductExpirationDate, setAddProductExpirationDate] = useState(new Date().toISOString().substring(0, 10));
    const [addProductOptimalDate, setAddProductOptimalDate] = useState(new Date().toISOString().substring(0, 10));
    const [addProductPrice, setAddProductPrice] = useState(1);
    const [addProductStorageId, setAddProductStorageId] = useState("");
    const [addProductAmount, setAddProductAmount] = useState(1);
    const [addProductSize, setAddProductSize] = useState("");
    const [addProductError, setAddProductError] = useState("");
    const { isOpen: isOpenAddProductModal, onOpen: onOpenAddProductModal, onClose: onCloseAddProductModal } = useDisclosure();
    //Update product
    const { isOpen: isOpenUpdateProductModal, onOpen: onOpenUpdateProductModal, onClose: onCloseUpdateProductModal } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState("");
    //Delete product
    const { isOpen: isOpenDeleteProductModal, onOpen: onOpenDeleteProductModal, onClose: onCloseDeleteProductModal } = useDisclosure();

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

    const loadUnits = () => {
        setLoadedUnits(true);
        getMeasurementUnits()
            .then((units) => {
                setUnits(units);
            })
            .catch((_) => {
                setLoadedUnits(false);
            });
    }

    const loadConservations = () => {
        setLoadedConservations(true);
        getConservations()
            .then((conservations) => {
                setConservations(conservations.conservations);
            })
            .catch((_) => {
                setLoadedConservations(false);
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

    const loadSizes = () => {
        setLoadedSizes(true);
        getSizes()
            .then((sizes) => {
                setSizes(sizes);
            })
            .catch((_) => {
                setLoadedSizes(false);
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
                onCloseAddStorageModal();
                setLoadedStorages(false);
                setCreateEventLoading(false);
            })
            .catch((_) => {
                setCreateEventLoading(false);
            });
    }

    const selectProductForModal = (product, type, onOpenModal) => {
        setSelectedProduct(product);
        setSelectedProductType(type);
        onOpenModal();
    }

    const selectStorageForModal = (storage, onOpenModal) => {
        setSelectedStorage(storage);
        onOpenModal();
    }

    const addProduct = () => {
        setAddProductError("");
        if (addProductName === "") {
            setAddProductError("Veuillez renseigner un nom pour le produit");
            return;
        }
        if (addProductStorageId === "") {
            setAddProductError("Veuillez renseigner un espace de stockage pour le produit");
            return;
        }
        if (addProductType === "food") {
            addFoodProduct();
        }
        if (addProductType === "cloth") {
            addClothProduct();
        }
    }

    const addFoodProduct = () => {
        if (addProductUnit === "") {
            setAddProductError("Veuillez renseigner une unité pour le produit");
            return;
        }
        if (addProductConservation === "") {
            setAddProductError("Veuillez renseigner une conservation pour le produit");
            return;
        }
        let expirationDate;
        try {
            const [years, month, days] = addProductExpirationDate.split("-");
            expirationDate = new Date(parseInt(years), parseInt(month) - 1, parseInt(days));
        } catch (err) {
            setAddProductError("Veuillez renseigner une date d'expiration valide pour le produit");
            return;
        }
        let optimalDate;
        try {
            const [years, month, days] = addProductOptimalDate.split("-");
            optimalDate = new Date(parseInt(years), parseInt(month) - 1, parseInt(days));
        } catch (err) {
            setAddProductError("Veuillez renseigner une date optimale de consommation valide pour le produit");
            return;
        }
        createFoodProduct(addProductName, addProductQuantity, addProductUnit, addProductConservation, expirationDate, optimalDate, addProductPrice, addProductStorageId, addProductAmount)
            .then((_) => {
                onCloseAddProductModal();
                setLoadedAllProducts(false);
            })
            .catch((err) => {
                console.log(err);
                setAddProductError("Une erreur est survenue lors de l'ajout du produit");
            });
    }

    const addClothProduct = () => {
        if (addProductSize === "") {
            setAddProductError("Veuillez renseigner une taille pour le produit");
            return;
        }
        createClothProduct(addProductName, addProductQuantity, addProductSize, addProductStorageId, addProductAmount)
            .then((_) => {
                onCloseAddProductModal();
                setLoadedAllProducts(false);
            })
            .catch((err) => {
                console.log(err);
                setAddProductError("Une erreur est survenue lors de l'ajout du produit");
            });
    }

    const deleteProduct = () => {
        if (selectedProductType === "food" && selectedProduct !== null) {
            deleteFoodProduct(selectedProduct.id)
                .then((_) => {
                    onCloseDeleteProductModal();
                    setLoadedAllProducts(false);
                })
                .catch((_) => {
                });
        }
        if (selectedProductType === "cloth" && selectedProduct !== null) {
            deleteClothProduct(selectedProduct.id)
                .then((_) => {
                    onCloseDeleteProductModal();
                    setLoadedAllProducts(false);
                })
                .catch((_) => {
                });
        }
    }

    return (
        <>
            {!loadedStorages && loadStorages()}
            {!loadedDepartments && loadDepartments()}
            {!loadedUnits && loadUnits()}
            {!loadedConservations && loadConservations()}
            {!loadedSizes && loadSizes()}
            {!loadedAllProducts && loadProducts()}
            {callAddStockage && addStorage()}
            <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                <Card pb="0px">
                    <CardHeader>
                        <Flex justify="space-between" m="12px 8px">
                            <Text fontSize="2xl">Stock de l'unité locale</Text>
                            <Button colorScheme="green" onClick={onOpenAddProductModal}>Ajouter un produit aux stocks</Button>
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
                                        <Flex direction="row">
                                            <IconButton aria-label="Editer le produit" icon={<FaEdit />} size="sm" onClick={() => selectProductForModal(foodStorageProduct, "food", onOpenUpdateProductModal)} mr="4px"/>
                                            <IconButton aria-label="Supprimer le produit" icon={<FaTrash />} size="sm" onClick={() => selectProductForModal(foodStorageProduct, "food", onOpenDeleteProductModal)}/>
                                            <Text m="auto 0 auto 12px">{foodStorageProduct.product.name}</Text>
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() < Date.now() && (
                                            <Badge m="2px" colorScheme="red">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() > Date.now() && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() < (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                            <Badge m="2px" colorScheme="orange">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() > (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                            <Badge m="2px" colorScheme="green">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() < Date.now() && (
                                            <Badge m="2px" colorScheme="red">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() > Date.now() && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() < (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                            <Badge m="2px" colorScheme="orange">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() > (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                            <Badge m="2px" colorScheme="green">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                        )}
                                        <Text>{foodStorageProduct.product.quantity} * {foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                        <Badge colorScheme="purple">{foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Badge>
                                    </CardBody>
                                </Card>
                            ))}
                            {allProducts.foods.length === 0 && (
                                <Text>Aucun produit en stock</Text>
                            )}
                        </SimpleGrid>
                        <Text fontSize="xl" mt="16px" fontWeight="semibold">
                            Vêtements
                        </Text>
                        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4, xl: 5 }} spacing="24px" m="12px">
                            {allProducts.clothes.map((clothStorageProduct, key) => (
                                <Card key={key}>
                                    <CardHeader>
                                        <Flex direction="row">
                                            <IconButton aria-label="Editer le produit" icon={<FaEdit />} size="sm" onClick={() => selectProductForModal(clothStorageProduct, "cloth", onOpenUpdateProductModal)} mr="4px"/>
                                            <IconButton aria-label="Supprimer le produit" icon={<FaTrash />} size="sm" onClick={() => selectProductForModal(clothStorageProduct, "cloth", onOpenDeleteProductModal)}/>
                                            <Text m="auto 0 auto 12px">{clothStorageProduct.product.name}</Text>
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>{clothStorageProduct.product.quantity} * {clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                        <Badge colorScheme="purple">{clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Badge>
                                    </CardBody>
                                </Card>
                            ))}
                            {allProducts.clothes.length === 0 && (
                                <Text>Aucun produit en stock</Text>
                            )}
                        </SimpleGrid>
                    </CardBody>
                </Card>
                <Card pb="0px" mt="24px">
                    <CardHeader>
                        <Flex justify="space-between" m="12px 8px">
                            <Text fontSize="2xl">Gestion des espaces de stockage</Text>
                            <Button onClick={onOpenAddStorageModal} colorScheme="green">
                                AJOUTER
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing="40px">
                            {storages.map((storage) => (
                                <Card key={storage.id}>
                                    <CardHeader>
                                        <Text fontSize="xl" textAlign="center">{storage.name}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Flex direction="row">
                                            <Flex direction="column" w="50%">
                                                <Text fontSize="sm">Quantité de nourriture: {allProducts.foods.filter(f => f.product.storageId === storage.id).reduce((acc, f) => acc + f.product.quantity, 0)}</Text>
                                                <Text fontSize="sm">Quantité de vêtements: {allProducts.clothes.filter(c => c.product.storageId === storage.id).reduce((acc, c) => acc + c.product.quantity, 0)}</Text>
                                            </Flex>
                                            <Button colorScheme="orange" size="sm" onClick={() => selectStorageForModal(storage, onOpenViewStorageModal)} w="50%">
                                                VOIR LE CONTENU
                                            </Button>
                                        </Flex>
                                    </CardBody>
                                </Card>
                            ))}
                            {storages.length === 0 && (
                                <Text>Aucun espace de stockage</Text>
                            )}
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Flex>
            <Modal isOpen={isOpenAddProductModal} onClose={onCloseAddProductModal} size="2xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Ajouter un produit aux stocks</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text size="md" fontWeight="semibold" w="40%">
                            Type de produit à ajouter
                        </Text>
                        <RadioGroup value={addProductType} onChange={(e) => setAddProductType(e)}>
                            <Radio value="food" margin="8px 64px">Nourriture</Radio>
                            <Radio value="cloth" margin="8px 64px">Vêtement</Radio>
                        </RadioGroup>
                        {(isNaN(addProductQuantity) || addProductQuantity <= 0) && setAddProductQuantity(1)}
                        {(isNaN(addProductPrice) || addProductPrice < 0) && setAddProductPrice(0)}
                        {(isNaN(addProductAmount) || addProductAmount <= 0) && setAddProductAmount(1)}
                        <FormControl>
                            <FormLabel>Nom du produit</FormLabel>
                            <Input type="text" placeholder="Nom du produit" value={addProductName} onChange={(e) => setAddProductName(e.target.value)}/>
                            <Text size="md" mt="8px" fontWeight="semibold">Espace de stockage</Text>
                            <Select placeholder="Espace de stockage" value={addProductStorageId} onChange={(e) => setAddProductStorageId(e.target.value)}>
                                {storages.map((storage, key) => (
                                    <option key={key} value={storage.id}>{storage.name}</option>
                                ))}
                            </Select>
                            <Text size="md" mt="8px" fontWeight="semibold">Nombre d'exemplaire du produit perçu</Text>
                            <NumberInput defaultValue={1} min={1} max={2000000} value={addProductAmount} onChange={(e) => setAddProductAmount(parseInt(e))}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Text size="md" mt="8px" fontWeight="semibold">Contenue du produit en quantité</Text>
                            <NumberInput defaultValue={1} min={1} max={2000000} value={addProductQuantity} onChange={(e) => setAddProductQuantity(parseInt(e))}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {addProductType === "food" && (
                                <>
                                    <Text size="md" mt="8px" fontWeight="semibold">Unité de quantité du produit</Text>
                                    <RadioGroup value={addProductUnit} onChange={(e) => setAddProductUnit(e)}>
                                        <Flex direction="row" justify="space-between">
                                            {units.map((unit, key) => (
                                                <Flex direction="column" key={key}>
                                                    <Text>{unit.label}</Text>
                                                    {unit.units.map((unitName, keyRadio) => (
                                                        <div key={keyRadio}>
                                                            {unitName !== "" && (
                                                                <Radio value={unitName}>{unitName}</Radio>
                                                            )}
                                                        </div>
                                                    ))}
                                                </Flex>
                                            ))}
                                        </Flex>
                                    </RadioGroup>
                                    <Text size="md" mt="8px" fontWeight="semibold">Méthode de conservation</Text>
                                    <RadioGroup value={addProductConservation} onChange={(e) => setAddProductConservation(e)}>
                                        <Flex direction="row" justify="space-between">
                                            {conservations.map((conservation, key) => (
                                                <Radio key={key} value={conservation}>{conservation}</Radio>
                                            ))}
                                        </Flex>
                                    </RadioGroup>
                                    <Text size="md" mt="8px" fontWeight="semibold">Date de consommation optimale</Text>
                                    <Input type="date" value={addProductOptimalDate} onChange={(e) => setAddProductOptimalDate(e.target.value)} />
                                    <Text size="md" mt="8px" fontWeight="semibold">Date de péremption</Text>
                                    <Input type="date" value={addProductExpirationDate} onChange={(e) => setAddProductExpirationDate(e.target.value)} />
                                    <Text size="md" mt="8px" fontWeight="semibold">Prix en centimes</Text>
                                    <NumberInput defaultValue={1} min={0} max={2000000} value={addProductPrice} onChange={(e) => setAddProductPrice(parseInt(e))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </>
                            )}
                            {addProductType === "cloth" && (
                                <>
                                    <Text size="md" mt="8px" fontWeight="semibold">Taille du vêtement</Text>
                                    <Select placeholder="Taille du vêtement" value={addProductSize} onChange={(e) => setAddProductSize(e.target.value)}>
                                        {sizes.map((size, key) => (
                                            <option key={key} value={size}>{size}</option>
                                        ))}
                                    </Select>
                                </>
                            )}
                        </FormControl>
                        {addProductError !== "" && (
                            <Text color="red">{addProductError}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseAddProductModal}>
                            Fermer
                        </Button>
                        <Button colorScheme="green" mr={3} onClick={() => addProduct()}>
                            Ajouter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenUpdateProductModal} onClose={onCloseUpdateProductModal} size="lg" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier un produit</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Text>TODO</Text>
                        </FormControl>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDeleteProductModal} onClose={onCloseDeleteProductModal} size="lg" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Supprimer un produit</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            {selectedProduct !== null && (
                                <Text>Etes-vous sur de vouloir supprimer {selectedProduct?.product?.name} ?</Text>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseDeleteProductModal}>
                            Annuler
                        </Button>
                        <Button colorScheme="red" variant="outline" mr={3} onClick={() => deleteProduct()}>
                            Supprimer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenAddStorageModal} onClose={onCloseAddStorageModal} size="xl" scrollBehavior="outside">
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
                        <Button colorScheme="blue" mr={3} onClick={onCloseAddStorageModal}>
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
                        {selectedStorage !== null && (
                            <Flex direction="column">
                                <Text>{selectedStorage.name}</Text>
                                <Text>{selectedStorage.address.city} ({selectedStorage.address.departmentCode} - {departments.filter(d => d.code === selectedStorage.address.departmentCode)[0].name})</Text>
                                <Text>{selectedStorage.address.streetNumberAndName} - {selectedStorage.address.postalCode}</Text>
                                <Text fontSize="xl" fontWeight="semibold">
                                    Nourriture
                                </Text>
                                <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                    {allProducts.foods.filter(f => f.product.storageId === selectedStorage.id).map((foodStorageProduct, key) => (
                                        <Card key={key}>
                                            <CardHeader>
                                                <Flex direction="row">
                                                    <IconButton aria-label="Editer le produit" icon={<FaEdit />} size="sm" onClick={() => selectProductForModal(foodStorageProduct, "food", onOpenUpdateProductModal)} mr="4px"/>
                                                    <IconButton aria-label="Supprimer le produit" icon={<FaTrash />} size="sm" onClick={() => selectProductForModal(foodStorageProduct, "food", onOpenDeleteProductModal)}/>
                                                    <Text m="auto 0 auto 12px">{foodStorageProduct.product.name}</Text>
                                                </Flex>
                                            </CardHeader>
                                            <CardBody>
                                                {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() < Date.now() && (
                                                    <Badge m="2px" colorScheme="red">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() > Date.now() && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() < (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                                    <Badge m="2px" colorScheme="orange">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                {foodStorageProduct.expirationDate && new Date(foodStorageProduct.expirationDate.split('[')[0]).getTime() > (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                                    <Badge m="2px" colorScheme="green">DLC {new Date(foodStorageProduct.expirationDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() < Date.now() && (
                                                    <Badge m="2px" colorScheme="red">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() > Date.now() && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() < (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                                    <Badge m="2px" colorScheme="orange">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                {foodStorageProduct.optimalConsumptionDate && new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).getTime() > (new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) && (
                                                    <Badge m="2px" colorScheme="green">DLUO {new Date(foodStorageProduct.optimalConsumptionDate.split('[')[0]).toLocaleDateString()}</Badge>
                                                )}
                                                <Text>{foodStorageProduct.product.quantity} * {foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Text>
                                                <Badge colorScheme="purple">{foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Badge>
                                            </CardBody>
                                        </Card>
                                    ))}
                                    {allProducts.foods.filter(f => f.product.storageId === selectedStorage.id).length === 0 && (
                                        <Text>Aucun produit en stock</Text>
                                    )}
                                </SimpleGrid>
                                <Text fontSize="xl" mt="16px" fontWeight="semibold">
                                    Vêtements
                                </Text>
                                <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                    {allProducts.clothes.filter(f => f.product.storageId === selectedStorage.id).map((clothStorageProduct, key) => (
                                        <Card key={key}>
                                            <CardHeader>
                                                <Flex direction="row">
                                                    <IconButton aria-label="Editer le produit" icon={<FaEdit />} size="sm" onClick={() => selectProductForModal(clothStorageProduct, "cloth", onOpenUpdateProductModal)} mr="4px"/>
                                                    <IconButton aria-label="Supprimer le produit" icon={<FaTrash />} size="sm" onClick={() => selectProductForModal(clothStorageProduct, "cloth", onOpenDeleteProductModal)}/>
                                                    <Text m="auto 0 auto 12px">{clothStorageProduct.product.name}</Text>
                                                </Flex>
                                            </CardHeader>
                                            <CardBody>
                                                <Text>{clothStorageProduct.product.quantity} * {clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Text>
                                                <Badge colorScheme="purple">{clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Badge>
                                            </CardBody>
                                        </Card>
                                    ))}
                                    {allProducts.clothes.filter(f => f.product.storageId === selectedStorage.id).length === 0 && (
                                        <Text>Aucun produit en stock</Text>
                                    )}
                                </SimpleGrid>
                            </Flex>
                        )}
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
