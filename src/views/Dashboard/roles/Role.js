import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Radio, RadioGroup, SimpleGrid,
  Spacer,
  Table,
  Tbody,
  Text,
  Th,
  Thead, Tooltip,
  Tr,
  useDisclosure, useToast,
  VStack
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import React, {useEffect, useState} from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  assignVolunteerToRole,
  deleteRole,
  getRoleVolunteers,
  unassignVolunteerToRole
} from "../../../controller/RoleController";
import RoleCreationModal from "./RoleCreationModal";
import { FaCog, FaPencilAlt, FaTrashAlt, FaUserPlus } from "react-icons/fa";

export default function Role(props) {
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const { isOpen: isOpenManageModal, onOpen: onOpenManageModal, onClose: onCloseManageModal } = useDisclosure();
  const { isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();

  const [userType, setUserType] = useState('volunteer');

  const [role, setRole] = useState(props.role);
  const [searchVolunteer, setSearchVolunteer] = useState("");
  const [error, setError] = useState("");

  const [assignProgress, setAssignProgress] = useState(false);

  const [roleVolunteerLoaded, setRoleVolunteerLoaded] = useState(false);
  const [roleVolunteerLoading, setRoleVolunteerLoading] = useState(false);
  const [roleDeletionProgress, setRoleDeleteProgress] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setRole({...props.role,
      volunteer: props.role.volunteer === undefined ? [] :  props.role.volunteer,
      beneficiary: props.role.beneficiary === undefined ? [] :  props.role.beneficiary,
    })
  }, [props.role]);

  if (props.localUnitVolunteer === undefined || props.localUnitVolunteer.length === 0 || props.localUnitBeneficiary === undefined || props.volunteerAuthorizations === undefined) {
    return (
      <></>
    );
  }

  if (!roleVolunteerLoaded && !roleVolunteerLoading) {
    setRoleVolunteerLoading(true);
    getRoleVolunteers(role.id).then(value => {
      setRole({
        ...role,
        userIDs: value,
        volunteer: props.localUnitVolunteer.filter(volunteer => value.includes(volunteer.id)),
        beneficiary: props.localUnitBeneficiary.filter(beneficiary => value.includes(beneficiary.id)),
      });
      setRoleVolunteerLoaded(true);
      setRoleVolunteerLoading(false);
    }).catch(error => {
      setTimeout(() => {
        setRoleVolunteerLoaded(false);
        setRoleVolunteerLoading(false);
      }, 3000);
      toast({
        title: "Erreur",
        description: "Echec du chargement des volontaires de rôle.",
        status: "error",
        duration: 10_000,
        isClosable: true
      });
    });
  }

  const onDelete = () => {
    setRoleDeleteProgress(true);
    deleteRole(role.id).then(value => {
      props.onDelete(role.id);
      setRoleDeleteProgress(false);
      onCloseDeleteModal();
    }).catch(error => {
      setError(error.message);
      setRoleDeleteProgress(false);
      toast({
        title: "Erreur",
        description: "Echec de la suppression du role.",
        status: "error",
        duration: 10_000,
        isClosable: true
      });
    });
  };

  const onAssign = (e) => {
    const isVolunteer = userType === 'volunteer';
    setAssignProgress(true);

    assignVolunteerToRole(role.id, e.id).then(value => {
      if(isVolunteer){
        setRole({
          ...role,
          volunteer: [...role.volunteer, e]

        });
      }else{
        setRole({
          ...role,
          beneficiary: [...role.beneficiary, e]

        });
      }
      setAssignProgress(false);
    }).catch(error => {
      setAssignProgress(false);
      toast({
        title: "Erreur",
        description: "Echec de l'assignation du role.",
        status: "error",
        duration: 10_000,
        isClosable: true
      });
    });
  };

  const onUnAssign = (e) => {
    setAssignProgress(true);
    unassignVolunteerToRole(role.id, e.id).then(value => {
      setRole({
        ...role,
        volunteer: role.volunteer.filter(volunteer => volunteer.id !== e.id),
        beneficiary: role.beneficiary.filter(beneficiary => beneficiary.id !== e.id)
      });
      setAssignProgress(false);
    }).catch(error => {
      setAssignProgress(false);
      toast({
        title: "Erreur",
        description: "Echec de l'assignement du role.",
        status: "error",
        duration: 10_000,
        isClosable: true
      });
    });
  };

  const onEdit = (role) => {
    setRole(role);
  };

  const canUpdateRole = () => {
    return props.volunteerAuthorizations.ROLE?.filter((r) => r === 'UPDATE').length > 0;
  }

  const canDeleteRole = () => {
    return props.volunteerAuthorizations.ROLE?.filter((r) => r === 'DELETE').length > 0;
  }

  return (
    <>
      <Card>
        <Flex direction="column">
          <Flex direction="row" justify="space-between">
            <Flex direction="column">
              <Text fontSize="lg" fontWeight="bold">{role.name}</Text>
              <Text><i>{role.description}</i></Text>
            </Flex>
            <Menu>
              <MenuButton>
                <Icon as={FaCog} />
              </MenuButton>
              <MenuList>
                <Flex direction="column">
                  <MenuItem onClick={onOpenManageModal} isDisabled={!canUpdateRole()}>
                    <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateRole()}>
                      <Flex direction="row" cursor="pointer" p="12px">
                        <Icon as={FaUserPlus} mr="8px" />
                        <Text fontSize="sm" fontWeight="semibold">Gérer les utilisateurs</Text>
                      </Flex>
                    </Tooltip>
                  </MenuItem>
                  {role.localUnitID !== undefined && role.localUnitID !== null &&
                    <>
                      <MenuItem onClick={onOpenAddModal} isDisabled={!canUpdateRole()}>
                        <Tooltip label="Vous n'avez pas les droits" isDisabled={canUpdateRole()}>
                          <Flex direction="row" cursor="pointer" p="12px">
                            <Icon as={FaPencilAlt} mr="8px" />
                            <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                          </Flex>
                        </Tooltip>
                      </MenuItem>
                      <MenuItem onClick={onOpenDeleteModal} isDisabled={!canDeleteRole()}>
                        <Tooltip label="Vous n'avez pas les droits" isDisabled={canDeleteRole()}>
                          <Flex direction="row" cursor="pointer" p="12px">
                            <Icon as={FaTrashAlt} mr="8px" color="red.500" />
                            <Text color="red.500" fontSize="sm" fontWeight="semibold">Supprimer</Text>
                          </Flex>
                        </Tooltip>
                      </MenuItem>
                    </>
                  }
                </Flex>
              </MenuList>
            </Menu>
          </Flex>
          <Table variant="simple" flex={"1"}>
            <Thead>
              <Tr color="gray.400">
                <Th color="gray.400" p="8px 8px 8px 2px">
                  Resource
                </Th>
                {props.roleAuth.operations.map((op, index) => {
                  return (
                    <Th key={index} color="gray.400" p="8px">{op}</Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {props.roleAuth.resources.map((resource, index) => {
                return (
                  <Tr key={index}>
                    <Th p="8px 8px 8px 2px">{resource}</Th>
                    {props.roleAuth.operations.map((opt, idx) => {
                      return (
                        <Th key={idx} p="8px">
                          {role.authorizations[resource]?.find(v => v === opt) !== undefined && (
                            <Text>✅</Text>
                          )}
                          {role.authorizations[resource]?.find(v => v === opt) === undefined && (
                            <Text>❌</Text>
                          )}
                        </Th>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Text>{error}</Text>
        </Flex>
      </Card>

      <RoleCreationModal isOpen={isOpenAddModal} onClose={onCloseAddModal} roleAuth={props.roleAuth}
                         localUnitID={props.localUnitID} onNewValidRole={onEdit} role={role} />

      <Modal isOpen={isOpenManageModal} onClose={onCloseManageModal} size="xl" scrollBehavior="outside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manager les utilisateurs du role</ModalHeader>
          <ModalBody>
            <FormControl>
              <VStack align="stretch" spacing={10}>
                <HStack>
                  <FormLabel>Recherche</FormLabel>
                  <Input flex={1} type="text" placeholder="Recherche" value={searchVolunteer}
                         onChange={(e) => setSearchVolunteer(e.target.value)} />
                </HStack>
                <RadioGroup value={userType} onChange={setUserType}>
                  <Radio value={'beneficiary'} mr="8px">Bénéficiares</Radio>
                  <Radio value={'volunteer'}>Volontaires</Radio>
                </RadioGroup>
                {userType === 'beneficiary' && (
                  <FormLabel>Bénéficiaires ayant le role :</FormLabel>
                )}
                {userType === 'volunteer' && (
                  <FormLabel>Volontaires ayant le role :</FormLabel>
                )}
                <VStack align="stretch" spacing={1}>
                  {userType === 'beneficiary' && role.beneficiary
                      ?.filter(luv => (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                      .map((volunteer, index) => {
                        return (
                            <Flex direction="row" key={index}>
                              <Text>{volunteer.firstName} {volunteer.lastName}</Text>
                              <Spacer grow={"10"} />
                              <IconButton colorScheme="red" aria-label="unassign" icon={<DeleteIcon />}
                                          onClick={e => onUnAssign(volunteer)} />
                            </Flex>
                        );
                      })
                  }
                  {userType === 'volunteer' && role.volunteer
                      ?.filter(luv => (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                      .map((volunteer, index) => {
                        return (
                            <Flex direction="row" key={index}>
                              <Text>{volunteer.firstName} {volunteer.lastName}</Text>
                              <Spacer grow={"10"} />
                              <IconButton colorScheme="red" aria-label="unassign" icon={<DeleteIcon />}
                                          onClick={e => onUnAssign(volunteer)} />
                            </Flex>
                        );
                      })
                  }
                </VStack>
                {userType === 'beneficiary' && (
                    <FormLabel>Bénéficiaires dans l'UL :</FormLabel>
                )}
                {userType === 'volunteer' && (
                    <FormLabel>Volontaires dans l'UL :</FormLabel>
                )}
                <VStack align="stretch" spacing={1}>
                  {userType === 'volunteer' && props.localUnitVolunteer
                    ?.filter(luv =>
                      role.volunteer?.find(v => v.id == luv.id) === undefined
                      && (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                    .map((volunteer, index) => {
                      return (
                        <Flex direction="row" key={index}>
                          <Text>{volunteer.firstName} {volunteer.lastName}</Text>
                          <Spacer grow={"10"} />
                          <IconButton isLoading={assignProgress} colorScheme="green" aria-label="assign" icon={<AddIcon />}
                                      onClick={e => onAssign(volunteer)} />
                        </Flex>
                      );
                    })
                  }
                  {userType === 'beneficiary' && props.localUnitBeneficiary
                    ?.filter(luv =>
                      role.beneficiary?.find(v => v.id == luv.id) === undefined
                      && (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                    .map((volunteer, index) => {
                      return (
                        <Flex direction="row" key={index}>
                          <Text>{volunteer.firstName} {volunteer.lastName}</Text>
                          <Spacer grow={"10"} />
                          <IconButton colorScheme="green" aria-label="assign" icon={<AddIcon />}
                                      onClick={e => onAssign(volunteer)} />
                        </Flex>
                      );
                    })
                  }
                </VStack>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Text>{error}</Text>
            <Button colorScheme="blue" mr={3} onClick={onCloseManageModal}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} size="3xl" scrollBehavior="outside">
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Supprimer un role</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <FormControl>
                <Text>Etes-vous sur de vouloir supprimer le role {role.name} ?</Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDeleteModal}>
              Annuler
            </Button>
            <Button colorScheme="red" variant="outline" mr={3} onClick={onDelete}>
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
