import React, {useContext, useEffect, useState} from "react";
import {
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
    Text, VStack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import {getAllProducts} from "../../../controller/StorageController";
import {ProductList} from "../../../model/stock/ProductList";
import {
    addProductToBeneficiary,
    getAllBeneficiaryProductQuantity
} from "../../../controller/BeneficiaryProductController";
import {BeneficiaryAddProductRequestDTO} from "../../../model/Beneficiaries/BeneficiaryAddProductRequestDTO";
import {BeneficiaryProductCounterResponse} from "../../../model/Beneficiaries/BeneficiaryProductCounterResponse";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";

export default function BeneficiaryProduct(props) {

    const {localUnit} = useContext(LocalUnitContext);
    if (localUnit === undefined || localUnit.id === undefined || props.beneficiary === undefined || props.beneficiary.id === undefined) {
        return null;
    }

    const [periode, setPeriode] = useState(7);

    const [loadedBeneficiaryProducts, setLoadedBeneficiaryProducts] = useState(false);
    const [loadingBeneficiaryProducts, setLoadingBeneficiaryProducts] = useState(false);
    const [beneficiaryProducts, setBeneficiaryProducts] = useState(new BeneficiaryProductCounterResponse(new Map(), new Map()));

    const [loadedProducts, setLoadedProducts] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [products, setProducts] = useState(new ProductList([], []));

    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(undefined);

    const [addingProduct, setAddingProduct] = useState(false);

    useEffect(() => {
        setLoadedBeneficiaryProducts(false);
    }, [props.beneficiary]);

    if (!loadedProducts && !loadingProducts) {
        setLoadingProducts(true);
        getAllProducts().then((res) => {
            setProducts(res);
            setLoadedProducts(true);
            setLoadingProducts(false);
        }).catch((err) => {
            setLoadedProducts(false);
            setLoadingProducts(false);
        });
    }

    if (!loadedBeneficiaryProducts && !loadingBeneficiaryProducts) {
        setLoadingBeneficiaryProducts(true);
        const currentDate = new Date();
        getAllBeneficiaryProductQuantity(props.beneficiary.id, new Date().setDate(currentDate.getDate() - periode), currentDate)
            .then((res) => {
                setBeneficiaryProducts(res);
                setLoadingBeneficiaryProducts(false);
                setLoadedBeneficiaryProducts(true);
            }).catch((err) => {
            console.log(err)
            setLoadedBeneficiaryProducts(false);
            setLoadingBeneficiaryProducts(false);
        });
    }

    const onProductChange = (e) => {
        const foodProduct = products.foods.find((foodStorageProduct) => foodStorageProduct.product.storageProductId == e.target.value);
        if (foodProduct !== undefined) {
            setSelectedProduct(foodProduct);
        } else {
            const clothProduct = products.clothes.find((clothStorageProduct) => clothStorageProduct.product.storageProductId == e.target.value);
            if (clothProduct !== undefined) {
                setSelectedProduct(clothProduct);
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
        }).catch((err) => {
            console.log(err);
            setAddingProduct(false);
        });
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" scrollBehavior="outside">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader></ModalHeader>
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
                                            <option
                                                value={clothStorageProduct.product.storageProductId}> {clothStorageProduct.product.name + ' ' + clothStorageProduct.size} </option>
                                        );
                                    })}
                                </Select>
                            </Skeleton>
                            <Spacer></Spacer>
                            <FormLabel>Quantitée</FormLabel>
                            <NumberInput value={quantity} onChange={setQuantity} isInvalid={quantity == 0}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                        </SimpleGrid>
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
                                {Array.from(beneficiaryProducts).map(([key, value]) => {
                                    return (
                                        <WrapItem>
                                            <Card>
                                                <CardHeader>
                                                    <Text fontWeight="semibold">{key}</Text>
                                                </CardHeader>
                                                {value.value + ' ' + value.measurementUnit}
                                            </Card>
                                        </WrapItem>
                                    )
                                })}
                            </Wrap>
                        </Skeleton>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Text color={'red'}></Text>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        fermer
                    </Button>
                    <Button isLoading={addingProduct} colorScheme="blue" mr={3} onClick={onOK}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
