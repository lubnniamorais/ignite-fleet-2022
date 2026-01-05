import 'react-native-get-random-values';
import './src/lib/dayjs';

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { Session } from '@supabase/supabase-js';
import { WifiSlashIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { Loading } from './src/components/Loading';
import { TopMessage } from './src/components/TopMessage';
import { RealmProvider } from './src/lib/realm';
import { supabase } from './src/lib/supabase';
import { Routes } from './src/routes';
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
      <SafeAreaProvider
        style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
      >
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />

        <TopMessage title='Você está off-line.' icon={WifiSlashIcon} />

        {session ? (
          <RealmProvider>
            <Routes />
          </RealmProvider>
        ) : (
          <SignIn />
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
