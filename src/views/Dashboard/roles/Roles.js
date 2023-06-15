import React, { useContext, useState } from "react";
import { Button, Progress, Text, useDisclosure } from "@chakra-ui/react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import { getLocalUnitRoles } from "../../../controller/RoleController";
import Role from "./Role";
import RoleCreationModal from "./RoleCreationModal";

export default function Roles(props) {
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [rolesLoadingError, setRolesLoadingError] = useState("");
  const [roles, setRoles] = useState([]);
  const { volunteer, setVolunteer } = useContext(VolunteerContext);
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();

  const onNewValidRole = (role) => {
    setRoles([...roles, role]);
  };

  const onDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  if(!rolesLoaded)
  {
    getLocalUnitRoles(volunteer.localUnitId)
      .then((roles) => {
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
        <div>
          <Text>{volunteer.username}</Text>
          {roles.map((role, index) => (
            <Role localUnitID={volunteer.localUnitId} role={role} onDelete={onDeleteRole}></Role>
          ))}
          <Button onClick={onOpenAddModal}> Add New Role </Button>
        </div>
        <RoleCreationModal isOpen={isOpenAddModal} onClose={onCloseAddModal}
                           localUnitID={volunteer.localUnitId} onNewValidRole={onNewValidRole} />
      </>
    );
  } else {
    return (
      <Progress size='xs' isIndeterminate />
    );
  }

}