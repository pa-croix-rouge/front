import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  SimpleGrid,
  Text, Tooltip,
  useDisclosure, useToast,
  VStack
} from "@chakra-ui/react";
import VolunteerContext from "../../../contexts/VolunteerContext";
import {getLocalUnitRoles, getMyAuthorizations, getRoleAuth} from "../../../controller/RoleController";
import Role from "./Role";
import RoleCreationModal from "./RoleCreationModal";
import { getVolunteers } from "../../../controller/VolunteerController";
import Card from "../../../components/Card/Card";
import { getBeneficiaries } from "../../../controller/BeneficiariesController";

export default function Roles(props) {
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [rolesLoadingError, setRolesLoadingError] = useState("");
  const [roleAuth, setRoleAuth] = useState(undefined);
  const [roles, setRoles] = useState([]);

  const [localUnitBeneficiary, setLocalUnitBeneficiary] = useState([]);
  const [localUnitBeneficiaryLoaded, setLocalUnitBeneficiaryLoaded] = useState(false);
  const [localUnitBeneficiaryLoading, setLocalUnitBeneficiaryLoading] = useState(false);

  const [localUnitVolunteer, setLocalUnitVolunteer] = useState([]);
  const [localUnitVolunteerLoaded, setLocalUnitVolunteerLoaded] = useState(false);
  const [localUnitVolunteerLoading, setLocalUnitVolunteerLoading] = useState(false);
  const { volunteer, setVolunteer } = useContext(VolunteerContext);
  const { isOpen: isOpenAddModal, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const [loadedVolunteerAuthorizations, setLoadedVolunteerAuthorizations] = useState(false);
  const [volunteerAuthorizations, setVolunteerAuthorizations] = useState({});
  const toast = useToast();

  const loadVolunteerAuthorizations = () => {
    setLoadedVolunteerAuthorizations(true);
    getMyAuthorizations()
        .then((roles) => {
          setVolunteerAuthorizations(roles);
        })
        .catch((_) => {
          setTimeout(() => {setLoadedVolunteerAuthorizations(false)}, 3000);
          toast({
            title: 'Erreur',
            description: "Echec du chargement des droits du volontaire.",
            status: 'error',
            duration: 10_000,
            isClosable: true,
          });
        });
  }

  const onNewValidRole = (role) => {
    setRoles([...roles, role]);
  };

  const onDeleteRole = (roleId) => {
    console.log('onDeleteRole');
    console.log(roleId);
    console.log(roles);
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const canAddRole = () => {
    return volunteerAuthorizations.ROLE?.filter((r) => r === 'CREATE').length > 0;
  }

  if (roleAuth === undefined) {
    getRoleAuth()
      .then((roleAuth) => {
        setRoleAuth(roleAuth);
      })
      .catch((e) => {
        toast({
          title: "Erreur",
          description: "Echec du chargement des rôles.",
          status: "error",
          duration: 10_000,
          isClosable: true
        });
      });
  }

  if (!localUnitVolunteerLoaded && !localUnitVolunteerLoading) {
    setLocalUnitVolunteerLoading(true);
    getVolunteers()
      .then((volunteers) => {
        setLocalUnitVolunteer(volunteers);
        setLocalUnitVolunteerLoaded(true);
        setLocalUnitVolunteerLoading(false);
      })
      .catch((e) => {
        setTimeout(() => {
          setLocalUnitVolunteerLoaded(false);
          setLocalUnitVolunteerLoading(false);
        }, 3000);
        toast({
          title: "Erreur",
          description: "Echec du chargement des volontaires.",
          status: "error",
          duration: 10_000,
          isClosable: true
        });
      });
  }

  if (!localUnitBeneficiaryLoaded && !localUnitBeneficiaryLoading) {
    setLocalUnitBeneficiaryLoading(true);
    getBeneficiaries()
      .then((beneficiaries) => {
        setLocalUnitBeneficiary(beneficiaries);
        setLocalUnitBeneficiaryLoaded(true);
        setLocalUnitBeneficiaryLoading(false);
      }).catch((e) => {
      setLocalUnitVolunteerLoaded(false);
      setLocalUnitBeneficiaryLoading(false);
      toast({
        title: "Erreur",
        description: "Echec du chargement des bénéficiares.",
        status: "error",
        duration: 10_000,
        isClosable: true
      });
    });
  }

  if (!rolesLoaded) {
    getLocalUnitRoles(volunteer.localUnitId)
      .then(async (roles) => {
        setRoles(roles);
        setRolesLoaded(true);
      })
      .catch((e) => {
        setTimeout(() => {
          setRolesLoaded(false);
        }, 3000);
        toast({
          title: "Erreur",
          description: "Echec du chargement des rôles.",
          status: "error",
          duration: 10_000,
          isClosable: true
        });
      });
  }

  if (rolesLoadingError !== "") {
    return (
      <Text>{rolesLoadingError}</Text>
    );
  } else if (rolesLoaded) {
    return (
      <>
        {!loadedVolunteerAuthorizations && loadVolunteerAuthorizations()}
        <VStack spacing={10}
                align="stretch"
                pt={{ base: "120px", md: "75px", lg: "75px" }}>
          <Card>
            <Flex justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Gestion des rôles</Text>
              <Tooltip label="Vous n'avez pas les droits" isDisabled={canAddRole()}>
                <Box>
                  <Button onClick={onOpenAddModal} colorScheme="green" disabled={!canAddRole()}>Ajouter un rôle</Button>
                </Box>
              </Tooltip>
            </Flex>
          </Card>
          <SimpleGrid columns={{sm: 1, md: 1, lg: 2, xl: 2, "2xl": 3}} spacing={10}>
            {roles.map((role, index) => (
              <Role localUnitID={volunteer.localUnitId} localUnitVolunteer={localUnitVolunteer} localUnitBeneficiary={localUnitBeneficiary} role={role}
                    roleAuth={roleAuth} volunteerAuthorizations={volunteerAuthorizations} onDelete={onDeleteRole} key={index}></Role>
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
