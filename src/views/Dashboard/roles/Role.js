import {
  Button,
  Flex, FormControl, FormLabel,
  IconButton, Input,
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select,
  Spacer,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import React, { useState } from "react";
import { tablesTableData } from "../../../variables/general";
import TablesTableRow from "../../../components/Tables/TablesTableRow";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  assignVolunteerToRole,
  deleteRole,
  getRoleVolunteers,
  unassignVolunteerToRole
} from "../../../controller/RoleController";
import RoleCreationModal from "./RoleCreationModal";

export default function Role(props) {
  const options = ["CREATE", "UPDATE", "READ", "DELETE"];
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
          <Flex direction="column">
            <Text>ID: {role.id}</Text>
            <Text>Name: {role.name}</Text>
            <Text>Description: {role.description}</Text>
            <Button colorScheme="blue" aria-label="Manage" onClick={onOpenManageModal}>Manage User</Button>
            <IconButton isLoading={roleDeletionProgress} colorScheme="yellow" aria-label="Modifier" icon={<EditIcon />}
                        onClick={onOpenAddModal} />
            <IconButton isLoading={roleDeletionProgress} colorScheme="red" aria-label="Supprimer" icon={<DeleteIcon />}
                        onClick={onDelete} />
            <Text>{error}</Text>
          </Flex>
          <Spacer grow={"10"} />
          <Table variant="simple">
            <Thead>
              <Tr color="gray.400">
                <Th color="gray.400">
                  Resource
                </Th>
                <Th color="gray.400">Create</Th>
                <Th color="gray.400">Update</Th>
                <Th color="gray.400">View</Th>
                <Th color="gray.400">Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(role.authorizations).map((resource, index) => {
                return (
                  <Tr>
                    <Th>{resource}</Th>
                    {options.map((opt, index) => {
                      return (
                        <Th>
                          <input type="checkbox"
                                 checked={role.authorizations[resource].find(v => v === opt) !== undefined} />
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

      <RoleCreationModal isOpen={isOpenAddModal} onClose={onCloseAddModal}
                         localUnitID={props.localUnitID} onNewValidRole={onEdit} role={role} />

      <Modal isOpen={isOpenManageModal} onClose={onCloseManageModal} size="xl" scrollBehavior="outside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manager les utilisateurs du role</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Recherche</FormLabel>

              <Input type="text" placeholder="Recherche" value={searchVolunteer}
                     onChange={(e) => setSearchVolunteer(e.target.value)} />

              <FormLabel>Volontaire dans l'UL :</FormLabel>
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
              <FormLabel>Volontaire ayant le role :</FormLabel>
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
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Text>{error}</Text>
            <Button colorScheme="blue" mr={3} onClick={onCloseManageModal}>
              Annuler
            </Button>
            <Button variant="outline" colorScheme="green">
              {props.role === undefined ? "Ajouter" : "Modifier"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
