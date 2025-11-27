import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { Container, Content } from './styles';

const keyboardAvoidingViewBehavior =
  Platform.OS === 'android' ? 'height' : 'position';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  // Criando refs para os inputs, onde a tipagem é um TextInput
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    if (!licensePlateValidate(licensePlate)) {
      licensePlateRef.current?.focus();
      return Alert.alert(
        'Placa inválida',
        'A placa é inválida. Por favor, informe a plca corretado veículo'
      );
    }
  }

  return (
    <Container>
      <Header title='Saída' />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
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

            <Button title='Registrar saída' onPress={handleDepartureRegister} />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
