import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Text,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import { createRole, getRole, updateRole } from "../../../controller/RoleController";
import { Role, RoleCreation } from "../../../model/Role";

export default function RoleCreationModal(props) {
  const [role, setRole] = useState(props.role === undefined ? new Role(undefined, "", "", new Map(), [], "") : props.role);
  const [roleCreationProgress, setRoleCreationProgress] = useState(false);
  const [error, setError] = useState("");

  const onAddNewRole = () => {

    setRoleCreationProgress(true);
    (props.role === undefined ? createRole(props.localUnitID, role) : updateRole(role, props.localUnitID)).then((roleId) => {

      if (props.role === undefined) {
        getRole(roleId).then((role) => {
          setRole({ ...role, id: roleId });
          props.onNewValidRole(role);
          setRoleCreationProgress(false);
        }).catch((e) => {
          setRoleCreationProgress(false);
          setError(e.message);
        });
      } else {
        props.onNewValidRole(role);
        setRoleCreationProgress(false);
      }
      props.onClose();
    }).catch((e) => {
      setRoleCreationProgress(false);
      setError(e.message);
    });
  };

  const onAuthNewRole = (resource, operation, checked) => {
    if (checked) {
      let auth = role.authorizations[resource];
      if (auth === undefined) {
        auth = [];
      }
      auth.push(operation);
      setRole({ ...role, authorizations: { ...role.authorizations, [resource]: auth } });
    } else {
      let auth = role.authorizations[resource];
      if (auth !== undefined) {
        auth = auth.filter((v) => v !== operation);
        setRole({ ...role, authorizations: { ...role.authorizations, [resource]: auth } });
      }
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl" scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter un role</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Nom du role</FormLabel>
            <Input type="text" placeholder="Nom du role" value={role.name}
                   onChange={(e) => setRole({ ...role, name: e.target.value })} />
            <Input type="text" placeholder="description du role" value={role.description}
                   onChange={(e) => setRole({ ...role, description: e.target.value })} />
            <Table variant="simple">
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
                            <input
                              type="checkbox"
                              checked={role.authorizations[resource]?.find(v => v === opt) !== undefined}
                              onChange={(e) => onAuthNewRole(resource, opt, e.target.checked)} />
                          </Th>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

          </FormControl>

        </ModalBody>
        <ModalFooter>
          <Text>{error}</Text>
          <Button isLoading={roleCreationProgress} colorScheme="blue" mr={3} onClick={props.onClose}>
            Annuler
          </Button>
          <Button isLoading={roleCreationProgress} variant="outline" colorScheme="green"
                  onClick={() => onAddNewRole()}>
            {props.role === undefined ? "Ajouter" : "Modifier"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
