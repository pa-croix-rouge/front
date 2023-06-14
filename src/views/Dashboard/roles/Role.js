import { Button, Flex, IconButton, Spacer, Table, Tbody, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Card from "../../../components/Card/Card";
import React, { useState } from "react";
import { tablesTableData } from "../../../variables/general";
import TablesTableRow from "../../../components/Tables/TablesTableRow";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { deleteRole } from "../../../controller/RoleController";
import RoleCreationModal from "./RoleCreationModal";

export default function Role(props) {

  const options = ["CREATE", "UPDATE", "READ", "DELETE"];
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const [role, setRole] = useState(props.role);
  const [error, setError] = useState("");
  const [roleDeletionProgress, setRoleDeleteProgress] = useState(false);

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
                          <input
                            type="checkbox"
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
                         localUnitID={props.localUnitID} onNewValidRole={onEdit} role={role}/>
    </>
  );
}
