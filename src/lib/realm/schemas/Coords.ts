import { Realm } from '@realm/react';

export type CoordsSchemaProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

// Passamos a própria classe como tipagem do Object
// Adicionamos as propriedades latitude, longitude e timestamp no escopo global
// da nossa classe
export class Coords extends Realm.Object<Coords> {
  // A exclamação significa dizer que teremos essas propriedades disponíveis
  latitude!: number;
  longitude!: number;
  timestamp!: number;

  // O método estático é para gerar o registro no banco de dados
  static generate({ latitude, longitude, timestamp }: CoordsSchemaProps) {
    return {
      latitude,
      longitude,
      timestamp,
    };
  }

  static schema = {
    // Nome da coleção
    name: 'Coords',

    // Essa propriedade siginifica dizer que esse schema será utilizado dentro de outro
    // schema, ou seja, dentro do schema Historic
    embedded: true,
    properties: {
      latitude: 'float',
      longitude: 'float',
      timestamp: 'float',
    },
  };
}
