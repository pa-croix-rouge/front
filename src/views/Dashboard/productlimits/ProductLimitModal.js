import React, {useContext, useEffect, useState} from "react";
import {
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
    SimpleGrid, Spacer,
    Text,
} from "@chakra-ui/react";
import {ProductLimit} from "../../../model/ProductLimit";
import {createProductLimit, updateProductLimit} from "../../../controller/ProductLimitsController";
import {Quantifier} from "../../../model/Quantifier";
import ProductLimitsContext from "../../../contexts/ProductLimitsContext";


export default function ProductLimitModal(props) {
    const {productLimits, setEvents, reloadProductLimits} = useContext(ProductLimitsContext);
    const [productLimit, setProductLimit] = useState(props.productLimit);

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        if (props.productLimit === undefined && props.edit === true) {
            setProductLimit(new ProductLimit(undefined, '', 1, new Quantifier('', 1)));
        } else {
            setProductLimit(props.productLimit);
        }
    }, [props.productLimit]);

    if (productLimit === undefined || productLimit === null) {
        return null;
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
        console.log('onOK')
        if (props.edit === false) {
            props.onClose();
            return;
        }

        if(inProgress) {
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
            });
        }

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
                        <Input type="text" placeholder="Name" value={productLimit.name} disabled={!props.edit} isInvalid={productLimit.name.length <= 0}
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
                                {props.units.map((unit, key) => (
                                    <Flex direction="column" key={key}>
                                        <Text>{unit.label}</Text>
                                        {unit.units.map((unitName, keyRadio) => (
                                            <div key={keyRadio}>
                                                {unitName !== "" && (
                                                    <Radio value={unitName} disabled={!props.edit} isInvalid={productLimit.quantity.measurementUnit.length <= 0}> {unitName}</Radio>
                                                )}
                                            </div>
                                        ))}
                                    </Flex>
                                ))}
                            </Flex>
                        </RadioGroup>
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                    <Text color={'red'} >
                        {error}
                    </Text>
                    <Spacer/>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>
                        Annuler
                    </Button>
                    <Button colorScheme="blue" mr={3} isLoading={inProgress}
                            onClick={onOK}>
                        Confirmer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
