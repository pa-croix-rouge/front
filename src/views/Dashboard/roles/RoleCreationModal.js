import React, {useEffect, useState} from "react";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Table,
  Tbody,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import {createRole, getRole, updateRole} from "../../../controller/RoleController";
import {Role} from "../../../model/Role";

export default function RoleCreationModal(props) {
  const [role, setRole] = useState(props.role === undefined ? new Role(undefined, "", "", new Map(), [], "") : props.role);
  const [roleCreationProgress, setRoleCreationProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(props.role === undefined ? new Role(undefined, "", "", new Map(), [], "") : props.role);
  }, [props.role] );

  const onAddNewRole = () => {
    if (role.name === "") {
      setError("Le nom du role ne peut pas être vide");
      return;
    }

    setRoleCreationProgress(true);
    (props.role === undefined ? createRole(props.localUnitID, role) : updateRole(role, props.localUnitID)).then((roleId) => {

      if (props.role === undefined) {
        getRole(roleId.value).then((role) => {
          setRole({ ...role, id: roleId });
          props.onNewValidRole(role);
          setRoleCreationProgress(false);
          props.onClose();
        }).catch((e) => {
          setRoleCreationProgress(false);
          setError(e.message);
        });
      } else {
        props.onNewValidRole(role);
        setRoleCreationProgress(false);
        props.onClose();
      }
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
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="2xl" scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter un role</ModalHeader>
        <ModalBody>
          <FormControl>
            <VStack  align="stretch">
              <SimpleGrid columns={2} spacing={5}>
                <FormLabel >Nom du role</FormLabel>
                <Input type="text" placeholder="Nom du role" value={role.name}
                       onChange={(e) => setRole({ ...role, name: e.target.value })} />
              </SimpleGrid >
              <Flex direction="column">
                <FormLabel>Description du role</FormLabel>
                <Textarea flex={1} type="text" placeholder="description du role" value={role.description}
                          onChange={(e) => setRole({ ...role, description: e.target.value })}
                          resize="none"/>
              </Flex>
              <Table variant="simple">
                <Thead>
                  <Tr color="gray.400">
                    <Th color="gray.400">
                      Resource
                    </Th>
                    {props.roleAuth.operations.map((op, index) => {
                      return (
                        <Th key={index} color="gray.400">{op}</Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {props.roleAuth.resources.map((resource, index) => {
                    return (
                      <Tr key={index}>
                        <Th>{resource}</Th>
                        {props.roleAuth.operations.map((opt, idx) => {
                          return (
                            <Th key={idx}>
                              <Checkbox
                                isChecked={role.authorizations[resource]?.find(v => v === opt) !== undefined}
                                onChange={(e) => onAuthNewRole(resource, opt, e.target.checked)} />
                            </Th>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </VStack>
            {error !== "" && (
                <Text color="red.500">{error}</Text>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
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
