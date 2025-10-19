import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { Session } from '@supabase/supabase-js';

import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import { Loading } from './src/components/Loading';
import { supabase } from './src/lib/supabase';
import { Home } from './src/screens/Home';
import { SignIn } from './src/screens/SignIn';
import theme from './src/theme';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  useEffect(() => {
    // 🔹 1. Verifica sessão existente no cache local
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setIsLoading(false);
    });

    // 🔹 2. Escuta mudanças de autenticação (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Se as fontes não estiverem carregadas vai aparecer um loading
  if (!fontsLoaded || isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      {session ? <Home /> : <SignIn />}
    </ThemeProvider>
  );
}
