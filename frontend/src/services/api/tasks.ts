/**
 * Task Management API Client
 * Handles all task-related API calls for DEV-012 Task Management feature
 */

import api from '../api'

export interface Task {
  id: string
  deal_id: string
  organization_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  stage_gate: string | null
  assignee_id: string | null
  due_date: string | null
  created_by: string
  created_at: string
  updated_at: string | null
  completed_at: string | null
}

export interface TaskCreate {
  title: string
  description?: string | null
  status?: Task['status']
  priority?: Task['priority']
  stage_gate?: string | null
  assignee_id?: string | null
  due_date?: string | null
}

export interface TaskUpdate {
  title?: string
  description?: string | null
  status?: Task['status']
  priority?: Task['priority']
  stage_gate?: string | null
  assignee_id?: string | null
  due_date?: string | null
  completed_at?: string | null
}

export interface TaskListResponse {
  total: number
  items: Task[]
}

export interface TaskTemplate {
  id: string
  organization_id: string
  name: string
  description: string | null
  tasks: TaskTemplateTask[]
  created_by: string
  created_at: string
}

export interface TaskTemplateTask {
  title: string
  description?: string | null
  priority: Task['priority']
  stage_gate?: string | null
}

export interface TaskTemplateCreate {
  name: string
  description?: string | null
  tasks: TaskTemplateTask[]
}

export interface TaskAutomationRule {
  id: string
  deal_id: string
  organization_id: string
  template_id: string
  name: string
  trigger: string
  action: string
  suppress_minutes: number
  created_by: string
  created_at: string
}

export interface TaskAutomationRuleCreate {
  name: string
  trigger: string
  action: string
  template_id: string
  suppress_minutes?: number
}

export interface TaskAutomationLog {
  id: string
  deal_id: string
  organization_id: string
  rule_id: string
  status: string
  message: string | null
  triggered_by: string
  triggered_at: string
}

/**
 * Fetch all tasks for a deal
 */
export async function listTasks(dealId: string): Promise<TaskListResponse> {
  const response = await api.get<TaskListResponse>(`/api/deals/${dealId}/tasks`)
  return response.data
}

/**
 * Create a new task
 */
export async function createTask(dealId: string, payload: TaskCreate): Promise<Task> {
  const response = await api.post<Task>(`/api/deals/${dealId}/tasks`, payload)
  return response.data
}

/**
 * Update an existing task
 */
export async function updateTask(dealId: string, taskId: string, payload: TaskUpdate): Promise<Task> {
  const response = await api.patch<Task>(`/api/deals/${dealId}/tasks/${taskId}`, payload)
  return response.data
}

/**
 * Delete a task
 */
export async function deleteTask(dealId: string, taskId: string): Promise<void> {
  await api.delete(`/api/deals/${dealId}/tasks/${taskId}`)
}

/**
 * List all task templates for the organization
 */
export async function listTemplates(): Promise<TaskTemplate[]> {
  const response = await api.get<TaskTemplate[]>('/api/task-templates')
  return response.data
}

/**
 * Create a new task template
 */
export async function createTemplate(payload: TaskTemplateCreate): Promise<TaskTemplate> {
  const response = await api.post<TaskTemplate>('/api/task-templates', payload)
  return response.data
}

/**
 * Delete a task template
 */
export async function deleteTemplate(templateId: string): Promise<void> {
  await api.delete(`/api/task-templates/${templateId}`)
}

/**
 * Apply a template to a deal (creates tasks from template)
 */
export async function applyTemplate(dealId: string, templateId: string): Promise<Task[]> {
  const response = await api.post<{ tasks: Task[] }>(`/api/deals/${dealId}/task-templates/${templateId}/apply`)
  return response.data.tasks
}

/**
 * List automation rules for a deal
 */
export async function listAutomationRules(dealId: string): Promise<TaskAutomationRule[]> {
  const response = await api.get<TaskAutomationRule[]>(`/api/deals/${dealId}/task-automation-rules`)
  return response.data
}

/**
 * Create automation rule
 */
export async function createAutomationRule(
  dealId: string,
  payload: TaskAutomationRuleCreate,
): Promise<TaskAutomationRule> {
  const response = await api.post<TaskAutomationRule>(`/api/deals/${dealId}/task-automation-rules`, payload)
  return response.data
}

/**
 * Delete automation rule
 */
export async function deleteAutomationRule(dealId: string, ruleId: string): Promise<void> {
  await api.delete(`/api/deals/${dealId}/task-automation-rules/${ruleId}`)
}

/**
 * Get automation logs
 */
export async function getAutomationLogs(dealId: string): Promise<TaskAutomationLog[]> {
  const response = await api.get<{ items: TaskAutomationLog[] }>(`/api/deals/${dealId}/task-automation-logs`)
  return response.data.items
}
