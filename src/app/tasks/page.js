'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function TasksPage() {
  const { register, handleSubmit, formState: { errors }, reset: resetAddForm } = useForm();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdateForm } = useForm();
  const { register: registerDelete, handleSubmit: handleSubmitDelete } = useForm();
  const [tasks, setTasks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Loading states for each form
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // States for Add Task Form
  const [addTaskData, setAddTaskData] = useState({
    title: '',
    description: '',
    price: '',
  });

  // States for Update Task Form
  const [updateTaskData, setUpdateTaskData] = useState({
    title: '',
    description: '',
    price: '',
  });

  // State for Delete Task Form
  const [deleteTaskTitle, setDeleteTaskTitle] = useState('');

  // Handle form submission for adding a new task
  const onSubmitAdd = async (data) => {
    setLoadingAdd(true);
    try {
      await axios.post("/api/addtask", data);
      toast.success('Task added successfully', {
        duration: 2000,
        position: 'top-center'
      });

      // Optionally refresh task list after adding
      const updatedTasks = await axios.get("/api/gettasks");
      setTasks(updatedTasks.data.data);
    } catch (error) {
      toast.error(error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoadingAdd(false);
      resetAddForm(); // Reset the add task form
      setAddTaskData({ title: '', description: '', price: '' }); // Clear the input state
    }
  };

  // Handle form submission for updating a task
  const onSubmitUpdate = async (data) => {
    setLoadingUpdate(true);
    try {
      await axios.put("/api/updatetask", data);
      toast.success('Task updated successfully', {
        duration: 2000,
        position: 'top-center'
      });

      const updatedTasks = await axios.get("/api/gettasks");
      setTasks(updatedTasks.data.data);
    } catch (error) {
      toast.error('Error updating task: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoadingUpdate(false);
      resetUpdateForm(); // Reset the update task form
      setUpdateTaskData({ title: '', description: '', price: '' }); // Clear the input state
    }
  };

  // Handle task deletion based on title
  const onDelete = async (data) => {
    setLoadingDelete(true);
    try {
      await axios.delete('/api/deletetask', { title: { title: data.title } });
      toast.success('Task deleted successfully', {
        duration: 2000,
        position: 'top-center'
      });

      // Refresh task list after deletion
      const updatedTasks = await axios.get("/api/gettasks");
      setTasks(updatedTasks.data.data);
    } catch (error) {
      toast.error('Error deleting task: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setLoadingDelete(false);
      setDeleteTaskTitle(''); // Clear the delete input field
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("/api/gettasks");
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
    getTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-500">
      <Toaster />
      <div className="flex flex-col-reverse md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">

        {/* Left Side - Task List */}
        <div className="w-full md:w-1/2 p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-500">All Tasks</h1>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto max-h-screen">
              <table className="w-full min-w-full text-left table-auto border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-6">{task.title}</td>
                      <td className="py-3 px-6">${task.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-2xl">{dataLoading ? "Loading tasks..." : "No tasks added yet."}</p>
          )}
        </div>

        {/* Right Side - Add, Update, Delete Task Forms */}
        <div className="w-full md:w-2/3 p-6 shadow-lg bg-white rounded-lg space-y-6">

          {/* Add Task Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-500">Add New Task</h1>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div>
                <label className="block text-gray-700">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className={`w-full px-4 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('title', { required: 'Task title is required' })}
                  value={addTaskData.title}
                  onChange={(e) => setAddTaskData({ ...addTaskData, title: e.target.value })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  placeholder="Enter task description"
                  className={`w-full px-4 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('description', { required: 'Description is required' })}
                  value={addTaskData.description}
                  onChange={(e) => setAddTaskData({ ...addTaskData, description: e.target.value })}
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
                  value={addTaskData.price}
                  onChange={(e) => setAddTaskData({ ...addTaskData, price: e.target.value })}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                {loadingAdd ? "Processing..." : "Add Task"}
              </button>
            </form>
          </div>

          {/* Update Task Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-500">Update Task</h1>
            <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className="space-y-4">
              <div>
                <label className="block text-gray-700">Task Title (To Update)</label>
                <input
                  type="text"
                  placeholder="Enter task title to update"
                  className={`w-full px-4 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  {...registerUpdate('title', { required: 'Task title is required' })}
                  value={updateTaskData.title}
                  onChange={(e) => setUpdateTaskData({ ...updateTaskData, title: e.target.value })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">New Description</label>
                <textarea
                  placeholder="Enter new task description"
                  className={`w-full px-4 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  {...registerUpdate('description', { required: 'Description is required' })}
                  value={updateTaskData.description}
                  onChange={(e) => setUpdateTaskData({ ...updateTaskData, description: e.target.value })}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700">New Price</label>
                <input
                  type="number"
                  placeholder="Enter new task price"
                  className={`w-full px-4 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  {...registerUpdate('price', { required: 'Price is required', min: { value: 0, message: 'Price must be a positive number' } })}
                  value={updateTaskData.price}
                  onChange={(e) => setUpdateTaskData({ ...updateTaskData, price: e.target.value })}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <button type="submit" className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                {loadingUpdate ? "Processing..." : "Update Task"}
              </button>
            </form>
          </div>

          {/* Delete Task Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-500">Delete Task</h1>
            <form onSubmit={handleSubmitDelete(onDelete)} className="space-y-4">
              <div>
                <label className="block text-gray-700">Task Title (To Delete)</label>
                <input
                  type="text"
                  placeholder="Enter task title to delete"
                  className={`w-full px-4 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  {...registerDelete('title', { required: 'Task title is required' })}
                  value={deleteTaskTitle}
                  onChange={(e) => setDeleteTaskTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <button type="submit" className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                {loadingDelete ? "Processing..." : "Delete Task"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
