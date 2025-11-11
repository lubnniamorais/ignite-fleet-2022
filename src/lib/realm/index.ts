import { createRealmContext } from '@realm/react';

import { Historic } from './schemas/History';

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  });
