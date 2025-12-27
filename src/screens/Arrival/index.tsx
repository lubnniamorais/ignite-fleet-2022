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

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

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

  function handleArrivalRegister() {
    try {
      if (!historic) {
        Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
        return;
      }

      // Aqui garantimos que historic não é null
      if (historic) {
        realm.write(() => {
          historic.status = 'arrival';
          historic.updated_at = new Date();
        });

        Alert.alert('Chegada', 'Chegada registrada com sucesso.');
        goBack();
      } else {
        Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo');
    }
  }

  return (
    <Container>
      <Header title={title} />
      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={XIcon} onPress={handleRemoveVehicleUsage} />

          <Button title='Registrar chegada' onPress={handleArrivalRegister} />
        </Footer>
      )}
    </Container>
  );
}
