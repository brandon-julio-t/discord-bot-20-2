import Assistant from './models/assistant';
import Shift from './models/shift';
import schedules from './schedules';
import state from './state';
import { readSpecialShifts, readWorkingShifts } from './shifts';
import { schedule } from 'node-cron';

export function destroyAllCronJobs(): void {
  state.isCronActivated = false;
  state.cronSchedules.forEach(schedule => schedule.destroy());
}

export function startAllCronJobs(): void {
  Object.keys(schedules).forEach(cron => {
    const action = schedules[cron];
    state.cronSchedules.push(
      schedule(cron, () => {
        readWorkingShifts();
        readSpecialShifts();
        action();
      }).start()
    );
  });

  state.isCronActivated = true;
  state.client.user.setActivity('Cron jobs.');
}

export function getAssistantsWithSpecialShiftByShift(shift: Shift): Assistant[] {
  return state.assistantsWorkingShifts
    .filter(workingShift => {
      const isMorningShift = workingShift.shift === shift;
      const isSpecialShift = state.assistantsSpecialShifts.some(
        specialShift =>
          specialShift.shift !== workingShift.shift &&
          specialShift.day === getTodayWeekday() &&
          specialShift.assistant.initial === workingShift.assistant.initial
      );

      if (isSpecialShift) {
        return state.assistantsSpecialShifts
          .filter(specialShift => specialShift.assistant.initial === workingShift.assistant.initial)
          .every(specialShift => specialShift.shift === shift);
      }

      return isMorningShift;
    })
    .map(workingShift => workingShift.assistant);
}

export function getTodayWeekday(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function mention(id: string): string {
  return `<@${id}>`;
}

export function mentionAll(assistants: Assistant[]): string[] {
  return assistants.map(ast => mention(ast.id));
}

export function separateWithSpace(array: string[]): string {
  return array.join(' ');
}
