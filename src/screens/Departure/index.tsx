import { useNavigation } from '@react-navigation/native';
import { useRealm, useUser } from '@realm/react';
import {
  LocationAccuracy,
  LocationSubscription,
  useForegroundPermissions,
  watchPositionAsync,
} from 'expo-location';
import { CarIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Historic } from '../../lib/realm/schemas/History';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { Container, Content, Message } from './styles';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  const { goBack } = useNavigation();

  // Acesso ao banco de dados
  const realm = useRealm();

  // Obtendo o usuário
  const user = useUser();

  // Criando refs para os inputs, onde a tipagem é um TextInput
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        getAddressLocation(location.coords)
          .then((address) => {
            // Retornando o endereço
            if (address) {
              setCurrentAddress(address);
            }
          })
          .finally(() => {
            setIsLoadingLocation(false);
          });
      }
    ).then((response) => {
      subscription = response;
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission]);

  // Se não tem permissão do usuário, então a mensagem alertando o usuário será exibida
  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title='Saida' />

        <Message>
          Você precisa permitir que o aplicativo tenha acesso à localização para
          utilizar essa funcionalidade. Por favor, acesse as configurações do
          seu dispositivo,para conceder essa permissão ao aplicativo.
        </Message>
      </Container>
    );
  }

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa correta do veículo'
        );
      }

      // Verificando se o campo de descrição está vazio
      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo.'
        );
      }

      setIsRegistering(true);

      // Função para realizar o cadastro no banco de dados
      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description: description.toUpperCase(),
          })
        );
      });

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!');
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Nao foi possivel registrar a saída do veículo');
      setIsRegistering(false);
    }
  }

  // Se demorar a aparecer o mapa de localização, então o Loading de carregamento
  // será exibido
  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title='Saída' />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            {currentAddress && (
              <LocationInfo
                icon={CarIcon}
                label='Localização atual'
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label='Placa do veículo'
              placeholder='ABC-1234'
              onSubmitEditing={() => descriptionRef.current?.focus()} // Aqui vamos colocar o foco no input de finalidade
              returnKeyType='next' // Mudando o ícone do teclado
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label='Finalidade'
              placeholder='Vou utilizar o veículo para...'
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              submitBehavior='submit' // Propriedade que tem o mesmo efeito de enviar do botão
              onChangeText={setDescription}
            />

            <Button
              title='Registrar saída'
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
