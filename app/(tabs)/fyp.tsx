import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAppStore } from '../../context/AppContext';
import { FolderGit2, Plus, CheckCircle2, Clock, Circle } from 'lucide-react-native';

export default function FYPScreen() {
  const { fypMilestones, addFYPMilestone } = useAppStore();
  const [newTitle, setNewTitle] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const completedCount = fypMilestones.filter((m) => m.status === 'completed').length;
  const totalCount = fypMilestones.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddMilestone = () => {
    if (newTitle.trim()) {
      addFYPMilestone(newTitle.trim(), 'Day 80');
      setNewTitle('');
      setShowAdd(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Final-Year Project Workspace</Text>
        <Text style={styles.headerSubtitle}>Track capstone milestones & daily project focus</Text>
      </View>

      {/* FYP Progress Header */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FolderGit2 size={24} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Campus Placement Portal</Text>
        </View>

        <Text style={styles.projectDesc}>
          Full-Stack PERN & Java microservices capstone project configured for your 90-day roadmap.
        </Text>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Overall Project Progress</Text>
          <Text style={styles.progressVal}>{Math.round(progressPct)}%</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      {/* Milestone Board Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Milestones & Deliverables</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(!showAdd)}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder="New Milestone Title..."
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddMilestone}>
            <Text style={styles.saveBtnText}>Save Milestone</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Milestones List */}
      <View style={styles.milestoneList}>
        {fypMilestones.map((m) => (
          <View key={m.id} style={styles.milestoneItem}>
            <View style={styles.mIcon}>
              {m.status === 'completed' ? (
                <CheckCircle2 size={22} color="#10B981" />
              ) : m.status === 'in_progress' ? (
                <Clock size={22} color="#F59E0B" />
              ) : (
                <Circle size={22} color="#9CA3AF" />
              )}
            </View>

            <View style={styles.mContent}>
              <Text style={styles.mTitle}>{m.title}</Text>
              <Text style={styles.mMeta}>
                Due: {m.dueDate} • {m.completedTasksCount}/{m.tasksCount} Tasks Complete
              </Text>
            </View>

            <View style={[styles.statusBadge, m.status === 'completed' && styles.statusCompleted]}>
              <Text style={styles.statusText}>{m.status.replace('_', ' ')}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 110,
    backgroundColor: '#F5EBF0',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#12131A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  projectDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#12131A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#12131A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 10,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  milestoneList: {
    gap: 12,
  },
  milestoneItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mIcon: {},
  mContent: {
    flex: 1,
  },
  mTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  mMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'capitalize',
  },
});
