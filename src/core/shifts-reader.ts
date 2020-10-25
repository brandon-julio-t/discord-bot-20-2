import * as XLSX from 'xlsx';
import * as path from 'path';
import SpecialShift from '../models/special-shift';
import WorkingShift from '../models/working-shift';
import assistants from '../data/assistants';
import store from '../store';

const excel = XLSX.readFile(path.join(__dirname, '../data/Workshift and Special Shift Odd 2021 - rev4.xlsx'));
const astInitials = assistants.map(ast => ast.initial);

export function readWorkingShifts(): void {
  const workShift = excel.SheetNames[0];
  const sheetWorkShift = excel.Sheets[workShift];

  const initial = 'A';
  const shift = 'C';

  let row = 2;
  while (sheetWorkShift[`${initial}${row}`] !== undefined) {
    const _initial = sheetWorkShift[`${initial}${row}`]['v'];
    const _shift = sheetWorkShift[`${shift}${row}`]['v'];
    if (astInitials.includes(_initial)) {
      store.assistantsWorkingShifts.push(
        new WorkingShift(assistants.filter(ast => ast.initial === _initial)[0], _shift)
      );
    }

    row++;
  }
}

export function readSpecialShifts(): void {
  const specialShift = excel.SheetNames[1];
  const specialWorkShift = excel.Sheets[specialShift];

  const initial = 'A';
  const day = 'B';
  const shift = 'C';

  let row = 2;
  while (specialWorkShift[`${initial}${row}`] !== undefined) {
    const _initial = specialWorkShift[`${initial}${row}`]['v'];
    const _day = specialWorkShift[`${day}${row}`]['v'];
    const _shift = specialWorkShift[`${shift}${row}`]['v'];

    if (astInitials.includes(_initial)) {
      store.assistantsSpecialShifts.push(
        new SpecialShift(assistants.filter(ast => ast.initial === _initial)[0], _shift, _day)
      );
    }

    row++;
  }
}
