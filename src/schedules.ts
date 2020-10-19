export default {
  '0 6 * * mon-sat': 'Bangun',
  '20 7 * * 1': 'Rectorate',
  '50 6 * * mon-sat': 'Shift pagi clock in',
  '50 10 * * mon-sat': 'Shift malam clock in',
  '0 15 * * mon-fri': 'Shift malam clock out',
  '0 19 * * mon-fri': 'Shift pagi clock out',
  '0 13 * * sat': 'Shift pagi clock out',
  '0 17 * * sat': 'Shift malam clock out',
  '0 21 * * sat': 'Eval Angkatan',
};
