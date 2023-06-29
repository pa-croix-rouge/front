import {
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
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {
  assignVolunteerToRole,
  deleteRole,
  getRoleVolunteers,
  unassignVolunteerToRole
} from "../../../controller/RoleController";
import RoleCreationModal from "./RoleCreationModal";
import {FaCog, FaPencilAlt, FaTrashAlt, FaUserPlus} from "react-icons/fa";

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
        <Flex direction="column">
          <Flex direction="row" justify="space-between">
            <Flex direction="column">
              <Text fontSize="lg" fontWeight="bold">{role.name}</Text>
              <Text><i>{role.description}</i></Text>
            </Flex>
            <Menu>
              <MenuButton>
                <Icon as={FaCog}/>
              </MenuButton>
              <MenuList>
                <Flex direction="column">
                  <MenuItem onClick={onOpenManageModal}>
                    <Flex direction="row" cursor="pointer" p="12px">
                      <Icon as={FaUserPlus} mr="8px"/>
                      <Text fontSize="sm" fontWeight="semibold">Gérer les utilisateurs</Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem onClick={onOpenAddModal}>
                    <Flex direction="row" cursor="pointer" p="12px">
                      <Icon as={FaPencilAlt} mr="8px"/>
                      <Text fontSize="sm" fontWeight="semibold">Modifier</Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem onClick={onDelete}>
                    <Flex direction="row" cursor="pointer" p="12px">
                      <Icon as={FaTrashAlt} mr="8px" color="red.500"/>
                      <Text color="red.500" fontSize="sm" fontWeight="semibold">Supprimer</Text>
                    </Flex>
                  </MenuItem>
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
                {console.log(props.roleAuth)}
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
                    <Th  p="8px 8px 8px 2px">{resource}</Th>
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


                <FormLabel>Volontaire dans l'UL :</FormLabel>
                <VStack align="stretch" spacing={1}>
                  {props.localUnitVolunteer
                    ?.filter(luv =>
                      role.volunteer?.find(v => v.id === luv.id) === undefined
                      && (luv.firstName.search(searchVolunteer) !== -1 || luv.lastName.search(searchVolunteer) !== -1))
                    .map((volunteer, index) => {
                      return (
                        <Flex direction="row" key={index}>
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
                        <Flex direction="row" key={index}>
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
