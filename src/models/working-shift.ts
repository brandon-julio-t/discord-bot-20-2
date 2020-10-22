import ShiftType from '../enums/shift-type';
import Assistant from './Assistant';

export default class WorkingShift {
  public constructor(private _assistant: Assistant, private _shift: ShiftType) {}

  public get assistant(): Assistant {
    return this._assistant;
  }

  public get shift(): ShiftType {
    return this._shift;
  }
}
