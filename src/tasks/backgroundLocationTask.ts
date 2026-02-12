import * as TaskManager from 'expo-task-manager';

// Exportamos a tarefa, pois iremos aproveitar em outros lugares
// Uma boa prática para criar constantes de configuração é criar o nome em MAIÚSCULO
export const BACKGROUND_TASK_NAME = 'location-tracking';

// Aqui estamos definindo a tarefa
TaskManager.defineTask(BACKGROUND_TASK_NAME, ({ data, error }: any) => {
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
