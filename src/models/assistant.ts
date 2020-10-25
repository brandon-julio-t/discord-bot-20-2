export default class Assistant {
  public constructor(private _initial: string, private _id: string) {}

  public get id(): string {
    return this._id;
  }

  public get initial(): string {
    return this._initial;
  }

  public mention(): string {
    return `<@${this.id}>`;
  }
}
