import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { db } from '../Firebase/FirebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]); // Tasques a mostrar

  // Carregar tasques de la base de dades
  const fetchTasks = async () => {
    try {
      const qCol = collection(db, 'Tasks');
      const tasksSnapshot = await getDocs(qCol);

      const tasksList = tasksSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.Title ? data.Title : 'Sense títol',
          date: data.Date ? data.Date.toDate().toLocaleDateString() : 'Data no disponible',
          completed: data.Completed !== undefined ? data.Completed : false,
        };
      });
      setTasks(tasksList);
    } catch (error) {
      console.error('Error al carregar les tasques:', error);
      Alert.alert('Error', 'No es poden carregar les tasques.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Funció per eliminar tasca
  const handleDelete = (id) => {
    Alert.alert(
      'Confirmació d\'eliminació',
      'Estàs segur que vols eliminar aquesta tasca?',
      [
        {
          text: 'Cancel·lar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Tasks', id));
              setTasks(tasks.filter(task => task.id !== id)); // Actualitza l'estat
              Alert.alert('Tasca eliminada', 'La tasca ha estat eliminada correctament.');
            } catch (error) {
              console.error('Error al eliminar la tasca:', error);
              Alert.alert('Error', 'No es pot eliminar la tasca.');
            }
          },
        },
      ]
    );
  };

  // Funció per actualitzar tasca (completar o desmarcar com a completada)
  const handleUpdate = async (id, completed) => {
    try {
      const taskRef = doc(db, 'Tasks', id);
      await updateDoc(taskRef, {
        Completed: !completed,
      });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));
    } catch (error) {
      console.error('Error al actualitzar la tasca:', error);
      Alert.alert('Error', 'No es pot actualitzar la tasca.');
    }
  };

  // Actualitza la llista de tasques després de crear o editar
  const updateTaskList = (task) => {
    setTasks(prevTasks => {
      // Si la tasca ja existeix, la substituïm per la tasca actualitzada
      const updatedTasks = prevTasks.map(t => t.id === task.id ? task : t);
      // Si la tasca és nova, l'afegim
      if (!task.id) {
        updatedTasks.push(task);
      }
      return updatedTasks;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Llista de Tasques</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskDetails}>
              <Switch
                value={item.completed}
                onValueChange={() => handleUpdate(item.id, item.completed)}
                style={styles.switch}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                  {item.title}
                </Text>
                <Text style={[styles.taskDate, item.completed && styles.completedText]}>
                  {item.date}
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {/* Botó Editar */}
              <TouchableOpacity onPress={() => navigation.navigate('AddTask', { task: item, updateTaskList })} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              {/* Botó Eliminar */}
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Botó Afegir Tasca */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask', { updateTaskList })} 
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,  // Mida una mica més petita
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  taskCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  switch: {
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  taskTitle: {
    fontSize: 16,  // Mida del títol més petita
    fontWeight: '600',
    color: '#333',
  },
  taskDate: {
    fontSize: 14,
    color: '#888',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  addButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
});
