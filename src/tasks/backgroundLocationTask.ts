import {
  Accuracy,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// Exportamos a tarefa, pois iremos aproveitar em outros lugares
// Uma boa prática para criar constantes de configuração é criar o nome em MAIÚSCULO
export const BACKGROUND_TASK_NAME = 'location-tracking';

// Aqui estamos definindo a tarefa
TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    const { coords, timestamp } = data.locations[0];

    const currentLocation = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: timestamp,
    };

    console.log(currentLocation);
  } catch (error) {
    console.log(error);
  }
});

export async function startLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    // Se a tarefa ja foi iniciada, vamos parar ela
    if (hasStarted) {
      await stopLocationTask();
    }

    // A função startLocationUpdateAsync fica obtendo a atualização da locatização do usuário
    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 1000,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    }
  } catch (error) {
    console.log(error);
  }
}
