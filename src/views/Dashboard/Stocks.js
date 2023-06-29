import React, {useContext, useEffect, useRef, useState} from "react";
import {
    Badge,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {
    createStockage,
    deleteStockage,
    getAllProducts,
    getProductsByStorage,
    getStockages, updateStockage
} from "../../controller/StorageController";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import {getAllDepartment} from "../../controller/AddressController";
import VolunteerContext from "../../contexts/VolunteerContext";
import {ProductList} from "../../model/stock/ProductList";
import {
    createClothProduct,
    createFoodProduct,
    deleteClothProduct,
    deleteFoodProduct,
    getConservations,
    getGenders,
    getMeasurementUnits,
    getSizes,
    updateClothProduct,
    updateFoodProduct
} from "../../controller/ProductController";
import {FaCog, FaEdit, FaEye, FaPencilAlt, FaTrash, FaTrashAlt} from "react-icons/fa";
import Quagga from "quagga";
import {readFromBarCode} from "../../controller/OpenFoodFactController";
import {getCitiesFromPostalCode} from "../../controller/IGNController";

export default function Stocks() {
    const {volunteer, setVolunteer} = useContext(VolunteerContext);
    const [loadedStorages, setLoadedStorages] = useState(false);
    const [loadedDepartments, setLoadedDepartments] = useState(false);
    const [loadedSizes, setLoadedSizes] = useState(false);
    const [loadedAllProducts, setLoadedAllProducts] = useState(false);
    const [loadedProductsByStorage, setLoadedProductsByStorage] = useState(true);
    const [loadedUnits, setLoadedUnits] = useState(false);
    const [loadedConservations, setLoadedConservations] = useState(false);
    const [loadedGenders, setLoadedGenders] = useState(false);
    const [storages, setStorages] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [allProducts, setAllProducts] = useState(new ProductList([], []));
    const [units, setUnits] = useState([]);
    const [conservations, setConservations] = useState([]);
    const [genders, setGenders] = useState([]);
    const { isOpen: isOpenAddStorageModal, onOpen: onOpenAddStorageModal, onClose: onCloseAddStorageModal } = useDisclosure();
    const { isOpen: isOpenDeleteStorageModal, onOpen: onOpenDeleteStorageModal, onClose: onCloseDeleteStorageModal } = useDisclosure();
    const { isOpen: isOpenUpdateStorageModal, onOpen: onOpenUpdateStorageModal, onClose: onCloseUpdateStorageModal } = useDisclosure();
    const { isOpen: isOpenViewStorageModal, onOpen: onOpenViewStorageModal, onClose: onCloseViewStorageModal } = useDisclosure();
    const [storageName, setStorageName] = useState("");
    const [storageDepartment, setStorageDepartment] = useState("");
    const [storagePostalCode, setStoragePostalCode] = useState("");
    const [storageCity, setStorageCity] = useState("");
    const [storageAddress, setStorageAddress] = useState("");
    const [errorAddingStorage, setErrorAddingStorage] = useState("");
    const [createEventLoading, setCreateEventLoading] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageProducts, setSelectedStorageProducts] = useState(new ProductList([], []));
    const [addStorageCityList, setAddStorageCityList] = useState([]);
    const [updatedStorageName, setUpdatedStorageName] = useState("");
    const [updatedStorageDepartment, setUpdatedStorageDepartment] = useState("");
    const [updatedStoragePostalCode, setUpdatedStoragePostalCode] = useState("");
    const [updatedStorageCity, setUpdatedStorageCity] = useState("");
    const [updatedStorageAddress, setUpdatedStorageAddress] = useState("");
    const [errorUpdatingStorage, setErrorUpdatingStorage] = useState("");
    //Add new product
    const { isOpen: isOpenAddProductModal, onOpen: onOpenAddProductModal, onClose: onCloseAddProductModal } = useDisclosure();
    const [callAddStockage, setCallAddStockage] = useState(false);
    const [callUpdateStockage, setCallUpdateStockage] = useState(false);
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
    const [addProductGender, setAddProductGender] = useState("");
    const [addProductError, setAddProductError] = useState("");
    //Update product
    const { isOpen: isOpenUpdateProductModal, onOpen: onOpenUpdateProductModal, onClose: onCloseUpdateProductModal } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState("");
    const [updatedProductName, setUpdatedProductName] = useState("");
    const [updatedProductQuantity, setUpdatedProductQuantity] = useState(1);
    const [updatedProductUnit, setUpdatedProductUnit] = useState("");
    const [updatedProductConservation, setUpdatedProductConservation] = useState("");
    const [updatedProductExpirationDate, setUpdatedProductExpirationDate] = useState(new Date().toISOString().substring(0, 10));
    const [updatedProductOptimalDate, setUpdatedProductOptimalDate] = useState(new Date().toISOString().substring(0, 10));
    const [updatedProductPrice, setUpdatedProductPrice] = useState(1);
    const [updatedProductStorageId, setUpdatedProductStorageId] = useState("");
    const [updatedProductAmount, setUpdatedProductAmount] = useState(1);
    const [updatedProductSize, setUpdatedProductSize] = useState("");
    const [updatedProductGender, setUpdatedProductGender] = useState("");
    const [updatedProductError, setUpdatedProductError] = useState("");
    //Delete product
    const { isOpen: isOpenDeleteProductModal, onOpen: onOpenDeleteProductModal, onClose: onCloseDeleteProductModal } = useDisclosure();
    //Quagga scanner
    const { isOpen: isOpenScannerModal, onOpen: onOpenScannerModal, onClose: onCloseScannerModal } = useDisclosure();
    const scannerRef = useRef(null);
    const [barcodeScanned, setBarcodeScanned] = useState(false);

    const openScannerModal = () => {
        onOpenScannerModal();
        setBarcodeScanned(false);

        setTimeout(() => {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: scannerRef.current
                },
                decoder: {
                    readers: ["ean_reader"]
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                Quagga.start();
            });

            Quagga.onDetected((data) => {
                if (!barcodeScanned) {
                    setBarcodeScanned(true);
                    readFromBarCode(data.codeResult.code)
                        .then((product) => {
                            // Quagga.offDetected();
                            Quagga.stop();
                            setAddProductName(product.name);
                            setAddProductQuantity(product.quantityQuantifier);
                            setAddProductUnit(units.flatMap((item) => item.units.filter((unit) => unit !== "")).filter((unit) => unit.substring(0, product.quantifierName.length).toUpperCase() === product.quantifierName.toUpperCase()));
                            onCloseScannerModal();
                            setAddProductExpirationDate(product.expirationDate.toISOString().substring(0, 10));
                        })
                        .catch((err) => {
                            console.log("Error reading barcode: " + err);
                            setBarcodeScanned(false);
                        });
                }
            });
        }, 1000);
    };

    useEffect(() => {
        Quagga.onDetected((data) => {
            if (!barcodeScanned) {
                setBarcodeScanned(true);
                readFromBarCode(data.codeResult.code)
                    .then((product) => {
                        // Quagga.offDetected();
                        Quagga.stop();
                        setAddProductName(product.name);
                        setAddProductQuantity(product.quantityQuantifier);
                        setAddProductUnit(units.flatMap((item) => item.units.filter((unit) => unit !== "")).filter((unit) => unit.substring(0, product.quantifierName.length).toUpperCase() === product.quantifierName.toUpperCase()));
                        onCloseScannerModal();
                        setAddProductExpirationDate(product.expirationDate.toISOString().substring(0, 10));
                    })
                    .catch((err) => {
                        console.log("Error reading barcode: " + err);
                        setBarcodeScanned(false);
                    });
            }
        });
    }, []);

    const closeScannerModal = () => {
        onCloseScannerModal();
        // Quagga.offDetected();
        Quagga.stop();
    };

    useEffect(() => {
        if (storageDepartment !== '' && storageDepartment !== undefined && departments.length > 0) {
            setStoragePostalCode(departments[storageDepartment].code);
        }
    }, [storageDepartment]);

    useEffect(() => {
        if (updatedStorageDepartment !== '' && updatedStorageDepartment !== undefined && departments.length > 0 && isOpenUpdateStorageModal) {
            setUpdatedStoragePostalCode(departments[updatedStorageDepartment].code);
        }
    }, [updatedStorageDepartment]);

    useEffect(() => {
        if (storagePostalCode.length === 5) {
            getCitiesFromPostalCode(storagePostalCode)
                .then((cities) => {
                    console.log(cities);
                    setAddStorageCityList(cities);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [storagePostalCode]);

    useEffect(() => {
        if (storagePostalCode.length === 5) {
            getCitiesFromPostalCode(storagePostalCode)
                .then((cities) => {
                    console.log(cities);
                    setAddStorageCityList(cities);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [updatedStoragePostalCode]);

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

    const loadProductsFromStorage = () => {
        setLoadedProductsByStorage(true);
        getProductsByStorage(selectedStorage.id)
            .then((products) => {
                setSelectedStorageProducts(products);
            })
            .catch((_) => {
                setLoadedProductsByStorage(false);
            });
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

    const loadGenders = () => {
        setLoadedGenders(true);
        getGenders()
            .then((genders) => {
                setGenders(genders);
            })
            .catch((_) => {
                setLoadedGenders(false);
            });
    }

    const addStorage = () => {
        setCallAddStockage(false);
        setCreateEventLoading(true);
        setErrorAddingStorage("");
        if (storageName === "") {
            setErrorAddingStorage("Veuillez renseigner un nom pour l'espace de stockage");
            setCreateEventLoading(false);
            return;
        }

        if (storageDepartment === "") {
            setErrorAddingStorage("Veuillez renseigner un département pour l'espace de stockage");
            setCreateEventLoading(false);
            return;
        }

        if (storagePostalCode === "" || storagePostalCode.length !== 5) {
            setErrorAddingStorage("Veuillez renseigner un code postale valide pour l'espace de stockage");
            setCreateEventLoading(false);
            return;
        }

        if (storageCity === "") {
            setErrorAddingStorage("Veuillez renseigner une ville pour l'espace de stockage");
            setCreateEventLoading(false);
            return;
        }

        if (storageAddress === "") {
            setErrorAddingStorage("Veuillez renseigner une adresse pour l'espace de stockage");
            setCreateEventLoading(false);
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

    const updateStorage = () => {
        setCallUpdateStockage(false);
        setErrorUpdatingStorage("");
        if (updatedStorageName === "") {
            setErrorUpdatingStorage("Veuillez renseigner un nom pour l'espace de stockage");
            return;
        }

        if (updatedStorageDepartment === "") {
            setErrorUpdatingStorage("Veuillez renseigner un département pour l'espace de stockage");
            return;
        }

        if (updatedStoragePostalCode === "" || updatedStoragePostalCode.length !== 5) {
            setErrorUpdatingStorage("Veuillez renseigner un code postale valide pour l'espace de stockage");
            return;
        }

        if (updatedStorageCity === "") {
            setErrorUpdatingStorage("Veuillez renseigner une ville pour l'espace de stockage");
            return;
        }

        if (updatedStorageAddress === "") {
            setErrorUpdatingStorage("Veuillez renseigner une adresse pour l'espace de stockage");
            return;
        }

        updateStockage(selectedStorage.id, updatedStorageName, selectedStorage.localUnitId, departments[updatedStorageDepartment].code, updatedStoragePostalCode, updatedStorageCity, updatedStorageAddress)
            .then(() => {
                onCloseUpdateStorageModal();
                setLoadedStorages(false);
            })
            .catch((_) => {
            });
    }

    const deleteStorage = () => {
        deleteStockage(selectedStorage.id)
            .then((_) => {
                onCloseDeleteStorageModal();
                setLoadedStorages(false);
            })
            .catch((_) => {
            });
    }

    const selectProductForModal = (product, type, onOpenModal) => {
        setSelectedProduct(product);
        setSelectedProductType(type);
        setUpdatedProductName(product.product.name);
        setUpdatedProductQuantity(product.product.quantityQuantifier);
        setUpdatedProductUnit(product.product.quantifierName)
        setUpdatedProductStorageId(product.product.storageId);
        setUpdatedProductAmount(product.product.quantity);
        if (type === "food") {
            setUpdatedProductConservation(product.conservation);
            setUpdatedProductExpirationDate(new Date(product.expirationDate.split('[')[0]).toISOString().substring(0, 10));
            setUpdatedProductOptimalDate(new Date(product.optimalConsumptionDate.split('[')[0]).toISOString().substring(0, 10));
            setUpdatedProductPrice(product.product.price);
        }
        if (type === "cloth") {
            setUpdatedProductSize(product.size);
            setUpdatedProductGender(product.gender);
        }
        onOpenModal();
    }

    const selectStorageForModal = (storage, onOpenModal) => {
        console.log(storage)
        setSelectedStorage(storage);
        setLoadedProductsByStorage(false);
        setUpdatedStorageDepartment(Number(storage.address.departmentCode) - 2);
        setUpdatedStorageName(storage.name);
        setUpdatedStorageAddress(storage.address.streetNumberAndName);
        setUpdatedStoragePostalCode(storage.address.postalCode);
        setUpdatedStorageCity(storage.address.city);
        getCitiesFromPostalCode(storage.address.postalCode)
            .then((cities) => {
                console.log(cities);
                setAddStorageCityList(cities);
            })
            .catch((err) => {
                console.log(err);
            });
        setTimeout(() => onOpenModal(), 500);
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
            .catch((_) => {
                setAddProductError("Une erreur est survenue lors de l'ajout du produit");
            });
    }

    const addClothProduct = () => {
        if (addProductSize === "") {
            setAddProductError("Veuillez renseigner une taille pour le produit");
            return;
        }
        if (addProductGender === "") {
            setAddProductError("Veuillez renseigner un genre pour le produit");
            return;
        }
        createClothProduct(addProductName, addProductQuantity, addProductSize, addProductStorageId, addProductAmount, addProductGender)
            .then((_) => {
                onCloseAddProductModal();
                setLoadedAllProducts(false);
            })
            .catch((_) => {
                setAddProductError("Une erreur est survenue lors de l'ajout du produit");
            });
    }

    const modifyProduct = () => {
        setUpdatedProductError("");
        if (updatedProductName === "") {
            setUpdatedProductError("Veuillez renseigner un nom pour le produit");
            return;
        }
        if (updatedProductStorageId === "") {
            setUpdatedProductError("Veuillez renseigner un espace de stockage pour le produit");
            return;
        }
        if (selectedProductType === "food") {
            modifyFoodProduct();
        }
        if (selectedProductType === "cloth") {
            modifyClothProduct();
        }
    }

    const modifyFoodProduct = () => {
        if (updatedProductUnit === "") {
            setUpdatedProductError("Veuillez renseigner une unité pour le produit");
            return;
        }
        if (updatedProductConservation === "") {
            setUpdatedProductConservation("Veuillez renseigner une conservation pour le produit");
            return;
        }
        let expirationDate;
        try {
            const [years, month, days] = updatedProductExpirationDate.split("-");
            expirationDate = new Date(parseInt(years), parseInt(month) - 1, parseInt(days));
        } catch (err) {
            setUpdatedProductError("Veuillez renseigner une date d'expiration valide pour le produit");
            return;
        }
        let optimalDate;
        try {
            const [years, month, days] = updatedProductOptimalDate.split("-");
            optimalDate = new Date(parseInt(years), parseInt(month) - 1, parseInt(days));
        } catch (err) {
            setUpdatedProductError("Veuillez renseigner une date optimale de consommation valide pour le produit");
            return;
        }
        updateFoodProduct(selectedProduct.id, updatedProductName, updatedProductQuantity, updatedProductUnit, updatedProductConservation, expirationDate, optimalDate, updatedProductPrice, updatedProductStorageId, updatedProductAmount)
            .then((_) => {
                onCloseUpdateProductModal();
                setLoadedAllProducts(false);
            })
            .catch((_) => {
                setUpdatedProductError("Une erreur est survenue lors de la modification du produit");
            });
    }

    const modifyClothProduct = () => {
        if (updatedProductSize === "") {
            setUpdatedProductError("Veuillez renseigner une taille pour le produit");
            return;
        }
        if (updatedProductGender === "") {
            setUpdatedProductError("Veuillez renseigner un genre pour le produit");
            return;
        }
        updateClothProduct(selectedProduct.id, updatedProductName, updatedProductQuantity, updatedProductSize, updatedProductStorageId, updatedProductAmount, updatedProductGender)
            .then((_) => {
                onCloseUpdateProductModal();
                setLoadedAllProducts(false);
            })
            .catch((_) => {
                setUpdatedProductError("Une erreur est survenue lors de la modification du produit");
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
            {!loadedGenders && loadGenders()}
            {!loadedAllProducts && loadProducts()}
            {callAddStockage && addStorage()}
            {callUpdateStockage && updateStorage()}
            {!loadedProductsByStorage && selectedStorage !== null && loadProductsFromStorage()}
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
                            Produits alimentaires
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
                                        <Badge colorScheme="teal" mr="4px">{foodStorageProduct.price / 100} €</Badge>
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
                                        <Badge colorScheme="teal" m="4px">{clothStorageProduct.size}</Badge>
                                        <Badge colorScheme="blue" mr="4px">{clothStorageProduct.gender}</Badge>
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
                        <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing="40px" mb="16px">
                            {storages.map((storage) => (
                                <Card key={storage.id}>
                                    <CardHeader>
                                        <Flex justify="space-between">
                                            <Text fontSize="xl">{storage.name}</Text>
                                            <Menu>
                                                <MenuButton>
                                                    <Icon as={FaCog} />
                                                </MenuButton>
                                                <MenuList>
                                                    <Flex direction="column">
                                                        <MenuItem onClick={() => selectStorageForModal(storage, onOpenViewStorageModal)}>
                                                            <Flex direction="row" p="12px">
                                                                <Icon as={FaEye} mr="8px" />
                                                                <Text fontSize="sm" fontWeight="semibold">Voir le contenu</Text>
                                                            </Flex>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => selectStorageForModal(storage, onOpenUpdateStorageModal)}>
                                                            <Flex direction="row" p="12px">
                                                                <Icon as={FaPencilAlt} mr="8px" />
                                                                <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                                                            </Flex>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => selectStorageForModal(storage, onOpenDeleteStorageModal)}>
                                                            <Flex direction="row" p="12px">
                                                                <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                                                                <Text color="red.500" fontSize="sm" fontWeight="semibold">Supprimer</Text>
                                                            </Flex>
                                                        </MenuItem>
                                                    </Flex>
                                                </MenuList>
                                            </Menu>
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        <Flex direction="row">
                                            <Flex direction="column" w="50%">
                                                <Text fontSize="sm">Quantité de produtis alimentaire: {allProducts.foods.filter(f => f.product.storageId === storage.id).reduce((acc, f) => acc + f.product.quantity, 0)}</Text>
                                                <Text fontSize="sm">Quantité de vêtements: {allProducts.clothes.filter(c => c.product.storageId === storage.id).reduce((acc, c) => acc + c.product.quantity, 0)}</Text>
                                            </Flex>
                                            <Flex direction="column" w="50%">
                                                <Text fontSize="sm" textAlign="end">{storage.address.city} - {storage.address.postalCode}</Text>
                                                <Text fontSize="sm" textAlign="end">{storage.address.streetNumberAndName}</Text>
                                            </Flex>
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
                            <Radio value="food" margin="8px 64px">Produit alimentaire</Radio>
                            <Radio value="cloth" margin="8px 64px">Vêtement</Radio>
                        </RadioGroup>
                        {(isNaN(addProductQuantity) || addProductQuantity <= 0) && setAddProductQuantity(1)}
                        {(isNaN(addProductPrice) || addProductPrice < 0) && setAddProductPrice(0)}
                        {(isNaN(addProductAmount) || addProductAmount <= 0) && setAddProductAmount(1)}
                        <FormControl>
                            {addProductType === "food" && (
                                <Flex justify="space-around">
                                    <Button onClick={openScannerModal} colorScheme="orange">Scanner un produit</Button>
                                </Flex>
                            )}
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
                                    <Text size="md" mt="8px" fontWeight="semibold">Genre du vêtement</Text>
                                    <Select placeholder="Genre du vêtement" value={addProductGender} onChange={(e) => setAddProductGender(e.target.value)}>
                                        {genders.map((size, key) => (
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
            <Modal isOpen={isOpenScannerModal} onClose={onCloseScannerModal} size="3xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Scanner un produit</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justify="space-around" maxH="480px" maxW="640px" overflow="hidden" m="auto">
                            <div id="scanner" ref={scannerRef} />
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closeScannerModal}>
                            Fermer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenUpdateProductModal} onClose={onCloseUpdateProductModal} size="lg" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier {selectedProduct?.product?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nom du produit</FormLabel>
                            <Input type="text" placeholder="Nom du produit" value={updatedProductName} onChange={(e) => setUpdatedProductName(e.target.value)}/>
                            <Text size="md" mt="8px" fontWeight="semibold">Espace de stockage</Text>
                            <Select placeholder="Espace de stockage" value={updatedProductStorageId} onChange={(e) => setUpdatedProductStorageId(e.target.value)}>
                                {storages.map((storage, key) => (
                                    <option key={key} value={storage.id}>{storage.name}</option>
                                ))}
                            </Select>
                            <Text size="md" mt="8px" fontWeight="semibold">Nombre d'exemplaire du produit perçu</Text>
                            <NumberInput defaultValue={1} min={1} max={2000000} value={updatedProductAmount} onChange={(e) => setUpdatedProductAmount(parseInt(e))}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Text size="md" mt="8px" fontWeight="semibold">Contenue du produit en quantité</Text>
                            <NumberInput defaultValue={1} min={1} max={2000000} value={updatedProductQuantity} onChange={(e) => setUpdatedProductQuantity(parseInt(e))}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {selectedProductType === "food" && (
                                <>
                                    <Text size="md" mt="8px" fontWeight="semibold">Unité de quantité du produit</Text>
                                    <RadioGroup value={updatedProductUnit} onChange={(e) => setUpdatedProductUnit(e)}>
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
                                    <RadioGroup value={updatedProductConservation} onChange={(e) => setUpdatedProductConservation(e)}>
                                        <Flex direction="row" justify="space-between">
                                            {conservations.map((conservation, key) => (
                                                <Radio key={key} value={conservation}>{conservation}</Radio>
                                            ))}
                                        </Flex>
                                    </RadioGroup>
                                    <Text size="md" mt="8px" fontWeight="semibold">Date de consommation optimale</Text>
                                    <Input type="date" value={updatedProductOptimalDate} onChange={(e) => setUpdatedProductOptimalDate(e.target.value)} />
                                    <Text size="md" mt="8px" fontWeight="semibold">Date de péremption</Text>
                                    <Input type="date" value={updatedProductExpirationDate} onChange={(e) => setUpdatedProductExpirationDate(e.target.value)} />
                                    <Text size="md" mt="8px" fontWeight="semibold">Prix en centimes</Text>
                                    <NumberInput defaultValue={1} min={0} max={2000000} value={updatedProductPrice} onChange={(e) => setUpdatedProductPrice(parseInt(e))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </>
                            )}
                            {selectedProductType === "cloth" && (
                                <>
                                    <Text size="md" mt="8px" fontWeight="semibold">Taille du vêtement</Text>
                                    <Select placeholder="Taille du vêtement" value={updatedProductSize} onChange={(e) => setUpdatedProductSize(e.target.value)}>
                                        {sizes.map((size, key) => (
                                            <option key={key} value={size}>{size}</option>
                                        ))}
                                    </Select>
                                    <Text size="md" mt="8px" fontWeight="semibold">Genre du vêtement</Text>
                                    <Select placeholder="Genre du vêtement" value={updatedProductGender} onChange={(e) => setUpdatedProductGender(e.target.value)}>
                                        {genders.map((size, key) => (
                                            <option key={key} value={size}>{size}</option>
                                        ))}
                                    </Select>
                                </>
                            )}
                        </FormControl>
                        {updatedProductError !== "" && (
                            <Text color="red">{updatedProductError}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseUpdateProductModal}>
                            Fermer
                        </Button>
                        <Button colorScheme="green" mr={3} onClick={() => modifyProduct()}>
                            Modifier
                        </Button>
                    </ModalFooter>
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
                            <Select placeholder="Sélectionnez une ville" value={storageCity} onChange={(e) => setStorageCity(e.target.value)}>
                                {addStorageCityList.map((city, index) => {
                                    return (
                                        <option key={index} value={city}>{city}</option>
                                    );
                                })}
                            </Select>
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
                                <Text fontWeight="bold" fontSize="lg">{selectedStorage.name}</Text>
                                <Text>{selectedStorage.address.city} - {selectedStorage.address.postalCode}</Text>
                                <Text>{departments.filter(d => d.code === selectedStorage.address.departmentCode)[0].name} ({selectedStorage.address.departmentCode})</Text>
                                <Text>{selectedStorage.address.streetNumberAndName}</Text>
                                <Text fontSize="xl" fontWeight="semibold">
                                    Produits alimentaires
                                </Text>
                                <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                    {selectedStorageProducts.foods.map((foodStorageProduct, key) => (
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
                                                <Badge colorScheme="teal" mr="4px">{foodStorageProduct.price / 100} €</Badge>
                                                <Badge colorScheme="purple">{foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Badge>
                                            </CardBody>
                                        </Card>
                                    ))}
                                    {selectedStorageProducts.foods.length === 0 && (
                                        <Text>Aucun produit en stock</Text>
                                    )}
                                </SimpleGrid>
                                <Text fontSize="xl" mt="16px" fontWeight="semibold">
                                    Vêtements
                                </Text>
                                <SimpleGrid columns={{ sm: 2, md: 3, lg: 3, xl: 4 }} spacing="24px" m="12px">
                                    {selectedStorageProducts.clothes.map((clothStorageProduct, key) => (
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
                                                <Badge colorScheme="teal" m="4px">{clothStorageProduct.size}</Badge>
                                                <Badge colorScheme="blue" mr="4px">{clothStorageProduct.gender}</Badge>
                                                <Badge colorScheme="purple">{clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Badge>
                                            </CardBody>
                                        </Card>
                                    ))}
                                    {selectedStorageProducts.clothes.length === 0 && (
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
            <Modal isOpen={isOpenUpdateStorageModal} onClose={onCloseUpdateStorageModal} size="xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier un espace de stockage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nom de l'espace de stockage</FormLabel>
                            <Input type="text" placeholder="Nom de l'espace de stockage" value={updatedStorageName} onChange={(e) => setUpdatedStorageName(e.target.value)}/>
                            <Text size="md" mt="8px" fontWeight="semibold">Emplacement de l'espace de stockage</Text>
                            <FormLabel>Département</FormLabel>
                            <Select placeholder="Sélectionnez un département" value={updatedStorageDepartment} onChange={(e) => setUpdatedStorageDepartment(e.target.value)}>
                                {departments.map((department, index) => {
                                    return (
                                        <option key={index} value={index}>{department.code} - {department.name}</option>
                                    );
                                })}
                            </Select>
                            <FormLabel>Code postale</FormLabel>
                            <Input type="text" placeholder="Code postale" value={updatedStoragePostalCode} onChange={(e) => setUpdatedStoragePostalCode(e.target.value)}/>
                            <FormLabel>Ville</FormLabel>
                            <Select placeholder="Sélectionnez une ville" value={updatedStorageCity} onChange={(e) => setUpdatedStorageCity(e.target.value)}>
                                {addStorageCityList.map((city, index) => {
                                    return (
                                        <option key={index} value={city}>{city}</option>
                                    );
                                })}
                            </Select>
                            <FormLabel>Adresse</FormLabel>
                            <Input type="text" placeholder="Adresse" value={updatedStorageAddress} onChange={(e) => setUpdatedStorageAddress(e.target.value)}/>
                        </FormControl>
                        {errorUpdatingStorage !== "" && (
                            <Text color="red" mt="8px">{errorUpdatingStorage}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseUpdateStorageModal}>
                            Annuler
                        </Button>
                        <Button variant="outline" colorScheme="green" onClick={() => setCallUpdateStockage(true)} isDisabled={createEventLoading}>
                            Ajouter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDeleteStorageModal} onClose={onCloseDeleteStorageModal} size="3xl" scrollBehavior="outside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Supprimer un espace de stockage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            {selectedStorage !== null && selectedStorageProducts.foods.length === 0 && selectedStorageProducts.clothes.length === 0 && (
                                <Text>Etes-vous sur de vouloir supprimer {selectedStorage?.name} ?</Text>
                            )}
                            {selectedStorage !== null && (selectedStorageProducts.foods.length > 0 || selectedStorageProducts.clothes.length > 0) && (
                                <Text fontWeight="semibold" color="red">Vous ne pouvez pas supprimer {selectedStorage?.name} car il contient les produits suivants: </Text>
                            )}
                            {selectedStorageProducts.foods.length > 0 && (
                                <Flex direction="column">
                                    <Text mt="16px" fontWeight="semibold">
                                        Produits alimentaires
                                    </Text>
                                    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing="24px" m="12px 2px">
                                        {selectedStorageProducts.foods.map((foodStorageProduct, key) => (
                                            <Card key={key}>
                                                <Flex direction="row" justify="space-between">
                                                    <Text fontSize="sm" mr="4px">{foodStorageProduct.product.name}</Text>
                                                    <Badge colorScheme="purple" m="auto 0 auto auto">{foodStorageProduct.product.quantity * foodStorageProduct.product.quantityQuantifier} {foodStorageProduct.product.quantifierName}</Badge>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </Flex>
                            )}
                            {selectedStorageProducts.clothes.length > 0 && (
                                <Flex direction="column">
                                    <Text mt="16px" fontWeight="semibold">
                                        Vêtements
                                    </Text>
                                    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2, xl: 3 }} spacing="24px" m="12px 2px">
                                        {selectedStorageProducts.clothes.map((clothStorageProduct, key) => (
                                            <Card key={key}>
                                                <Flex direction="row" justify="space-between">
                                                    <Text fontSize="sm" mr="4px">{clothStorageProduct.product.name}</Text>
                                                    <Badge colorScheme="purple" m="auto 0 auto auto">{clothStorageProduct.product.quantity * clothStorageProduct.product.quantityQuantifier} {clothStorageProduct.product.quantifierName}</Badge>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </Flex>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseDeleteStorageModal}>
                            Annuler
                        </Button>
                        <Button colorScheme="red" variant="outline" mr={3} onClick={() => deleteStorage()} disabled={selectedStorageProducts.foods.length > 0 || selectedStorageProducts.clothes.length > 0}>
                            Supprimer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
