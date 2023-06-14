import { deleteWithToken, getWithToken, postWithToken, putWithToken } from "./Controller";
import { Role, RoleCreation } from "../model/Role";

export const getLocalUnitRoles = async (localUnitID: string) => {
  const response = await getWithToken(`role/localunit/${localUnitID}`);

  if (!response.ok) {
    throw new Error(`Fetching local unit failed with status ${response.status}`);
  }

  return await response.json();
}


export const getRole = async (roleID: string) => {
  const response = await getWithToken(`role/${roleID}`);

  if (!response.ok) {
    throw new Error(`Fetching local unit failed with status ${response.status}`);
  }

  return await response.json();
}

export const createRole = async (localUnitID: string, role: Role) => {
  const response = await postWithToken(`role`, { ...role, localUnitID :localUnitID });

  if (!response.ok) {
    throw new Error(`Fetching local unit failed with status ${response.status}`);
  }

  return await response.json();
}

export const deleteRole = async (roleID: string) => {
  const response = await deleteWithToken(`role/${roleID}`,);

  if (!response.ok) {
    throw new Error(`Fetching local unit failed with status ${response.status}`);
  }

}

export const updateRole = async (role: Role, localUnitID: string) => {
  const response = await putWithToken(`role/${role.id}`, { ...role, localUnitID :localUnitID });

  if (!response.ok) {
    throw new Error(`Fetching local unit failed with status ${response.status}`);
  }

}
