import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../Lib/supabaseClient';

export default function TestSupabase() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('Paciente').select('user_id,nombre,rut').limit(10);
        if (error) setErr(error.message);
        else setRows(data || []);
      } catch (e: any) {
        setErr(String(e));
      }
    })();
  }, []);

  if (err) return <View style={{padding:20}}><Text>Error: {err}</Text></View>;
  return (
    <FlatList
      data={rows}
      keyExtractor={(i) => i.user_id || i.rut || Math.random().toString()}
      renderItem={({item}) => (
        <View style={{padding:12, borderBottomWidth:1, borderColor:'#eee'}}>
          <Text style={{fontWeight:'700'}}>{item.nombre}</Text>
          <Text>RUT: {item.rut}</Text>
          <Text>ID: {item.user_id}</Text>
        </View>
      )}
      ListEmptyComponent={<View style={{padding:20}}><Text>No hay resultados</Text></View>}
    />
  );
}
