import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, ProjectItem } from '../../context/AppContext';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  Trash2,
  ChevronRight,
  X,
  Layers,
  Calendar,
} from 'lucide-react-native';

export default function ProjectsScreen() {
  const {
    projects,
    addProject,
    addProjectTodo,
    toggleProjectTodo,
    deleteProjectTodo,
    updateProjectStatus,
  } = useAppStore();

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // New Project Form State
  const [projName, setProjName] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projDesc, setProjDesc] = useState('');

  // New Todo Form State inside Project Detail Modal
  const [todoTitle, setTodoTitle] = useState('');

  const handleCreateProject = () => {
    if (!projName.trim()) {
      Alert.alert('Project Name Required', 'Please enter a name for your project.');
      return;
    }
    addProject(projName.trim(), projCategory.trim(), projDesc.trim());
    setProjName('');
    setProjCategory('');
    setProjDesc('');
    setShowAddProjectModal(false);
  };

  const handleAddTodoToSelected = () => {
    if (!selectedProject || !todoTitle.trim()) return;
    addProjectTodo(selectedProject.id, todoTitle.trim());
    setTodoTitle('');

    // Refresh selectedProject state from store
    const updatedProj = projects.find((p) => p.id === selectedProject.id);
    if (updatedProj) setSelectedProject(updatedProj);
  };

  // Keep selected project in sync with store state updates
  const activeSelectedProject = selectedProject
    ? projects.find((p) => p.id === selectedProject.id) || selectedProject
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Dark Banner */}
      <View style={styles.darkHeaderBanner}>
        <View style={styles.headerTitleRow}>
          <Layers size={22} color="#EAB308" />
          <Text style={styles.darkHeaderTitle}>Projects & Capstone Hub</Text>
        </View>

        <TouchableOpacity style={styles.iconCircleDark} onPress={() => setShowAddProjectModal(true)}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Intro Subtitle */}
        <Text style={styles.subText}>
          Organize your major projects, track milestones, and manage daily to-dos with precise timestamps.
        </Text>

        {/* Projects Cards List */}
        <View style={styles.projectsList}>
          {projects.map((proj) => {
            const completedCount = proj.todos.filter((t) => t.isCompleted).length;
            const totalCount = proj.todos.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <TouchableOpacity
                key={proj.id}
                style={styles.projectCard}
                activeOpacity={0.88}
                onPress={() => setSelectedProject(proj)}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.folderBadge}>
                    <FolderGit2 size={22} color="#12131A" />
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.projectCategory}>{proj.category}</Text>
                    <Text style={styles.projectName}>{proj.name}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusTag,
                      proj.status === 'completed' && styles.statusCompleted,
                      proj.status === 'in_progress' && styles.statusInProgress,
                    ]}
                  >
                    <Text style={styles.statusTagText}>
                      {proj.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.projectDesc} numberOfLines={2}>
                  {proj.description || 'No detailed description provided.'}
                </Text>

                {/* Timestamps Row */}
                <View style={styles.timestampRow}>
                  <Text style={styles.timestampText}>
                    📅 Created: {proj.createdAt}
                  </Text>
                </View>

                {/* To-Do Progress Bar */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeaderRow}>
                    <Text style={styles.progressLabel}>
                      Project Tasks ({completedCount}/{totalCount})
                    </Text>
                    <Text style={styles.progressPct}>{pct}%</Text>
                  </View>

                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                  </View>
                </View>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.openDetailText}>Tap to manage tasks & status</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Add New Project Modal */}
      <Modal visible={showAddProjectModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Project</Text>
              <TouchableOpacity onPress={() => setShowAddProjectModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Project Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. AI Mock Interviewer"
                value={projName}
                onChangeText={setProjName}
              />

              <Text style={styles.inputLabel}>Category / Tech Stack</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Next.js, Python FastAPI"
                value={projCategory}
                onChangeText={setProjCategory}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, { height: 80, paddingTop: 10 }]}
                placeholder="Key features and objectives of this project..."
                multiline
                value={projDesc}
                onChangeText={setProjDesc}
              />

              <TouchableOpacity style={styles.createBtn} onPress={handleCreateProject}>
                <Text style={styles.createBtnText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Project Detail & Timestamped To-Dos Modal */}
      <Modal visible={!!activeSelectedProject} transparent animationType="slide">
        {activeSelectedProject && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, styles.detailModalCard]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalCategory}>{activeSelectedProject.category}</Text>
                  <Text style={styles.modalTitle}>{activeSelectedProject.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedProject(null)}>
                  <X size={24} color="#12131A" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                <Text style={styles.modalDesc}>{activeSelectedProject.description}</Text>

                {/* Timestamps Meta Box */}
                <View style={styles.metaBox}>
                  <Text style={styles.metaBoxItem}>
                    ➕ <Text style={{ fontWeight: '700' }}>Added:</Text> {activeSelectedProject.createdAt}
                  </Text>
                  <Text style={styles.metaBoxItem}>
                    🔄 <Text style={{ fontWeight: '700' }}>Last Updated:</Text> {activeSelectedProject.updatedAt}
                  </Text>
                </View>

                {/* Status Toggle Row */}
                <Text style={styles.inputLabel}>Update Project Status</Text>
                <View style={styles.statusToggleRow}>
                  {(['planned', 'in_progress', 'completed'] as const).map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusBtnPill,
                        activeSelectedProject.status === st && styles.statusBtnPillActive,
                      ]}
                      onPress={() => updateProjectStatus(activeSelectedProject.id, st)}
                    >
                      <Text
                        style={[
                          styles.statusBtnText,
                          activeSelectedProject.status === st && styles.statusBtnTextActive,
                        ]}
                      >
                        {st.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Add New Project To-Do */}
                <Text style={[styles.inputLabel, { marginTop: 14 }]}>Project To-Do List</Text>
                <View style={styles.addTodoRow}>
                  <TextInput
                    style={styles.addTodoInput}
                    placeholder="e.g. Complete API documentation"
                    value={todoTitle}
                    onChangeText={setTodoTitle}
                  />
                  <TouchableOpacity style={styles.addTodoBtn} onPress={handleAddTodoToSelected}>
                    <Plus size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* List of Timestamped Project To-Dos */}
                <View style={styles.todoList}>
                  {activeSelectedProject.todos.length === 0 ? (
                    <Text style={styles.emptyTodoText}>No to-dos added yet for this project.</Text>
                  ) : (
                    activeSelectedProject.todos.map((todo) => (
                      <View key={todo.id} style={styles.todoItem}>
                        <TouchableOpacity
                          style={styles.todoCheckBtn}
                          onPress={() => toggleProjectTodo(activeSelectedProject.id, todo.id)}
                        >
                          {todo.isCompleted ? (
                            <CheckCircle2 size={22} color="#10B981" fill="#10B981" />
                          ) : (
                            <Circle size={22} color="#9CA3AF" />
                          )}
                        </TouchableOpacity>

                        <View style={styles.todoContent}>
                          <Text style={[styles.todoTitle, todo.isCompleted && styles.todoTitleDone]}>
                            {todo.title}
                          </Text>
                          <Text style={styles.todoTimestamp}>
                            Created: {todo.createdAt}
                            {todo.isCompleted && todo.completedAt ? ` • Done: ${todo.completedAt}` : ''}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => deleteProjectTodo(activeSelectedProject.id, todo.id)}
                          style={{ padding: 4 }}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EBF0',
  },
  darkHeaderBanner: {
    backgroundColor: '#12131A',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  iconCircleDark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 110,
  },
  subText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  projectsList: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  folderBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  projectCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#12131A',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'capitalize',
  },
  projectDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  timestampRow: {
    marginBottom: 12,
  },
  timestampText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EAB308',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 4,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  openDetailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '90%',
  },
  detailModalCard: {
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#12131A',
  },
  modalBody: {
    gap: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#12131A',
    marginBottom: 10,
  },
  createBtn: {
    backgroundColor: '#12131A',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaBoxItem: {
    fontSize: 12,
    color: '#64748B',
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statusBtnPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  statusBtnPillActive: {
    backgroundColor: '#12131A',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  statusBtnTextActive: {
    color: '#EAB308',
  },
  addTodoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addTodoInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
  },
  addTodoBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoList: {
    gap: 10,
    paddingBottom: 40,
  },
  emptyTodoText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  todoItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  todoCheckBtn: {},
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  todoTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  todoTimestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
});

