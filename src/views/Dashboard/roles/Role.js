import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import React, {useState} from "react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {
  assignVolunteerToRole,
  deleteRole,
  getRoleVolunteers,
  unassignVolunteerToRole
} from "../../../controller/RoleController";
import RoleCreationModal from "./RoleCreationModal";

export default function Role(props) {
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const { isOpen: isOpenManageModal, onOpen: onOpenManageModal, onClose: onCloseManageModal } = useDisclosure();
  const [role, setRole] = useState(props.role);
  const [searchVolunteer, setSearchVolunteer] = useState("");
  const [error, setError] = useState("");
  const [roleVolunteerLoaded, setRoleVolunteerLoaded] = useState(false);
  const [roleDeletionProgress, setRoleDeleteProgress] = useState(false);

  if (!roleVolunteerLoaded) {
    getRoleVolunteers(role.id).then(value => {
      setRole({
        ...role,
        userIDs: value,
        volunteer: props.localUnitVolunteer.filter(volunteer => value.includes(volunteer.id))
      });
      setRoleVolunteerLoaded(true);
    }).catch(error => {
      console.log(error.message);
      setRoleVolunteerLoaded(false);
    });
  }

  const onDelete = () => {
    setRoleDeleteProgress(true);
    deleteRole(role.id).then(value => {
      props.onDelete(role.id);
      setRoleDeleteProgress(false);
    }).catch(error => {
      setError(error.message);
      setRoleDeleteProgress(false);
    });
  };

  const onAssign = (e) => {
    assignVolunteerToRole(role.id, e.id).then(value => {
      setRole({ ...role, volunteer: [...role.volunteer, e] });
    }).catch(error => {
      console.log(error.message);
    });
  };

  const onUnAssign = (e) => {
    unassignVolunteerToRole(role.id, e.id).then(value => {
      console.log(role);
      setRole({ ...role, volunteer: role.volunteer.filter(volunteer => volunteer.id !== e.id) });
    }).catch(error => {
      console.log(error.message);
    });
  };

  const onEdit = (role) => {
    setRole(role);
  };

  return (
    <>
      <Card>
        <Flex direction="row">
          <VStack flex={"0.5"}>
            <Text>Name: {role.name}</Text>
            <Text>Description: {role.description}</Text>
            <Spacer />
            <Button colorScheme="blue" aria-label="Manage" onClick={onOpenManageModal}>Manage User</Button>
            <IconButton isLoading={roleDeletionProgress} colorScheme="yellow" aria-label="Modifier" icon={<EditIcon />}
                        onClick={onOpenAddModal} />
            <IconButton isLoading={roleDeletionProgress} colorScheme="red" aria-label="Supprimer" icon={<DeleteIcon />}
                        onClick={onDelete} />
            <Text>{error}</Text>
          </VStack>
          <Table variant="simple" flex={"1"}>
            <Thead>
              <Tr color="gray.400">
                <Th color="gray.400">
                  Resource
                </Th>
                {props.roleAuth.operations.map((op, index) => {
                  return (
                    <Th color="gray.400">{op}</Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {props.roleAuth.resources.map((resource, index) => {
                return (
                  <Tr>
                    <Th>{resource}</Th>
                    {props.roleAuth.operations.map((opt, index) => {
                      return (
                        <Th>
                          <Checkbox isReadOnly={true}
                                    isChecked={role.authorizations[resource]?.find(v => v === opt) !== undefined} />
                        </Th>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
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


                <FormLabel>Volontaire dans l'UL :</FormLabel>
                <VStack align="stretch" spacing={1}>
                  {props.localUnitVolunteer
                    ?.filter(luv =>
                      role.volunteer?.find(v => v.id === luv.id) === undefined
                      && (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                    .map((volunteer, index) => {
                      return (
                        <Flex direction="row">
                          <Text>{volunteer.id} {volunteer.firstName} {volunteer.lastName}</Text>
                          <Spacer grow={"10"} />
                          <IconButton colorScheme="green" aria-label="assign" icon={<AddIcon />}
                                      onClick={e => onAssign(volunteer)} />
                        </Flex>
                      );
                    })
                  }
                </VStack>
                <FormLabel>Volontaire ayant le role :</FormLabel>
                <VStack align="stretch" spacing={1}>
                  {role.volunteer
                    // ?.filter( rv => rv.firstName.search(searchVolunteer) !== -1 || rv.lastName.search(searchVolunteer) !== -1 )
                    ?.map((volunteer, index) => {
                      return (
                        <Flex direction="row">
                          <Text>{volunteer.id} {volunteer.firstName} {volunteer.lastName}</Text>
                          <Spacer grow={"10"} />
                          <IconButton colorScheme="red" aria-label="unassign" icon={<DeleteIcon />}
                                      onClick={e => onUnAssign(volunteer)} />
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
    </>
  );
}
