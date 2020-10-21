import Shift from './shift';
import Assistant from './assistant';

export default interface WorkingShift {
  assistant: Assistant;
  shift: Shift;
}
