import ShiftType from '../enums/shift-type';
import Assistant from './Assistant';
import WorkingShift from './working-shift';

export default class SpecialShift extends WorkingShift {
  public constructor(assistant: Assistant, shift: ShiftType, private _day: string) {
    super(assistant, shift);
  }

  public get day(): string {
    return this._day;
  }

  public get isToday(): boolean {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()] === this.day;
  }
}
