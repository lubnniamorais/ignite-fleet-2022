import { useNavigation } from '@react-navigation/native';
import { useRealm, useUser } from '@realm/react';
import { useRef, useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';

import { Historic } from '../../lib/realm/schemas/History';

import { licensePlateValidate } from '../../utils/licensePlateValidate';

import { Container, Content } from './styles';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { goBack } = useNavigation();

  // Acesso ao banco de dados
  const realm = useRealm();

  // Obtendo o usuário
  const user = useUser();

  // Criando refs para os inputs, onde a tipagem é um TextInput
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a plca corretado veículo'
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

  return (
    <Container>
      <Header title='Saída' />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
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
