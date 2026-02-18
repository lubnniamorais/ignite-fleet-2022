import { createRealmContext } from '@realm/react';
import { Coords } from './schemas/Coords';
import { Historic } from './schemas/History';

// const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
//   type: Realm.OpenRealmBehaviorType.OpenImmediately,
// };

// export const syncConfig: any = {
//   // Determinamos aqui o tipo de sincronização
//   flexible: true,
//   newRealmFileBehavior: realmAccessBehavior,
//   existingRealmFileBehavior: realmAccessBehavior,
// };

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic, Coords],

    // ✅ Versão do schema para controle de migrações locais
    schemaVersion: 1,
  });
