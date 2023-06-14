export class Role {

  public id: number;
  public name: string;
  public description: string;

  public authorizations: Map<string, string[]>;
  public userIDs: string[];

  constructor(id: number, name: string, description: string, authorizations: Map<string, string[]>, userIDs: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.authorizations = authorizations;
    this.userIDs = userIDs;
  }
}

export class RoleCreation extends Role{

  public localUnitID: string;

  constructor(name: string, description: string, authorizations: Map<string, string[]>, userIDs: string[], localUnitID: string) {
    super(undefined, name, description, authorizations, userIDs);
    this.localUnitID = localUnitID;
  }

}
