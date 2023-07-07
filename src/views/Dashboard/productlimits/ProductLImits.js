import React, {useContext, useState} from "react";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Flex, FormControl,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Spacer,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import LocalUnitContext from "../../../contexts/LocalUnitContext";
import Card from "../../../components/Card/Card";
import ProductLimitModal from "./ProductLimitModal";
import {getMeasurementUnits} from "../../../controller/ProductController";
import {deleteProductLimit, getAllProductLimit} from "../../../controller/ProductLimitsController";

import ProductLimitsContext from "../../../contexts/ProductLimitsContext";
import {FaCog, FaPencilAlt, FaTrashAlt, FaUserPlus} from "react-icons/fa";
import {getMyAuthorizations} from "../../../controller/RoleController";

export default function ProductLimits() {

    const {isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure();
    const { isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
    const {localUnit} = useContext(LocalUnitContext);
    const [modalEditionMode, setModalEditionMode] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [loadedProductLimits, setLoadedProductLimits] = useState(false);
    const [loadingProductLimits, setLoadingProductLimits] = useState(false);
    const [productLimits, setProductLimits] = useState([]);

    const [loadedUnits, setLoadedUnits] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [units, setUnits] = useState([]);

    const [selectedProductLimit, setSelectedProductLimit] = useState(null);
    const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
    const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
    const toast = useToast();

    const canReadProduct =() => {
        return volunteerAuthorizations.PRODUCT?.filter((r) => r === 'READ').length > 0;
    }

    if (loadedUnits === false && loadingUnits === false && loadedVolunteerAuthorizations && canReadProduct()) {
        setLoadingUnits(true);
        getMeasurementUnits()
            .then((units) => {
                setUnits(units);
                setLoadedUnits(true);
                setLoadingUnits(false);
            })
            .catch((e) => {
                setTimeout(() => {setLoadedUnits(false)}, 3000);
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
                setTimeout(() => {setLoadedProductLimits(false)}, 3000);
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

    const doDeleteProductLimit = () => {
        setDeleting(true);
        deleteProductLimit(selectedProductLimit.id).then(() => {
            setDeleting(false);
            reloadProductLimits();
            onCloseDeleteModal();
        }).catch((e) => {
            setDeleting(false);
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

    const onDeleteProductLimit = (productLimit) => {
        setSelectedProductLimit(productLimit);
        onOpenDeleteModal();
    }

    const reloadProductLimits = () => {
        setLoadedProductLimits(false);
    }

    const loadVolunteerAuthorizations = () => {
        setLoadedVolunteerAuthorizations(true);
        getMyAuthorizations()
            .then((roles) => {
                setVolunteerAuthorizations(roles);
            })
            .catch((_) => {
                setTimeout(() => {setLoadedVolunteerAuthorizations(false)}, 3000);
                toast({
                    title: 'Erreur',
                    description: "Echec du chargement des droits du volontaire.",
                    status: 'error',
                    duration: 10_000,
                    isClosable: true,
                });
            });
    }

    const canAddProductLimit = () => {
        return volunteerAuthorizations.PRODUCT_LIMIT?.filter((r) => r === 'CREATE').length > 0;
    }

    const canUpdateProductLimit = () => {
        return volunteerAuthorizations.PRODUCT_LIMIT?.filter((r) => r === 'UPDATE').length > 0;
    }

    const canDeleteProductLimit = () => {
        return volunteerAuthorizations.PRODUCT_LIMIT?.filter((r) => r === 'DELETE').length > 0;
    }

    return (
        <>
            {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
            <ProductLimitsContext.Provider value={{productLimits, reloadProductLimits}}>
                <VStack pt={{base: "120px", md: "75px"}} mr='32px' align={'stretch'}>
                    <Card>
                        <Flex justify="space-between">
                            <Text fontSize="xl" fontWeight="bold">Gestion des limites de produit </Text>
                            <Tooltip label="Vous n'avez pas les droits" isDisabled={canAddProductLimit()}>
                                <Box>
                                    <Button onClick={onCreateProductLimit} colorScheme="green" disabled={!canAddProductLimit()}>Ajouter une limite de produit</Button>
                                </Box>
                            </Tooltip>
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
                                                    <MenuItem onClick={() => onEditProductLimit(productLimit)} isDisabled={!canUpdateProductLimit()}>
                                                        <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateProductLimit()}>
                                                            <Flex direction="row" cursor="pointer" p="12px">
                                                                <Icon as={FaPencilAlt} mr="8px"/>
                                                                <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                                                            </Flex>
                                                        </Tooltip>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => onDeleteProductLimit(productLimit)} isDisabled={!canDeleteProductLimit()}>
                                                        <Tooltip label="Vous n'avez pas les droits" isDisabled={canDeleteProductLimit()}>
                                                            <Flex direction="row" cursor="pointer" p="12px">
                                                                <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                                                                <Text color="red.500" fontSize="sm" fontWeight="semibold">Supprimer</Text>
                                                            </Flex>
                                                        </Tooltip>
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
                                   scrollBehavior="outside" productLimit={selectedProductLimit} canReadProduct={canReadProduct()}> </ProductLimitModal>

                <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} size="3xl" scrollBehavior="outside">
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>Supprimer une limite de produit</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <FormControl>
                                <Text>Etes-vous sur de vouloir supprimer la limite de produit {selectedProductLimit?.name} ?</Text>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onCloseDeleteModal}>
                                Annuler
                            </Button>
                            <Button colorScheme="red" variant="outline" mr={3} onClick={doDeleteProductLimit} isLoading={deleting}>
                                Supprimer
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </ProductLimitsContext.Provider>
        </>
    )
}
