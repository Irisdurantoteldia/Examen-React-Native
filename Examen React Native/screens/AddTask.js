import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../Firebase/FirebaseConfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

export default function AddTaskScreen({ route, navigation }) {
  const { task, updateTaskList } = route.params || {};  // Si existeix la tasca, la rebem, si no, estem en mode d'afegir una tasca nova

  const [title, setTitle] = useState(task ? task.title : ''); // Carregar títol si existeix tasca
  const [date, setDate] = useState(task ? task.date : ''); // Carregar data si existeix tasca

  const handleSaveTask = async () => {
    if (title === '' || date === '') {
      Alert.alert('Error', 'El títol i la data són obligatoris');
      return;
    }

    try {
      if (task) {
        // Si la tasca existeix, actualitzem
        const taskRef = doc(db, 'Tasks', task.id);
        await updateDoc(taskRef, {
          Title: title,
          Date: new Date(date),
        });
        updateTaskList({ ...task, title, date });  // Actualitzar la tasca en la llista de tasques
      } else {
        // Si la tasca no existeix, afegim una nova tasca
        await addDoc(collection(db, 'Tasks'), {
          Title: title,
          Date: new Date(date),
          Completed: false,
        });
        updateTaskList({ id: new Date().toString(), title, date });  // Afegir nova tasca a la llista
      }

      navigation.goBack();  // Tornar a la llista de tasques
    } catch (error) {
      console.error('Error guardant la tasca:', error);
      Alert.alert('Error', 'No es pot guardar la tasca.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task ? 'Editar Tasca' : 'Afegir Tasca'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Títol"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Guardar" onPress={handleSaveTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
