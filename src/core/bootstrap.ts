import { config } from 'dotenv';
import { readSpecialShifts, readWorkingShifts } from './shifts-reader';

/**
 * Read environment variables from .env file
 */

config();

/**
 * Read 20-2 assistant's working and special schedules.
 */

readWorkingShifts();
readSpecialShifts();
