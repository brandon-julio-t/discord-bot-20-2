import * as XLSX from 'xlsx';
import * as path from 'path';
import Assistant from '../models/Assistant';
import ShiftType from '../enums/shift-type';
import SpecialShift from '../models/special-shift';
import WorkingShift from '../models/working-shift';
import assistants from '../data/assistants';
import store from '../store';

const excel: XLSX.WorkBook = XLSX.readFile(
  path.join(
    path.dirname(require.main?.filename ?? './'),
    '..',
    'data',
    'Workshift and Special Shift Odd 2021 - rev4.xlsx'
  )
);
const astInitials: string[] = assistants.map(ast => ast.initial);

export function readWorkingShifts(): void {
  const workShift: string = excel.SheetNames[0];
  const sheetWorkShift: XLSX.Sheet = excel.Sheets[workShift];

  const initial: string = 'A';
  const shift: string = 'C';

  let row: number = 2;
  while (sheetWorkShift[`${initial}${row}`] !== undefined) {
    const _initial: string = sheetWorkShift[`${initial}${row}`]['v'];
    const _shift: string = sheetWorkShift[`${shift}${row}`]['v'];

    if (astInitials.includes(_initial)) {
      const shift: WorkingShift = new WorkingShift(
        assistants.filter(ast => ast.initial === _initial)[0],
        _shift.toLowerCase() === 'p' ? ShiftType.MORNING : ShiftType.NIGHT
      );

      store.assistantsWorkingShifts.push(shift);
    }

    row++;
  }
}

export function readSpecialShifts(): void {
  const specialShift: string = excel.SheetNames[1];
  const specialWorkShift: XLSX.Sheet = excel.Sheets[specialShift];

  const initial: string = 'A';
  const day: string = 'B';
  const shift: string = 'C';

  let row: number = 2;
  while (specialWorkShift[`${initial}${row}`] !== undefined) {
    const _initial: string = specialWorkShift[`${initial}${row}`]['v'];
    const _day: string = specialWorkShift[`${day}${row}`]['v'];
    const _shift: string = specialWorkShift[`${shift}${row}`]['v'];

    if (astInitials.includes(_initial)) {
      const matchingAssistant: Assistant = assistants.filter(ast => ast.initial === _initial)[0];
      const shift: SpecialShift = new SpecialShift(
        matchingAssistant,
        _shift.toLowerCase() === 'p' ? ShiftType.MORNING : ShiftType.NIGHT,
        _day
      );

      store.assistantsSpecialShifts.push(shift);
    }

    row++;
  }
}
