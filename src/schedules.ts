import assistants from './assistants';
import Shift from './models/shift';
import state from './state';
import { getAssistantsWithSpecialShiftByShift, mention, mentionAll, separateWithSpace } from './utilities';

export default {
  '0 6 * * mon-sat': () => {
    const { channel } = state;
    channel.send(`Bangun. ${separateWithSpace(mentionAll(assistants))}`);
  },

  '20 7 * * 1': () => {
    const { channel } = state;
    channel.send(`Rectorate. ${separateWithSpace(mentionAll(assistants))}`);
  },

  '50 6 * * mon-sat': () => {
    const { channel } = state;
    channel.send(
      `Shift pagi clock in. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.MORNING)))}`
    );
  },

  '50 10 * * mon-sat': () => {
    const { channel } = state;
    channel.send(
      `Shift malam clock in. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.NIGHT)))}`
    );
  },

  '0 15 * * mon-fri': () => {
    const { channel } = state;
    channel.send(
      `Shift pagi clock out. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.MORNING)))}`
    );
  },

  '0 19 * * mon-fri': () => {
    const { channel } = state;
    channel.send(
      `Shift malam clock out. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.MORNING)))}`
    );
  },

  '0 13 * * sat': () => {
    const { channel } = state;
    channel.send(
      `Shift pagi clock out. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.MORNING)))}`
    );
  },

  '0 17 * * sat': () => {
    const { channel } = state;
    channel.send(
      `Shift malam clock out. ${separateWithSpace(mentionAll(getAssistantsWithSpecialShiftByShift(Shift.MORNING)))}`
    );
  },

  '0 21 * * sat': () => {
    const { channel } = state;
    channel.send(`Eval Angkatan. ${separateWithSpace(mentionAll(assistants))}`);
  },
};
