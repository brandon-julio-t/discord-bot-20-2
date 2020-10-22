export default class Assistant {
  public constructor(private _id: string, private _initial: string) {}

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
