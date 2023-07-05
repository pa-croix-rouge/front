import React, {createContext, useContext, useState} from "react";
import {
    Button,
    Center,
    CircularProgress,
    Flex, HStack, Icon,
    Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Spacer,
    Text,
    useDisclosure, useToast,
    VStack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import Card from "../../../components/Card/Card";
import ProductLimitModal from "./ProductLimitModal";
import {getMeasurementUnits} from "../../../controller/ProductController";
import {deleteProductLimit, getAllProductLimit} from "../../../controller/ProductLimitsController";

import ProductLimitsContext from "../../../contexts/ProductLimitsContext";
import {FaCog, FaPencilAlt, FaTrashAlt, FaUserPlus} from "react-icons/fa";
import {MdReceipt} from "react-icons/md";

export default function ProductLimits() {

    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal
    } = useDisclosure();

    const {localUnit} = useContext(LocalUnitContext);

    const [modalEditionMode, setModalEditionMode] = useState(false);

    const [loadedProductLimits, setLoadedProductLimits] = useState(false);
    const [loadingProductLimits, setLoadingProductLimits] = useState(false);
    const [productLimits, setProductLimits] = useState([]);

    const [loadedUnits, setLoadedUnits] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [units, setUnits] = useState([]);

    const [selectedProductLimit, setSelectedProductLimit] = useState(null);
    const toast = useToast();

    if (loadedUnits === false && loadingUnits === false) {
        setLoadingUnits(true);
        getMeasurementUnits()
            .then((units) => {
                setUnits(units);
                setLoadedUnits(true);
                setLoadingUnits(false);
            })
            .catch((e) => {
                console.log(e)
                setLoadedUnits(false);
                setLoadingUnits(false);
                toast({
                    title: "Erreur",
                    description: "Echec du chargement des unités.",
                    status: "error",
                    duration: 10_000,
                    isClosable: true
                });
            });
    }

    if (loadedProductLimits === false && loadingProductLimits === false) {
        setLoadingProductLimits(true);
        getAllProductLimit()
            .then((units) => {
                setProductLimits(units);
                setLoadedProductLimits(true);
                setLoadingProductLimits(false);
            })
            .catch((e) => {
                console.log(e)
                setLoadedProductLimits(false);
                setLoadingProductLimits(false);
                toast({
                    title: "Erreur",
                    description: "Echec du chargement des limits de produit.",
                    status: "error",
                    duration: 10_000,
                    isClosable: true
                });
            });
    }

    if (localUnit === undefined || localUnit.id === undefined || loadingUnits === true) {
        return (
            <Center w='100%' h='100%'>
                <CircularProgress isIndeterminate color='green.300'/>
            </Center>
        );
    }

    const onCreateProductLimit = () => {
        setModalEditionMode(true);
        setSelectedProductLimit(undefined);
        onOpenModal();
    }

    const onViewProductLimit = (productLimit) => {
        setModalEditionMode(false);
        setSelectedProductLimit(productLimit);
        onOpenModal();
    }

    const onEditProductLimit = (productLimit) => {
        setModalEditionMode(true);
        setSelectedProductLimit(productLimit);
        onOpenModal();
    }

    const onDeleteProductLimit = (productLimit) => {
        deleteProductLimit(productLimit.id).then(() => {
            reloadProductLimits();
        }).catch((e) => {
            console.log(e)
            toast({
                title: "Erreur",
                description: "Echec de la suppresion de la limit de produit.",
                status: "error",
                duration: 10_000,
                isClosable: true
            });
        });
    }

    const reloadProductLimits = (pro) => {
        setLoadedProductLimits(false);
    }

    return (
        <ProductLimitsContext.Provider value={{productLimits, reloadProductLimits}}>
            <VStack pt={{base: "120px", md: "75px"}} mr='32px' align={'stretch'}>
                <Card>
                    <Flex justify="space-between">
                        <Text fontSize="xl" fontWeight="bold">Gestion des limites de produit </Text>
                        <Button onClick={onCreateProductLimit} colorScheme="green">Ajouter une limite de
                            produit</Button>
                    </Flex>
                </Card>
                <SimpleGrid columns={3} spacing={10}>
                    {productLimits.map((productLimit) => {
                        return (
                            <Card key={productLimit.id}>
                                <HStack align={'start'} >
                                    <VStack align={'stretch'}>
                                        <Text fontSize={'xl'} fontWeight="bold"> {productLimit.name}</Text>
                                        <Text fontSize="sm"
                                              color="gray.500"> {productLimit.quantity.value + ' ' + productLimit.quantity.measurementUnit + ' tous les ' + productLimit.duration + ' jours'}</Text>
                                    </VStack>
                                    <Spacer/>
                                    <Menu>
                                        <MenuButton>
                                            <Icon as={FaCog}/>
                                        </MenuButton>
                                        <MenuList>
                                            <Flex direction="column">
                                                <MenuItem onClick={() => onViewProductLimit(productLimit)}>
                                                    <Flex direction="row" cursor="pointer" p="12px">
                                                        <Icon as={FaUserPlus} mr="8px"/>
                                                        <Text fontSize="sm" fontWeight="semibold">détails</Text>
                                                    </Flex>
                                                </MenuItem>
                                                <MenuItem onClick={() => onEditProductLimit(productLimit)}>
                                                    <Flex direction="row" cursor="pointer" p="12px">
                                                        <Icon as={FaPencilAlt} mr="8px"/>
                                                        <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                                                    </Flex>
                                                </MenuItem>
                                                <MenuItem onClick={() => onDeleteProductLimit(productLimit)}>
                                                    <Flex direction="row" cursor="pointer" p="12px">
                                                        <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                                                        <Text color="red.500" fontSize="sm"
                                                              fontWeight="semibold">Supprimer</Text>
                                                    </Flex>
                                                </MenuItem>
                                            </Flex>
                                        </MenuList>
                                    </Menu>
                                </HStack>
                            </Card>)
                        })}
                </SimpleGrid>
            </VStack>

            <ProductLimitModal isOpen={isOpenModal} onClose={onCloseModal} size="6xl"
                               edit={modalEditionMode}
                               units={units}
                               scrollBehavior="outside" productLimit={selectedProductLimit}> </ProductLimitModal>


        </ProductLimitsContext.Provider>
    )
}
