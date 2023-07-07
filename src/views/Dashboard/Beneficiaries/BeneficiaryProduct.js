import React, {useContext, useEffect, useState} from "react";
import {
    Badge,
    Button,
    FormLabel,
    HStack,
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
    Select,
    SimpleGrid,
    Skeleton,
    Spacer,
    Text, useToast, VStack,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import {getAllProducts} from "../../../controller/StorageController";
import {ProductList} from "../../../model/stock/ProductList";
import {
    addProductToBeneficiary,
    getAllBeneficiaryProductQuantity
} from "../../../controller/BeneficiaryProductController";
import {BeneficiaryAddProductRequestDTO} from "../../../model/Beneficiaries/BeneficiaryAddProductRequestDTO";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";

export default function BeneficiaryProduct(props) {

    const {localUnit} = useContext(LocalUnitContext);
    if (localUnit === undefined || localUnit.id === undefined ||
        props.beneficiary === undefined || props.beneficiary.id === undefined) {
        return null;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    });

    const [periode, setPeriode] = useState(7);

    const [loadedBeneficiaryProducts, setLoadedBeneficiaryProducts] = useState(false);
    const [loadingBeneficiaryProducts, setLoadingBeneficiaryProducts] = useState(false);
    const [beneficiaryProducts, setBeneficiaryProducts] = useState([]);

    const [loadedProducts, setLoadedProducts] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [products, setProducts] = useState(new ProductList([], []));

    const [productLimits, setProductLimits] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(undefined);
    const [selectedProductLimit, setSelectedProductLimit] = useState(undefined);

    const [addingProduct, setAddingProduct] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setLoadedBeneficiaryProducts(false);
    }, [props.beneficiary]);

    if (!loadedProducts && !loadingProducts) {
        setLoadingProducts(true);
        getAllProducts().then((res) => {
            setProducts(res);
            for (const temp of res.foods) {
                if (temp.product.productLimit === undefined) {
                    continue;
                }
                if (productLimits.find((item) => item.id === temp.product.productLimit.id) !== undefined) {
                    continue;
                }
                productLimits.push({...temp.product.productLimit, currentQuantity: 0});
            }

            for (const temp of res.clothes) {
                if (temp.product.productLimit === undefined) {
                    continue;
                }
                if (productLimits.find((item) => item.id === temp.product.productLimit.id) !== undefined) {
                    continue;
                }
                productLimits.push({...temp.product.productLimit, currentQuantity: 0});
            }

            setLoadedProducts(true);
            setLoadingProducts(false);
        }).catch((err) => {
            setLoadedProducts(false);
            setLoadingProducts(false);
            toast({
                title: "Erreur",
                description: "Echec du chargement des produits.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const isSameProduct = (productId1, productId2) => {
        let product1 = products.foods.find((product) => product.product.productId === productId1);
        if (product1 !== undefined) {
            let product2 = products.foods.find((product) => product.product.productId === productId2);
            if (product2 === undefined) {
                return false;
            }
            return product1.product.name === product2.product.name;
        }
        product1 = products.clothes.find((product) => product.product.productId === productId1);
        if (product1 !== undefined) {
            let product2 = products.clothes.find((product) => product.product.productId === productId2);
            if (product2 === undefined) {
                return false;
            }
            return product1.product.name === product2.product.name;
        }
        return false;
    }

    if (!loadedBeneficiaryProducts && !loadingBeneficiaryProducts) {
        setLoadingBeneficiaryProducts(true);
        const currentDate = new Date();

        for (const temp of productLimits) {
            temp.currentQuantity = 0;
        }

        getAllBeneficiaryProductQuantity(props.beneficiary.id, new Date().setDate(currentDate.getDate() - periode), currentDate)
            .then((res) => {
                res = res.filter((beneficiaryProductResponse) => beneficiaryProductResponse.quantity !== 0);

                for (const temp of res) {
                    if (temp.productLimitId === undefined) {
                        continue;
                    }

                    const productLimit = productLimits.find((item) => item.id === temp.productLimitId);
                    if (productLimit === undefined) {
                        continue;
                    }
                    const startDate = new Date().setDate(new Date().getDate() - productLimit.duration);
                    if (new Date(temp.date).getTime() < startDate) {
                        continue;
                    }

                    let product = products.foods.find((item) => item.product.productId === temp.productId);
                    if (product === undefined) {
                        product = products.clothes.find((item) => item.product.productId === temp.productId);
                        if (product === undefined) {
                            continue;
                        }
                        productLimit.currentQuantity += Number(product.product.quantityQuantifier) * temp.quantity;
                    } else {
                        if (product.product.quantifierName === "kilogram") {
                            productLimit.currentQuantity += Number(product.product.quantityQuantifier) * temp.quantity;
                        } else {
                            productLimit.currentQuantity += Number(product.product.quantityQuantifier) / 1000 * temp.quantity;
                        }
                    }
                }

                const list = []
                for (const temp of res) {
                    if (list.find((item) => item.productId === temp.productId) !== undefined) {
                        continue;
                    }
                    let dup = res.filter((item) => isSameProduct(item.productId, temp.productId));
                    if (dup.length === 0) {
                        continue;
                    }
                    const quantity = dup.reduce((acc, item) => acc + item.quantity, 0);
                    list.push({...dup[0], quantity: quantity});
                    res = res.filter((item) => !isSameProduct(item.productId, temp.productId));
                }
                setBeneficiaryProducts(list);
                setLoadingBeneficiaryProducts(false);
                setLoadedBeneficiaryProducts(true);
            }).catch((err) => {
            console.log(err)
            setLoadedBeneficiaryProducts(false);
            setLoadingBeneficiaryProducts(false);
            toast({
                title: "Erreur",
                description: "Echec du chargement des produits du bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const onProductChange = (e) => {
        const foodProduct = products.foods.find((foodStorageProduct) => foodStorageProduct.product.storageProductId == e.target.value);
        if (foodProduct !== undefined) {
            setSelectedProduct(foodProduct);
            setSelectedProductLimit(foodProduct.product.productLimit);
        } else {
            const clothProduct = products.clothes.find((clothStorageProduct) => clothStorageProduct.product.storageProductId == e.target.value);
            if (clothProduct !== undefined) {
                setSelectedProduct(clothProduct);
                setSelectedProductLimit(clothProduct.product.productLimit);
            } else {
                setSelectedProduct(undefined);
            }
        }
    }

    const onPeriodeChange = (e) => {
        setPeriode(e);
        setLoadedBeneficiaryProducts(false);
    }

    const onOK = () => {
        if (selectedProduct === undefined || quantity === undefined || quantity === 0) {
            return;
        }

        setAddingProduct(true);
        const dto = new BeneficiaryAddProductRequestDTO(props.beneficiary.id, selectedProduct.product.storageProductId, quantity, new Date());
        addProductToBeneficiary(dto).then((res) => {
            setLoadedBeneficiaryProducts(false);
            setAddingProduct(false);
            props.beneficiary.solde -= selectedProduct.price * quantity;
        }).catch((err) => {
            console.log(err);
            setAddingProduct(false);
            toast({
                title: "Erreur",
                description: "Echec de l'ajout du produit au bénéficiare.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const getProductLimitCards = (productLimitId) => {
        const productLimit = productLimits.find((item) => item.id === productLimitId);
        if (productLimit === undefined) {
            return <Text> Not Found </Text>;
        }
        return (
            <Card>
                <CardHeader>
                    <Text fontWeight="semibold">Limitation {productLimit.name}</Text>
                </CardHeader>
                <CardBody>
                    <Text> {productLimit.currentQuantity + '/' + productLimit.quantity.value + productLimit.quantity.measurementUnit} </Text>
                </CardBody>
            </Card>
        )
    }

    const getBeneficiaryFoodProductCards = (foodProduct, quantity) => {
        const productLimit = productLimits.find((item) => item.id === foodProduct.product.productLimit.id);
        if (productLimit === undefined) {
            return <Text> Not Found </Text>;
        }

        return (
            <WrapItem key={foodProduct.product.productId}>
                <Card>
                    <CardHeader>
                        <Text fontWeight="semibold">{foodProduct.product.name}</Text>
                    </CardHeader>
                    <CardBody>
                        <HStack>
                            <Text> Total {Number(foodProduct.product.quantityQuantifier) * quantity} {foodProduct.product.quantifierName}</Text>
                            <VStack>
                                <Text fontWeight="semibold">Limitation {productLimit.name}</Text>
                                <Text
                                    color={productLimit.currentQuantity >= productLimit.quantity.value ? 'red' : 'black'}> {productLimit.currentQuantity + ' / ' + productLimit.quantity.value + productLimit.quantity.measurementUnit} </Text>
                                <Text> {'tous les ' + productLimit.duration + ' jours'} </Text>
                            </VStack>
                        </HStack>
                    </CardBody>
                    <Badge colorScheme="orange" mr="4px">Alimentaires</Badge>

                </Card>
            </WrapItem>
        )
    }

    const getBeneficiaryClothProductCards = (clothProduct, quantity) => {
        const productLimit = productLimits.find((item) => item.id === clothProduct.product.productLimit.id);
        if (productLimit === undefined) {
            return <Text> Not Found </Text>;
        }

        return (
            <WrapItem key={clothProduct.product.productId}>
                <Card>
                    <CardHeader>
                        <Text fontWeight="semibold">{clothProduct.product.name}</Text>
                    </CardHeader>
                    <CardBody>
                        <HStack>
                            <Text> Total {Number(clothProduct.product.quantityQuantifier) * quantity} {clothProduct.product.quantifierName}</Text>
                            <VStack>
                                <Text fontWeight="semibold">Limitation {productLimit.name}</Text>
                                <Text
                                    color={productLimit.currentQuantity >= productLimit.quantity.value ? 'red' : 'black'}> {productLimit.currentQuantity + ' / ' + productLimit.quantity.value + productLimit.quantity.measurementUnit} </Text>
                                <Text> {'tous les ' + productLimit.duration + ' jours'} </Text>
                            </VStack>
                        </HStack>
                    </CardBody>
                    <Badge colorScheme="blue" mr="4px">Vetements</Badge>
                </Card>
            </WrapItem>
        )
    }

    const getBeneficiaryProductCard = (beneficiaryProductResponse) => {
        let product = products.foods.find((foodStorageProduct) => foodStorageProduct.product.productId == beneficiaryProductResponse.productId);
        if (product !== undefined) {
            return getBeneficiaryFoodProductCards(product, beneficiaryProductResponse.quantity);
        }

        product = products.clothes.find((clothStorageProduct) => clothStorageProduct.product.productId == beneficiaryProductResponse.productId);
        if (product !== undefined) {
            return getBeneficiaryClothProductCards(product, beneficiaryProductResponse.quantity);
        }

        return null;
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <HStack>
                        <Text>Produits de {props.beneficiary.firstName + ' ' + props.beneficiary.lastName}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <VStack align={'stretch'}>
                        <SimpleGrid columns={2} spacing={5}>
                            <Skeleton isLoaded={loadedProducts}>
                                <Select placeholder='Select option' onChange={onProductChange}
                                        isInvalid={selectedProduct === undefined}>
                                    {products.foods.map((foodStorageProduct) => {
                                        return (
                                            <option
                                                value={foodStorageProduct.product.storageProductId}> {foodStorageProduct.product.name + ' ' + foodStorageProduct.product.quantityQuantifier + ' ' + foodStorageProduct.product.quantifierName
                                                + ' DLC: ' + foodStorageProduct.expirationDate.toLocaleDateString("fr") + ' DLUO: ' + foodStorageProduct.optimalConsumptionDate.toLocaleDateString("fr")

                                            } </option>
                                        );
                                    })}
                                    {products.clothes.map((clothStorageProduct) => {
                                        return (
                                            <option value={clothStorageProduct.product.storageProductId}>
                                                {clothStorageProduct.product.name + ' ' + clothStorageProduct.size + ' ' + clothStorageProduct.product.quantityQuantifier + clothStorageProduct.product.quantifierName}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </Skeleton>
                            <HStack>
                                {selectedProductLimit !== undefined && <>
                                    <Text fontWeight="semibold">Limite </Text>
                                    <Text>{selectedProductLimit.name} : {selectedProductLimit.quantity.value} {selectedProductLimit.quantity.measurementUnit} tout les {selectedProductLimit.duration} jours </Text>
                                </>}
                            </HStack>
                            <FormLabel>Quantitée</FormLabel>
                            <NumberInput value={quantity} onChange={setQuantity} isInvalid={quantity == 0}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                        </SimpleGrid>
                        <HStack align={'stretch'}>
                            {selectedProduct !== undefined &&
                                <>
                                    <Text fontWeight="semibold">Budget restant</Text>
                                    <Text> {formatter.format(props.beneficiary.solde / 100)}</Text>
                                    <Text fontWeight="semibold">Budget après</Text>
                                    <Text color={props.beneficiary.solde - selectedProduct.price * quantity <= 0? 'red' : 'black'} > {formatter.format((props.beneficiary.solde - selectedProduct.price * quantity) / 100)}</Text>
                                </>
                            }
                            <Spacer></Spacer>
                            <Button isLoading={addingProduct} colorScheme="blue" mr={3} onClick={onOK}>
                                Ajouter
                            </Button>
                        </HStack>
                        <HStack>
                            <Text fontWeight="semibold">Produits déjà pris</Text>
                            <Spacer></Spacer>
                            <Text> sur les </Text>
                            <NumberInput value={periode} onChange={onPeriodeChange}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                            <Text> dernier jour </Text>
                        </HStack>
                        <Skeleton isLoaded={loadedBeneficiaryProducts}>
                            <Wrap>
                                {beneficiaryProducts.map((value) => {
                                    return getBeneficiaryProductCard(value);
                                })}
                            </Wrap>
                        </Skeleton>
                    </VStack>

                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        fermer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
