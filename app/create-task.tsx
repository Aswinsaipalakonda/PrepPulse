import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../context/AppContext';
import { X, Check, Calendar, Clock, Folder, Plus } from 'lucide-react-native';

export default function CreateTaskScreen() {
  const router = useRouter();
  const { currentDay, addNewCustomTask } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(`Day ${currentDay}`);
  const [dueTime, setDueTime] = useState('10:00 AM');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [project, setProject] = useState('Placement Agenda');
  const [track, setTrack] = useState<'dsa' | 'dev' | 'aptitude' | 'interview' | 'fyp'>('dev');

  const [tags, setTags] = useState(['Design', 'UI/UX', 'Work']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowAddTag(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your task.');
      return;
    }

    addNewCustomTask(title.trim(), track);
    Alert.alert('Task Created 🎯', 'Your new task has been added successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
            <X size={20} color="#12131A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add New Task</Text>

          <TouchableOpacity style={styles.iconCircle} onPress={handleSave}>
            <Check size={20} color="#12131A" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          {/* Task Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Finish landing page design"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Design the new landing page for the product launch."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Due Date & Time */}
          <Text style={styles.label}>Due Date & time</Text>
          <View style={styles.rowGroup}>
            <View style={styles.pickerBox}>
              <Calendar size={16} color="#6B7280" />
              <TextInput
                style={styles.pickerInput}
                value={dueDate}
                onChangeText={setDueDate}
              />
            </View>
            <View style={styles.pickerBox}>
              <Clock size={16} color="#6B7280" />
              <TextInput
                style={styles.pickerInput}
                value={dueTime}
                onChangeText={setDueTime}
              />
            </View>
          </View>

          {/* Priority */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityPill,
                  p === 'low' && styles.priorityLow,
                  p === 'medium' && styles.priorityMed,
                  p === 'high' && styles.priorityHigh,
                  priority === p && styles.prioritySelected,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    p === 'low' && { color: '#15803D' },
                    p === 'medium' && { color: '#B45309' },
                    p === 'high' && { color: '#B91C1C' },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Project / Track */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Project Track</Text>
            <View style={styles.selectBox}>
              <Folder size={18} color="#8B5CF6" />
              <TextInput
                style={styles.selectInput}
                value={project}
                onChangeText={setProject}
              />
            </View>
          </View>

          {/* Tags */}
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagsRow}>
            {tags.map((t) => (
              <TouchableOpacity key={t} style={styles.tagChip} onPress={() => handleRemoveTag(t)}>
                <Text style={styles.tagText}>{t}  ×</Text>
              </TouchableOpacity>
            ))}

            {showAddTag ? (
              <View style={styles.addTagInputWrapper}>
                <TextInput
                  style={styles.addTagInput}
                  placeholder="New tag..."
                  value={newTagInput}
                  onChangeText={setNewTagInput}
                  onSubmitEditing={handleAddTag}
                  autoFocus
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.addTagBtn} onPress={() => setShowAddTag(true)}>
                <Plus size={14} color="#374151" />
                <Text style={styles.addTagText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Create Task Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
            <Text style={styles.submitBtnText}>Create Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EBF0',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  form: {
    paddingBottom: 40,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#12131A',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#12131A',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityPill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  priorityLow: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  priorityMed: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE047',
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  prioritySelected: {
    borderWidth: 2,
    borderColor: '#12131A',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '800',
  },
  selectBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#12131A',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338CA',
  },
  addTagBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  addTagInputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    justifyContent: 'center',
  },
  addTagInput: {
    fontSize: 13,
    width: 80,
  },
  submitBtn: {
    backgroundColor: '#12131A',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
