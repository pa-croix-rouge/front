import React, {useContext, useEffect, useState} from "react";
import {
    Badge,
    Button,
    Flex,
    FormLabel,
    Input,
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
    SimpleGrid, Skeleton, Spacer,
    Text, useToast, Wrap, WrapItem,
} from "@chakra-ui/react";
import {ProductLimit} from "../../../model/ProductLimit";
import {
    createProductLimit,
    getAllProductLimitProducts,
    updateProductLimit
} from "../../../controller/ProductLimitsController";
import {Quantifier} from "../../../model/Quantifier";
import ProductLimitsContext from "../../../contexts/ProductLimitsContext";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";

export default function ProductLimitModal(props) {
    const {productLimits, setEvents, reloadProductLimits} = useContext(ProductLimitsContext);
    const [productLimit, setProductLimit] = useState(props.productLimit);

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(undefined);

    const [loadedProducts, setLoadedProducts] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [products, setProducts] = useState({first:[], second: []});
    const toast = useToast();

    useEffect(() => {
        setProducts({first:[], second: []});
        setLoadedProducts(false);
        if (props.productLimit === undefined && props.edit === true) {
            setProductLimit(new ProductLimit(undefined, '', 1, new Quantifier('', 1)));
        } else {
            setProductLimit(props.productLimit);
        }
    }, [props.productLimit]);

    if (productLimit === undefined || productLimit === null) {
        return null;
    }

    if (loadedProducts === false && loadingProducts === false && productLimit.id !== undefined) {
        setLoadingProducts(true);
        getAllProductLimitProducts(productLimit.id).then((products) => {
            setProducts(products);
            setLoadedProducts(true);
            setLoadingProducts(false);
        }).catch((error) => {
            console.log(error);
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

    const getModalTitle = () => {
        if (props.edit === true) {
            if (props.productLimit === undefined) {
                return "Ajouter une nouvelle limit sur un produit";
            } else {
                return "Modifier une limite sur un produit";
            }
        } else {
            return "Limit de produit";
        }
    }

    const closeModal = () => {
        setError(undefined);
        props.onClose();
    }

    const onOK = () => {
        if (props.edit === false) {
            props.onClose();
            return;
        }

        if (inProgress) {
            return;
        }

        if (props.productLimit === undefined) {
            setInProgress(true);
            createProductLimit(productLimit).then((productLimit) => {
                reloadProductLimits();
                setInProgress(false);
                closeModal();
            }).catch((error) => {
                const errorString = error.toString();
                setError(errorString);
                setInProgress(false);
                toast({
                    title: "Erreur",
                    description: "Echec de la création de la limite de produit.",
                    status: "error",
                    duration: 10_000,
                    isClosable: true
                });
            });
        } else {
            setInProgress(true);
            updateProductLimit(productLimit).then((productLimit) => {
                reloadProductLimits();
                setInProgress(false);
                closeModal();
            }).catch((error) => {
                const errorString = error.toString();
                setError(errorString);
                setInProgress(false);
                toast({
                    title: "Erreur",
                    description: "Echec de la mise à jours de la limite de produit.",
                    status: "error",
                    duration: 10_000,
                    isClosable: true
                });
            });
        }
    }

    const convertDate = (date) => {
        const startDateParts = date.split(/[\-\+:\[\]]/);
        const yearStartDate = parseInt(startDateParts[0]);
        const monthStartDate = parseInt(startDateParts[1]) - 1;
        const dayStartDate = parseInt(startDateParts[2].split("T")[0]);
        const hourStartDate = parseInt(startDateParts[2].split("T")[1]);
        const minuteStartDate = parseInt(startDateParts[3]);
        const timeZoneOffsetStartDate = parseInt(startDateParts[4]);
        return new Date(Date.UTC(yearStartDate, monthStartDate, dayStartDate, hourStartDate, minuteStartDate) - timeZoneOffsetStartDate * 60 * 60 * 1000);
    }

    const getDateColor = (dateStr) => {
        const date = convertDate(dateStr);

        if (date.getTime() < Date.now()) {
            return 'red';
        } else if (date.getTime() < (new Date().getTime() + (14 * 24 * 60 * 60 * 1000))) {
            return 'orange';
        } else {
            return 'green';
        }
    }

    const getClothProductCard = (clothProduct) => {
        return (
            <Card key={clothProduct.productId}>
                <CardHeader>
                    <Flex direction="row" justify="space-between">
                        <Text m="auto 0">{clothProduct.name}</Text>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Text>{clothProduct.quantity.value} {clothProduct.quantity.quantityQuantifier} </Text>
                    <Badge colorScheme="teal" m="4px">{clothProduct.size}</Badge>
                    <Badge colorScheme="blue" mr="4px">{clothProduct.gender}</Badge>
                </CardBody>
            </Card>
        );
    }

    const getFoodProductCard = (foodProduct) => {
        return (
            <Card key={foodProduct.productId}>
                <CardHeader>
                    <Text m="auto 0">{foodProduct.name}</Text>
                </CardHeader>
                <CardBody>
                    <Text>{foodProduct.quantity.value} {foodProduct.quantity.measurementUnit} </Text>
                    <Badge m="2px"
                           colorScheme={getDateColor(foodProduct.expirationDate)}>DLC {convertDate(foodProduct.expirationDate).toLocaleDateString()}</Badge>
                    <Badge m="2px"
                           colorScheme={getDateColor(foodProduct.optimalConsumptionDate)}>DLUO {convertDate(foodProduct.optimalConsumptionDate).toLocaleDateString()}</Badge>
                    <Badge colorScheme="teal" mr="4px">{foodProduct.price / 100} €</Badge>
                    <Badge colorScheme="cyan" mr="4px">{foodProduct.conservation}</Badge>
                </CardBody>
            </Card>
        )
    }

    const isFormValid = () => {

        return productLimit.name.length > 0 && productLimit.quantity.measurementUnit.length > 0;
    }

    return (
        <Modal isOpen={props.isOpen} onClose={closeModal} size="6xl" scrollBehavior="outside">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{getModalTitle()}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <SimpleGrid columns={2} spacing={5}>
                        <FormLabel fontWeight="semibold">Name</FormLabel>
                        <Input type="text" placeholder="Name" value={productLimit.name} disabled={!props.edit}
                               isInvalid={productLimit.name.length <= 0}
                               onChange={(e) => setProductLimit({...productLimit, name: e.target.value})}/>

                        <FormLabel fontWeight="semibold">Nombre de jours</FormLabel>

                        <NumberInput defaultValue={1} min={1} value={productLimit.duration} disabled={!props.edit}
                                     onChange={(e) => setProductLimit({...productLimit, duration: e})}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>

                        <Text size="md" mt="8px" fontWeight="semibold">Quantité</Text>
                        <NumberInput defaultValue={1} min={1} max={2000000} value={productLimit.quantity.value}
                                     disabled={!props.edit}
                                     onChange={(e) => setProductLimit({
                                         ...productLimit,
                                         quantity: {...productLimit.quantity, value: e}
                                     })}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        <Text size="md" mt="8px" fontWeight="semibold">Unité </Text>
                        <RadioGroup value={productLimit.quantity.measurementUnit} disabled={!props.edit}
                                    onChange={(e) => setProductLimit({
                                        ...productLimit,
                                        quantity: {...productLimit.quantity, measurementUnit: e}
                                    })}>
                            <Flex direction="row" justify="space-between">
                                {!props.canReadProduct && (
                                    <Text>Vous n'avez pas les droits</Text>
                                )}
                                {props.units.map((unit, key) => (
                                    <Flex direction="column" key={key}>
                                        <Text>{unit.label}</Text>
                                        {unit.units.map((unitName, keyRadio) => (
                                            <div key={keyRadio}>
                                                {unitName !== "" && (
                                                    <Radio value={unitName} disabled={!props.edit}
                                                           isInvalid={productLimit.quantity.measurementUnit.length <= 0}> {unitName}</Radio>
                                                )}
                                            </div>
                                        ))}
                                    </Flex>
                                ))}
                            </Flex>
                        </RadioGroup>
                    </SimpleGrid>
                    <Text size="md" mt="8px" fontWeight="semibold">Produits limités</Text>
                    <Skeleton isLoaded={loadedProducts}>
                        <Wrap>
                            {products.first.map((product, key) => (
                                <WrapItem key={key}>
                                    {getFoodProductCard(product)}
                                </WrapItem>
                            ))}
                            {products.second.map((product, key) => (
                                <WrapItem key={key}>
                                    {getClothProductCard(product)}
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Skeleton>
                </ModalBody>
                <ModalFooter>
                    <Text color={'red'}>
                        {error}
                    </Text>
                    <Spacer/>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>
                        Annuler
                    </Button>
                    <Button colorScheme="green" variant="outline" mr={3} isLoading={inProgress} isDisabled={!isFormValid()} onClick={onOK}>
                        Confirmer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
