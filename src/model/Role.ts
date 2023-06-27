export class Role {

  public id: number;
  public name: string;
  public description: string;

  public authorizations: Map<string, string[]>;
  public userIDs: number[];

  constructor(id: number, name: string, description: string, authorizations: Map<string, string[]>, userIDs: number[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.authorizations = authorizations;
    this.userIDs = userIDs;
  }
}

export class RoleAuth {

  public resources: string[];
  public operations: string[];

}

export class RoleCreation extends Role{

  public localUnitID: string;

  constructor(name: string, description: string, authorizations: Map<string, string[]>, userIDs: number[], localUnitID: string) {
    super(undefined, name, description, authorizations, userIDs);
    this.localUnitID = localUnitID;
  }

}
