import React, {useContext, useState} from "react";
import {Button, Progress, Text, useDisclosure, VStack} from "@chakra-ui/react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getLocalUnitRoles, getRoleAuth} from "../../../controller/RoleController";
import Role from "./Role";
import RoleCreationModal from "./RoleCreationModal";
import {getVolunteers} from "../../../controller/VolunteerController";

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
          <VStack spacing={4}
                  align="stretch">
            {roles.map((role, index) => (
              <Role localUnitID={volunteer.localUnitId} localUnitVolunteer={localUnitVolunteer} role={role}
                    roleAuth={roleAuth} onDelete={onDeleteRole} key={index}></Role>
            ))}
          </VStack>
          <Button onClick={onOpenAddModal}> Add New Role </Button>
        </VStack>
        <RoleCreationModal isOpen={isOpenAddModal} onClose={onCloseAddModal}
                           localUnitID={volunteer.localUnitId} roleAuth={roleAuth} onNewValidRole={onNewValidRole} />
      </>
    );
  } else {
    return (
      <Progress size="xs" isIndeterminate />
    );
  }

}
