import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTask = ({ navigation, route }) => {
    const { task, isEdit } = route.params || {}; // Si estem en mode edició, agafem la tasca existent.
    const [title, setTitle] = useState(isEdit ? task.title : '');
    const [date, setDate] = useState(isEdit ? new Date(task.date) : null); // Si no és editant, inicialitza com a null
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isDateChecked, setIsDateChecked] = useState(!!date); // Si hi ha data, el checkbox es marca

    const generateUniqueId = () => {
        return String(new Date().getTime()); // Generem un ID únic basat en el temps actual
    };

    const handleSaveTask = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'El títol no pot estar buit, és obligatori.');
            return;
        }

        const newTask = {
            id: isEdit ? task.id : generateUniqueId(), // Si estem editant, mantenim l'ID
            title,
            date: isDateChecked ? date.toISOString().split('T')[0] : '', // Si no està marcat, deixem la data en blanc
            completed: false,
        };

        // Tornem a TaskListScreen amb la nova tasca o la tasca editada
        navigation.navigate('TaskListScreen', { newTask, isEdit });
    };

    const handleDateButtonPress = () => {
        if (isDateChecked) {
            // Si el switch està marcat, mostra el selector de data
            setShowDatePicker(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Títol de la tasca</Text>
            <TextInput
                style={styles.input}
                placeholder="Escriu el títol"
                value={title}
                onChangeText={setTitle}
            />

            {/* Switch per marcar si la tasca té data límit */}
            <View style={styles.checkboxContainer}>
                <Switch
                    value={isDateChecked}
                    onValueChange={(newValue) => setIsDateChecked(newValue)}
                    style={styles.checkbox}
                />
            </View>
            <Text style={styles.label}>Data límit</Text>

            {/* Si està marcat, es mostra el selector de data */}
            {isDateChecked && (
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={handleDateButtonPress}
                >
                    <Text style={styles.dateButtonText}>
                        {date ? `Data: ${date.toISOString().split('T')[0]}` : 'Selecciona una data límit'}
                    </Text>
                </TouchableOpacity>
            )}

            {showDatePicker && isDateChecked && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                <Text style={styles.saveButtonText}>Guardar Tasca</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 20,
    },
    checkbox: {
        marginLeft: 10,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#4CAF50', // Verd si té data
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddTask;
