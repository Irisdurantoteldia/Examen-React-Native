import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';

let taskIdCounter = 4; // Comença amb el 4, per exemple, si ja tens tasques amb ID 1, 2, 3.

const TaskListScreen = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Comprar menjar', date: '2024-11-20', completed: false },
    { id: '2', title: 'Estudiar React Native', date: '2024-11-21', completed: false },
    { id: '3', title: 'Fer exercici', date: '2024-11-22', completed: false },
  ]);

  // Si la ruta conté una nova tasca o tasca editada, afegim o actualitzem la tasca
  useEffect(() => {
    if (route.params?.newTask) {
      // Si la tasca ve modificada, actualitzem la tasca existent
      if (route.params?.isEdit) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === route.params?.newTask.id ? route.params.newTask : task
          )
        );
      } else {
        // Si és una tasca nova, l'afegim
        setTasks((prevTasks) => [...prevTasks, route.params.newTask]);
      }
    }
  }, [route.params?.newTask, route.params?.isEdit]);

  // Funció per alternar el completat d'una tasca
  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Funció per eliminar una tasca amb confirmació
  const deleteTask = (id) => {
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
          style: 'destructive',
          onPress: () => {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
          },
        },
      ]
    );
  };

  // Funció per editar una tasca (obrir AddTask amb les dades de la tasca)
  const editTask = (task) => {
    navigation.navigate('AddTask', { task, isEdit: true });
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: item.completed ? 'red' : 'green' },
          ]}
        />
      </TouchableOpacity>
      <View style={styles.taskDetails}>
        <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
        <Text style={styles.taskDate}>{item.date}</Text>
      </View>
      <View style={styles.taskActions}>
        <Button title="Edit" onPress={() => editTask(item)} />
        <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Llistat de Tasques</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask', { isEdit: false })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskDate: {
    fontSize: 12,
    color: 'gray',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
