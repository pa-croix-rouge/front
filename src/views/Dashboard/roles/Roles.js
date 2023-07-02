import React, {useContext, useState} from "react";
import {
  Button,
  Center,
  CircularProgress,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getLocalUnitRoles, getRoleAuth} from "../../../controller/RoleController";
import Role from "./Role";
import RoleCreationModal from "./RoleCreationModal";
import {getVolunteers} from "../../../controller/VolunteerController";
import Card from "../../../components/Card/Card";

export default function Roles(props) {
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [rolesLoadingError, setRolesLoadingError] = useState("");
  const [roleAuth, setRoleAuth] = useState(undefined);
  const [roles, setRoles] = useState([]);
  const [localUnitVolunteer, setLocalUnitVolunteer] = useState([]);
  const [localUnitVolunteerLoaded, setLocalUnitVolunteerLoaded] = useState(false);
  const { volunteer, setVolunteer } = useContext(VolunteerContext);
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();

  const onNewValidRole = (role) => {
    setRoles([...roles, role]);
  };

  const onDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  if (roleAuth === undefined) {
    getRoleAuth()
      .then((roleAuth) => {
        setRoleAuth(roleAuth);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  if (!localUnitVolunteerLoaded) {
    getVolunteers()
      .then((volunteers) => {
        setLocalUnitVolunteer(volunteers);
        setLocalUnitVolunteerLoaded(true);
      })
      .catch((e) => {
        setLocalUnitVolunteerLoaded(false);
      });
  }

  if (!rolesLoaded) {
    getLocalUnitRoles(volunteer.localUnitId)
      .then(async (roles) => {
        setRoles(roles);
        setRolesLoaded(true);
      })
      .catch((e) => {
        setRolesLoadingError(e.message);
        setRolesLoaded(false);
      });
  }

  if (rolesLoadingError !== "") {
    return (
      <Text>{rolesLoadingError}</Text>
    );
  } else if (rolesLoaded) {
    return (
      <>
        <VStack spacing={10}
                align="stretch"
                pt={{ base: "120px", md: "75px", lg: "75px" }}>
          <Card>
            <Flex justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Gestion des rôles</Text>
              <Button onClick={onOpenAddModal} colorScheme="green">Ajouter un rôle</Button>
            </Flex>
          </Card>
          <SimpleGrid columns={{ sm: 1, md: 1, xl: 2 }} spacing='24px' mb='8px'>
            {roles.map((role, index) => (
              <Role localUnitID={volunteer.localUnitId} localUnitVolunteer={localUnitVolunteer} role={role}
                    roleAuth={roleAuth} onDelete={onDeleteRole} key={index}></Role>
            ))}
          </SimpleGrid>
        </VStack>
        <RoleCreationModal isOpen={isOpenAddModal} onClose={onCloseAddModal}
                           localUnitID={volunteer.localUnitId} roleAuth={roleAuth} onNewValidRole={onNewValidRole} />
      </>
    );
  } else {
    return (
        <Center h="100%" w="100%">
          <CircularProgress isIndeterminate color="green.300" />
        </Center>
    );
  }
}
