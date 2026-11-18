import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import app from './firebase';

const EMULATOR_PORT = 5001;

const functions = getFunctions(app);

if (import.meta.env.VITE_FUNCTIONS_EMULATOR) {
  connectFunctionsEmulator(functions, 'localhost', EMULATOR_PORT);
}

export default functions;
