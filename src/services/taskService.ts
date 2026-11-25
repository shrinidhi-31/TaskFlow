import { supabase } from '../lib/supabaseClient';
import { Category, Priority, Task } from '../types';

export interface NewTaskPayload {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
}

/**
 * Format ISO date string into readable label (e.g. "Nov 25, 2026").
 */
function formatDateLabel(isoString?: string | null): string {
  if (!isoString) return 'Today';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Maps Supabase row to frontend Task model.
 */
export function mapRowToTask(row: any): Task {
  const isCompleted = Boolean(row.is_completed ?? row.completed);
  return {
    id: String(row.id),
    title: row.title || '',
    description: row.description || '',
    category: (row.category as Category) || 'Personal',
    priority: (row.priority as Priority) || 'Medium',
    dueDate: row.due_date || row.dueDate || '',
    dueTime: row.due_time || row.dueTime || undefined,
    completed: isCompleted,
    completedAt: isCompleted ? 'Completed' : undefined,
    createdAt: formatDateLabel(row.created_at || row.createdAt),
    userId: row.user_id || row.userId || undefined,
  };
}

export const taskService = {
  /**
   * Fetch all tasks for the currently authenticated user.
   */
  async fetchTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(mapRowToTask);
  },

  /**
   * Insert a new task associated with the given user_id.
   */
  async createTask(payload: NewTaskPayload, userId: string): Promise<Task> {
    const insertData: Record<string, any> = {
      user_id: userId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category,
      priority: payload.priority,
      due_date: payload.dueDate,
      is_completed: false,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapRowToTask(data);
  },

  /**
   * Update task fields by ID.
   */
  async updateTask(id: string, patch: Partial<Task>): Promise<Task> {
    const updateData: Record<string, any> = {};

    if (patch.title !== undefined) updateData.title = patch.title.trim();
    if (patch.description !== undefined) updateData.description = patch.description.trim();
    if (patch.category !== undefined) updateData.category = patch.category;
    if (patch.priority !== undefined) updateData.priority = patch.priority;
    if (patch.dueDate !== undefined) updateData.due_date = patch.dueDate;
    if (patch.completed !== undefined) updateData.is_completed = patch.completed;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapRowToTask(data);
  },

  /**
   * Delete a task by ID.
   */
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },
};
