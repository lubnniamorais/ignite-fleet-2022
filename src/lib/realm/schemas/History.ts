import { Realm } from '@realm/react';

// Utilizamos classes para criar o nosso schema

type GenerateProps = {
  user_id: string;
  license_plate: string;
  description: string;
};
export class Historic extends Realm.Object<Historic> {
  _id!: string;
  user_id!: string;
  license_plate!: string;
  description!: string;
  status!: string;
  created_at!: string;
  updated_at!: string

  static generate({ user_id, license_plate, description }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(), // Gerar um ID unico
      user_id,
      license_plate,
      description,
      status: 'departure', // Inicialmente o status é 'departure'
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  static schema = {
    // Nome da coleção
    name: 'Historic',
    // Chave primária
    primaryKey: '_id',

    // Definimos as propriedades do nosso banco
    properties: {
      // Utilizar com o '_' é o padrão do realmDB
      _id: 'uuid',
      user_id: {
        type: 'string',
        indexed: true,
      },
      license_plate: 'string',
      description: 'string',
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  };
}
