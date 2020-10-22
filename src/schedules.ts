import Assistant from './models/Assistant';
import ShiftType from './enums/shift-type';
import assistants from './assistants';
import state from './state';
import SpecialShift from './models/special-shift';

export default {
  '0 6 * * mon-sat': () => {
    const { channel } = state;
    channel.send(`Bangun. ${assistants.map(ast => ast.mention()).join(' ')}`);
    channel.send(`
__**Working Shifts**__
${state.assistantsWorkingShifts
  .map((workingShift, idx) => {
    const { assistant, shift } = workingShift;
    return `${idx + 1}. ${assistants.filter(ast => ast.initial === assistant.initial)[0].mention()}: ${
      shift === ShiftType.MORNING ? 'Pagi' : 'Malam'
    }`;
  })
  .join('\n')}

__**Today's Special Shifts**__
${state.assistantsSpecialShifts
  .filter(specialShift => specialShift.isToday)
  .map((specialShift, idx) => {
    const { assistant, shift } = specialShift;
    return `${idx + 1}. ${assistants.filter(ast => ast.initial === assistant.initial)[0].mention()}: ${
      shift === ShiftType.MORNING ? 'pagi' : 'malam'
    }`;
  })
  .join('\n')}
`);
  },

  '20 7 * * 1': () => state.channel.send(`Rectorate. ${assistants.map(ast => ast.mention()).join(' ')}`),
  '50 6 * * mon-sat': () => state.channel.send(clock('in', ShiftType.MORNING)),
  '50 10 * * mon-sat': () => state.channel.send(clock('in', ShiftType.NIGHT)),
  '0 15 * * mon-fri': () => state.channel.send(clock('out', ShiftType.MORNING)),
  '0 19 * * mon-fri': () => state.channel.send(clock('out', ShiftType.NIGHT)),
  '0 13 * * sat': () => state.channel.send(clock('out', ShiftType.MORNING)),
  '0 17 * * sat': () => state.channel.send(clock('out', ShiftType.NIGHT)),
  '0 21 * * sat': () => state.channel.send(`Eval Angkatan. ${assistants.map(ast => ast.mention()).join(' ')}`),
};

function clock(type: 'in' | 'out', shiftType: ShiftType): string {
  const indonesianShift = shiftType === ShiftType.MORNING ? 'Pagi' : 'Malam';
  return `Shift ${indonesianShift} clock ${type}\n${getAssistantsWithSpecialShiftByShift(shiftType)
    .map(ast => `${ast.initial} (${ast.mention()})`)
    .join('\n')}`.trim();
}

export function getAssistantsWithSpecialShiftByShift(shift: ShiftType): Assistant[] {
  return state.assistantsWorkingShifts
    .filter(workingShift => {
      const isSpecialShift =
        state.assistantsSpecialShifts
          .filter(specialShift => workingShift.assistant.initial === specialShift.assistant.initial)
          .filter(specialShift => specialShift.isToday)
          .filter(specialShift => workingShift.shift !== specialShift.shift).length > 0;

      if (isSpecialShift) {
        return state.assistantsSpecialShifts
          .filter(specialShift => specialShift.assistant.initial === workingShift.assistant.initial)
          .every(specialShift => specialShift.shift === shift);
      }

      return workingShift.shift === shift;
    })
    .map(workingShift => workingShift.assistant);
}
