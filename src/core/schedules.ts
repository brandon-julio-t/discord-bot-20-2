import Assistant from '../models/Assistant';
import ShiftType from '../enums/shift-type';
import assistants from '../data/assistants';
import state from '../store';

let hasSaidHappySunday: boolean = false;

export default {
  /**
   * Remind all 20-2 assistants to wake up and send `!shifts` command
   */
  '0 6 * * mon-sat': () => {
    const { channel } = state;
    channel.send(`Bangun. ${assistants.map(ast => ast.mention()).join(' ')}`);
    channel.send(`!shifts`);
  },

  /**
   * Remind all 20-2 assistants to fill rectorate at 07:20 on monday.
   */
  '20 7 * * mon': () => state.channel.send(`Rectorate. ${assistants.map(ast => ast.mention()).join(' ')}`),

  /**
   * Remind 20-2 assistants whose shifts is morning to clock in at 06:50 on every day-of-week from Monday through Saturday.
   */
  '50 6 * * mon-sat': () => state.channel.send(clock('in', ShiftType.MORNING)),

  /**
   * Remind 20-2 assistants whose shifts is night to clock in at 10:50 on every day-of-week from Monday through Saturday.
   */
  '50 10 * * mon-sat': () => state.channel.send(clock('in', ShiftType.NIGHT)),

  /**
   * Remind 20-2 assistants whose shifts is morning to clock out at 15:00 on every day-of-week from Monday through Friday.
   */
  '0 15 * * mon-fri': () => state.channel.send(clock('out', ShiftType.MORNING)),

  /**
   * Remind 20-2 assistants whose shifts is night to clock out at 19:00 on every day-of-week from Monday through Friday.
   */
  '0 19 * * mon-fri': () => state.channel.send(clock('out', ShiftType.NIGHT)),

  /**
   * Remind 20-2 assistants whose shifts is morning to clock out at 13:00 on Saturday.
   */
  '0 13 * * sat': () => state.channel.send(clock('out', ShiftType.MORNING)),

  /**
   * Remind 20-2 assistants whose shifts is night to clock out at 17:00 on Saturday.
   */
  '0 17 * * sat': () => state.channel.send(clock('out', ShiftType.NIGHT)),

  /**
   * Remind all 20-2 assistants to do eval angkatan at 21:00 on Saturday.
   */
  '0 21 * * sat': () => state.channel.send(`Eval Angkatan. ${assistants.map(ast => ast.mention()).join(' ')}`),

  /**
   * Greet happy Sunday to every member in the server.
   */
  '* * * * sun': () => {
    if (!hasSaidHappySunday) {
      state.channel.send(`__**Happy Sunday @everyone (yang bikin bot baru bangun).**__`);
      hasSaidHappySunday = true;
    }
  },
};

function clock(type: 'in' | 'out', shiftType: ShiftType): string {
  const indonesianShift: string = shiftType === ShiftType.MORNING ? 'Pagi' : 'Malam';
  const uppercaseType: string = `${type[0].toUpperCase()}${type.substring(1).toLowerCase()}`;

  return `
__**Shift ${indonesianShift} Clock ${uppercaseType}**__

${getAssistantsWithSpecialShiftByShift(shiftType)
  .map((ast, idx) => `${idx + 1}. ${ast.initial} (${ast.mention()})`)
  .join('\n')}`.trim();
}

function getAssistantsWithSpecialShiftByShift(shift: ShiftType): Assistant[] {
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
