import { PowerIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import theme from '../../theme';
import { Container, Greeting, Message, Name, Picture } from './styles';

export function HomeHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao obter usuário:', error);
        return;
      }

      setUser(data.user);
    }

    loadUser();
  }, []);

  return (
    <Container>
      <Picture
        source={{ uri: user?.user_metadata.avatar_url }}
        placeholder='L184i9ofa}of00ayjtay~qj[f6ju'
      />

      <Greeting>
        <Message>Ola, </Message>

        <Name>{user.user_metadata.full_name}</Name>
      </Greeting>

      <TouchableOpacity>
        <PowerIcon size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
