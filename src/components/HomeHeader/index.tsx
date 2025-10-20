import { Container, Greeting, Message, Name } from './styles';

export function HomeHeader() {
  return (
    <Container>
      <Greeting>
        <Message>Ola, </Message>

        <Name>John Doe</Name>
      </Greeting>
    </Container>
  );
}
