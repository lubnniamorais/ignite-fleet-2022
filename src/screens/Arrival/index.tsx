import { useNavigation, useRoute } from '@react-navigation/native';
import { XIcon } from 'phosphor-react-native';
import { Alert } from 'react-native';
import { BSON } from 'realm';

import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';

import { useObject, useRealm } from '../../lib/realm';
import { Historic } from '../../lib/realm/schemas/History';

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;
  const realm = useRealm();
  const { goBack } = useNavigation();

  // const historic = useObject('Historic', id);
  const historic = useObject<Historic>('Historic', new BSON.UUID(id));

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ]);
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    goBack();
  }

  return (
    <Container>
      <Header title='Chegada' />
      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>

        <Footer>
          <ButtonIcon icon={XIcon} onPress={handleRemoveVehicleUsage} />

          <Button title='Registrar chegada' />
        </Footer>
      </Content>
    </Container>
  );
}
