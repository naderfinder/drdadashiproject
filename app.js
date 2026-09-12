const STORAGE_KEY = 'drdadashi.tasks.v1';
const STATUS = { todo: 'انجام‌نشده', in_progress: 'در حال انجام', done: 'انجام‌شده' };
const PRIORITY = { low: 'کم', medium: 'متوسط', high: 'زیاد' };
const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3 };

const $ = (id) => document.getElementById(id);
let tasks = loadTasks();

function loadTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function formatDate(value) {
  if (!value) return 'بدون سررسید';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 'تاریخ نامعتبر' : new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date);
}

function visibleTasks() {
  const search = $('searchInput').value.trim().toLowerCase();
  const status = $('statusFilter').value;
  const priority = $('priorityFilter').value;
  const sort = $('sortSelect').value;
  let result = tasks.filter((task) => {
    const matchesSearch = !search || task.title.toLowerCase().includes(search) || (task.description || '').toLowerCase().includes(search);
    return matchesSearch && (status === 'all' || task.status === status) && (priority === 'all' || task.priority === priority);
  });
  result.sort((a,b) => {
    if (sort === 'created_asc') return new Date(a.created_at) - new Date(b.created_at);
    if (sort === 'due_asc') return (a.due_date || '9999-12-31').localeCompare(b.due_date || '9999-12-31');
    if (sort === 'priority_desc') return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    return new Date(b.created_at) - new Date(a.created_at);
  });
  return result;
}

function render() {
  $('totalCount').textContent = tasks.length;
  $('todoCount').textContent = tasks.filter(t => t.status === 'todo').length;
  $('progressCount').textContent = tasks.filter(t => t.status === 'in_progress').length;
  $('doneCount').textContent = tasks.filter(t => t.status === 'done').length;

  const list = $('taskList');
  const result = visibleTasks();
  if (!result.length) {
    list.innerHTML = `<div class="empty">هنوز کاری برای نمایش وجود ندارد.<br><small>از «کار جدید» برای شروع استفاده کن.</small></div>`;
    return;
  }

  list.innerHTML = result.map((task) => `
    <article class="task">
      <div class="task-top">
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.description || 'بدون توضیحات')}</p>
        </div>
        <div class="badges">
          <span class="badge ${task.priority}">${PRIORITY[task.priority]}</span>
          <span class="badge ${task.status === 'done' ? 'done' : task.status === 'in_progress' ? 'progress' : ''}">${STATUS[task.status]}</span>
        </div>
      </div>
      <div class="meta">سررسید: ${formatDate(task.due_date)} · آخرین تغییر: ${new Intl.DateTimeFormat('fa-IR', { dateStyle:'short', timeStyle:'short' }).format(new Date(task.updated_at))}</div>
      <div class="task-actions">
        <button class="small" data-action="edit" data-id="${task.id}">ویرایش</button>
        <button class="small" data-action="toggle" data-id="${task.id}">${task.status === 'done' ? 'بازگشت به انجام‌نشده' : 'انجام شد'}</button>
        <button class="small danger" data-action="delete" data-id="${task.id}">حذف</button>
      </div>
    </article>
  `).join('');
}

function openNewTask() {
  $('taskForm').reset();
  $('taskId').value = '';
  $('status').value = 'todo';
  $('priority').value = 'medium';
  $('dialogTitle').textContent = 'کار جدید';
  $('formError').textContent = '';
  $('taskDialog').showModal();
  $('title').focus();
}

function openEditTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  $('taskId').value = task.id;
  $('title').value = task.title;
  $('description').value = task.description || '';
  $('status').value = task.status;
  $('priority').value = task.priority;
  $('dueDate').value = task.due_date || '';
  $('dialogTitle').textContent = 'ویرایش کار';
  $('formError').textContent = '';
  $('taskDialog').showModal();
  $('title').focus();
}

$('newTaskBtn').addEventListener('click', openNewTask);
$('closeDialog').addEventListener('click', () => $('taskDialog').close());
$('cancelBtn').addEventListener('click', () => $('taskDialog').close());
['searchInput','statusFilter','priorityFilter','sortSelect'].forEach(id => $(id).addEventListener('input', render));

$('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = $('title').value.trim();
  if (!title) { $('formError').textContent = 'عنوان کار الزامی است.'; $('title').focus(); return; }
  const now = new Date().toISOString();
  const data = {
    title,
    description: $('description').value.trim(),
    status: $('status').value,
    priority: $('priority').value,
    due_date: $('dueDate').value || null,
    updated_at: now
  };
  const id = $('taskId').value;
  if (id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) tasks[index] = { ...tasks[index], ...data };
  } else {
    tasks.unshift({ id: makeId(), ...data, created_at: now });
  }
  persist();
  $('taskDialog').close();
  render();
});

$('taskList').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  if (action === 'edit') openEditTask(id);
  if (action === 'toggle') {
    task.status = task.status === 'done' ? 'todo' : 'done';
    task.updated_at = new Date().toISOString();
    persist(); render();
  }
  if (action === 'delete' && confirm(`آیا «${task.title}» حذف شود؟`)) {
    tasks = tasks.filter(t => t.id !== id);
    persist(); render();
  }
});

render();
