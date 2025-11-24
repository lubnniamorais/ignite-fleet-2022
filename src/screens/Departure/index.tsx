import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Container, Content } from './styles';

export function Departure() {
  // Criando refs para os inputs, onde a tipagem é um TextInput
  const descriptionRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    console.log('Ok');
  }

  return (
    <Container>
      <Header title='Saída' />

      <Content>
        <LicensePlateInput
          label='Placa do veículo'
          placeholder='ABC-1234'
          onSubmitEditing={() => descriptionRef.current?.focus()} // Aqui vamos colocar o foco no input de finalidade
          returnKeyType='next' // Mudando o ícone do teclado
        />

        <TextAreaInput
          ref={descriptionRef}
          label='Finalidade'
          placeholder='Vou utilizar o veículo para...'
          onSubmitEditing={handleDepartureRegister}
          returnKeyType='send'
          submitBehavior='submit' // Propriedade que tem o mesmo efeito de enviar do botão
        />

        <Button title='Registrar saída' onPress={handleDepartureRegister} />
      </Content>
    </Container>
  );
}
