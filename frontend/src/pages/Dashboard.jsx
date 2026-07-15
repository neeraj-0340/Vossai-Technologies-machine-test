import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTasks = async (resetPage = false) => {
    setError('');
    try {
      const response = await API.get('/tasks');
      setTasks(response.data);
      if (resetPage) {
        setCurrentPage(1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      dueDate: taskDueDate || undefined,
    };

    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, taskData);
        setEditingTask(null);
        fetchTasks(false);
      } else {
        await API.post('/tasks', taskData);
        fetchTasks(true);
      }
      
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('Pending');
      setTaskDueDate('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title);
      setTaskDescription(editingTask.description || '');
      setTaskStatus(editingTask.status);
      setTaskDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '');
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('Pending');
      setTaskDueDate('');
    }
  }, [editingTask]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchQuery]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filter !== 'All') {
      result = result.filter((t) => t.status === filter);
    }

    if (debouncedSearchQuery.trim() !== '') {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks, filter, debouncedSearchQuery]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredTasks.length, totalPages, currentPage]);

  const currentTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage]);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-grid">
          
          <div className="dashboard-left-col">
            <div className="task-form-section">
              <div className="task-form-card">
                <h3>{editingTask ? 'Edit Task' : 'Create Task'}</h3>
                {formError && <div className="alert alert-error">{formError}</div>}
                
                <form onSubmit={handleFormSubmit} className="task-form">
                  <div className="form-group">
                    <label htmlFor="task-title">Title</label>
                    <input
                      id="task-title"
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="task-desc">Description</label>
                    <textarea
                      id="task-desc"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Add details (optional)..."
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="task-status">Status</label>
                      <select 
                        id="task-status" 
                        value={taskStatus} 
                        onChange={(e) => setTaskStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="task-date">Due Date</label>
                      <input
                        id="task-date"
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    {editingTask && (
                      <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="submit-btn" disabled={formLoading}>
                      {formLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="dashboard-right-col">
            
            <div className="dashboard-controls-row">
              <h2>My Tasks</h2>
              <div className="controls-group">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
                <div className="filter-container-inline">
                  <select 
                    id="status-filter"
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="task-list-section">
              {loading ? (
                <div className="loading-spinner">Loading tasks...</div>
              ) : error ? (
                <div className="alert alert-error">{error}</div>
              ) : currentTasks.length === 0 ? (
                <div className="empty-tasks">No tasks found. Create one to get started!</div>
              ) : (
                <div className="task-list">
                  {currentTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="task-header">
                        <h4>{task.title}</h4>
                        <span className={`status-badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.description && <p className="task-desc">{task.description}</p>}
                      
                      <div className="task-footer">
                        <span className="due-date">
                          {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                        </span>
                        <div className="task-controls">
                          <button 
                            onClick={() => setEditingTask(task)} 
                            className="task-action-btn edit-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task._id)} 
                            className="task-action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!loading && !error && filteredTasks.length > 0 && (
              <div className="pagination-container">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="cancel-btn"
                >
                  Previous
                </button>
                <span className="pagination-info" style={{ fontSize: '0.9rem', color: 'var(--text-h)' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="cancel-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
