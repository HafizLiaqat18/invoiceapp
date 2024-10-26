'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function TasksPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // States for loading indicators
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Handle form submission for adding a new task
  const onSubmitAdd = async (data) => {
    setLoadingAdd(true);
    try {
      await axios.post(`/api/addtask`, data);
      toast.success('Task added successfully', {
        duration: 2000,
        position: 'top-center'
      });

      // Refresh task list
      await fetchTasks();
    } catch (error) {
      toast.error('Error adding task: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoadingAdd(false);
      reset(); // Reset the add task form
    }
  };

  // Fetch tasks on component mount
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/gettasks`);
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Error fetching tasks: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setDataLoading(false);
    }
  };

  // Handle task update
  const onSubmitUpdate = async (data) => {
    setLoadingUpdate(true);
    try {
      await axios.put(`/api/updatetask`, data);
      toast.success('Task updated successfully', {
        duration: 2000,
        position: 'top-center'
      });
      
      // Refresh task list
      await fetchTasks();
    } catch (error) {
      toast.error('Error updating task: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoadingUpdate(false);
      reset(); // Reset the update task form
      setEditingTask(null); // Clear editing task
    }
  };

  // Handle task delete
  const handleDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/deletetask/`,{data:{_id : taskId}});

        toast.success('Task deleted successfully', {
          duration: 2000,
          position: 'top-center'
        });

        // Refresh task list
        await fetchTasks();
      } catch (error) {
        toast.error('Error deleting task: ' + error.message, {
          duration: 2000,
          position: 'top-center',
        });
      }
    }
  };

  // Set task to edit
  const handleEdit = (task) => {
    reset({
      title: task.title,
      description: task.description,
      price: task.price,
    });
    setEditingTask(task);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-500">
      <Toaster />
      <div className="flex flex-col justify-center items-center gap-10 space-y-4 md:space-y-0 md:space-x-8">

        {/* Left Side - Task List */}
        <div className="w-full  p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-500">All Tasks</h1>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto max-h-screen">
              <table className="w-full text-left table-auto border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-t">
                      <td className="py-3 px-6">{task.title}</td>
                      <td className="py-3 px-6">{task.description}</td>
                      <td className="py-3 px-6">${task.price.toFixed(2)}</td>
                      <td className="py-3 px-6">
                        <button 
                          className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>
                        <button 
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-2xl">{dataLoading ? "Loading tasks..." : "No tasks added yet."}</p>
          )}
        </div>

        {/* Right Side - Add or Update Task Form */}
        <div className="w-full md:w-4/5 p-6 shadow-lg bg-white rounded-lg space-y-6">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-500">
            {editingTask ? "Update Task" : "Add New Task"}
          </h1>
          <form onSubmit={editingTask ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmitAdd)} className="space-y-4">
            <div>
              <label className="block text-gray-700">Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                className={`w-full px-4 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                {...register('title', { required: 'Task title is required' })}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                placeholder="Enter task description"
                className={`w-full px-4 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Enter task price"
                className={`w-full px-4 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be a positive number' } })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              {editingTask ? (loadingUpdate ? "Updating..." : "Update Task") : (loadingAdd ? "Processing..." : "Add Task")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
