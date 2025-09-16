import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type Health = { ok: boolean; ts: string } | null;

export default function App() {
  const [data, setData] = useState<Health>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = (Constants.expoConfig?.extra as any)?.apiUrl as string | undefined;
    if (!apiUrl) {
      setError('API_URL not set');
      return;
    }
    fetch(`${apiUrl}/api/health`)
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Expo Mobile</Text>
      {error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : data ? (
        <Text>{`ok: ${String(data.ok)}, ts: ${data.ts}`}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}


