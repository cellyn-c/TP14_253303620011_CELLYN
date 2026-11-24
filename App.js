import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIORITIES = [
  { label: 'Rendah', value: 'Rendah', color: '#16A34A', background: '#DCFCE7' },
  { label: 'Sedang', value: 'Sedang', color: '#D97706', background: '#FEF3C7' },
  { label: 'Tinggi', value: 'Tinggi', color: '#DC2626', background: '#FEE2E2' },
];

export default function App() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('Sedang');
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [errorMessage, setErrorMessage] = useState('');

  const completedCount = tasks.filter((task) => task.completed).length;

  const filteredTasks = useMemo(() => {
    if (selectedFilter === 'Aktif') return tasks.filter((task) => !task.completed);
    if (selectedFilter === 'Selesai') return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, selectedFilter]);

  const addTask = () => {
    const cleanTitle = taskInput.trim();

    if (!cleanTitle) {
      setErrorMessage('Judul tugas tidak boleh kosong. Silakan isi terlebih dahulu.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: cleanTitle,
      priority: selectedPriority,
      completed: false,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setTaskInput('');
    setErrorMessage('');
    setSelectedPriority('Sedang');
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    Alert.alert('Hapus Tugas', 'Yakin ingin menghapus tugas ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () =>
          setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId)),
      },
    ]);
  };

  const getPriorityStyle = (priority) =>
    PRIORITIES.find((item) => item.value === priority) || PRIORITIES[1];

  const renderTask = ({ item }) => {
    const priorityStyle = getPriorityStyle(item.priority);

    return (
      <View style={styles.taskCard}>
        <TouchableOpacity
          style={[styles.checkButton, item.completed && styles.checkButtonDone]}
          onPress={() => toggleTask(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.checkText}>{item.completed ? '✓' : ''}</Text>
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.completed && styles.completedTitle]}>
            {item.title}
          </Text>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.background }]}>
              <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                {item.priority}
              </Text>
            </View>
            <Text style={styles.statusText}>{item.completed ? 'Selesai' : 'Belum selesai'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>MY DAILY PLANNER</Text>
            <Text style={styles.heading}>MyTaskList</Text>
            <Text style={styles.subtitle}>Atur tugasmu, selesaikan harimu.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✓</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>Progress tugas</Text>
              <Text style={styles.progressNumber}>
                {completedCount} <Text style={styles.progressOf}>dari {tasks.length} selesai</Text>
              </Text>
            </View>
            <Text style={styles.progressPercent}>
              {tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Tambah tugas baru</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Kerjakan tugas Pemrograman Mobile"
            placeholderTextColor="#9CA3AF"
            value={taskInput}
            onChangeText={(value) => {
              setTaskInput(value);
              if (errorMessage) setErrorMessage('');
            }}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Text style={styles.priorityLabel}>Prioritas tugas</Text>
          <View style={styles.priorityOptions}>
            {PRIORITIES.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityOption,
                  selectedPriority === priority.value && styles.priorityOptionSelected,
                ]}
                onPress={() => setSelectedPriority(priority.value)}
              >
                <Text
                  style={[
                    styles.priorityOptionText,
                    selectedPriority === priority.value && styles.priorityOptionTextSelected,
                  ]}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addTask} activeOpacity={0.85}>
            <Text style={styles.addButtonText}>＋  Tambahkan Tugas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>Daftar tugas</Text>
            <Text style={styles.listSubtitle}>{tasks.length} tugas tercatat</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {['Semua', 'Aktif', 'Selesai'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>
                {tasks.length === 0 ? 'Belum ada tugas' : 'Tidak ada tugas di kategori ini'}
              </Text>
              <Text style={styles.emptyDescription}>
                {tasks.length === 0
                  ? 'Tambahkan tugas pertamamu melalui form di atas.'
                  : 'Coba pilih filter yang lain.'}
              </Text>
            </View>
          }
        />
        <Text style={styles.footer}>Tetap produktif, satu tugas setiap saat ✨</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 24 : 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  greeting: { color: '#64748B', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  heading: { color: '#172554', fontSize: 29, fontWeight: '800', marginTop: 3 },
  subtitle: { color: '#64748B', fontSize: 12, marginTop: 4 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
  headerIconText: { color: '#FFFFFF', fontSize: 25, fontWeight: '800' },
  progressCard: { backgroundColor: '#312E81', padding: 17, borderRadius: 18, marginBottom: 15 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: '#C7D2FE', fontSize: 12 },
  progressNumber: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 4 },
  progressOf: { color: '#C7D2FE', fontSize: 12, fontWeight: '500' },
  progressPercent: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  progressTrack: { height: 7, backgroundColor: '#5551A4', borderRadius: 10, marginTop: 14, overflow: 'hidden' },
  progressFill: { height: 7, backgroundColor: '#A5F3FC', borderRadius: 10 },
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, marginBottom: 17, borderWidth: 1, borderColor: '#E8ECF4' },
  sectionTitle: { color: '#1E293B', fontSize: 16, fontWeight: '800' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 13, color: '#1E293B', marginTop: 12 },
  errorText: { color: '#DC2626', fontSize: 11, marginTop: 7 },
  priorityLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginTop: 13, marginBottom: 8 },
  priorityOptions: { flexDirection: 'row', gap: 8 },
  priorityOption: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  priorityOptionSelected: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  priorityOptionText: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  priorityOptionTextSelected: { color: '#4338CA' },
  addButton: { backgroundColor: '#4F46E5', paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 14 },
  addButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listSubtitle: { color: '#94A3B8', fontSize: 11, marginTop: 3 },
  filterRow: { flexDirection: 'row', backgroundColor: '#E9EDF5', borderRadius: 12, padding: 4, marginBottom: 10 },
  filterButton: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 9 },
  filterButtonActive: { backgroundColor: '#FFFFFF' },
  filterText: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  filterTextActive: { color: '#4338CA' },
  listContent: { paddingBottom: 10, flexGrow: 1 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 9, borderWidth: 1, borderColor: '#E8ECF4' },
  checkButton: { width: 25, height: 25, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkButtonDone: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  checkText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  taskInfo: { flex: 1 },
  taskTitle: { color: '#1E293B', fontSize: 12, fontWeight: '700' },
  completedTitle: { color: '#94A3B8', textDecorationLine: 'line-through' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 7 },
  priorityBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 9, fontWeight: '800' },
  statusText: { color: '#94A3B8', fontSize: 9 },
  deleteButton: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 8, backgroundColor: '#FEF2F2', marginLeft: 7 },
  deleteText: { color: '#DC2626', fontSize: 10, fontWeight: '800' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28, paddingHorizontal: 15 },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyTitle: { color: '#334155', fontSize: 14, fontWeight: '800' },
  emptyDescription: { color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 5, lineHeight: 17 },
  footer: { textAlign: 'center', color: '#A1A1AA', fontSize: 10, paddingVertical: 8 },
});
