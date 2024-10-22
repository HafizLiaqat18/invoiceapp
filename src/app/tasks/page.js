'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function TasksPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    // API call to add task
    try {
      const response = await axios.post("/api/addtask", data);
      // console.log(response);
      toast.success('add task successfully', {
        duration: 2000,
        position: 'top-center'
      });


      // Optionally refresh task list after adding
      const updatedTasks = await axios.get("/api/gettasks");
      setTasks(updatedTasks.data.data);
    } catch (error) {
      // console.log(error);
      toast.error(error.message, {
        duration: 2000,
        position: 'top-center',
       
      });

    } finally {
      setLoading(false);
      reset();
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        // console.log("Fetching tasks...");
        const response = await axios.get("/api/gettasks");
        setTasks(response.data.data);
      } catch (error) {
        // console.log("Error fetching tasks: " + error.message);
      } finally {
        setDataLoading(false);
      }
    };
    getTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-500">
      <div className="flex flex-col-reverse md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">

        {/* Left Side - Task List */}
        <div className="w-full md:w-1/3 p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-500">All Tasks</h1>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
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
                      <td className="py-3 px-6">${task.price.toFixed(2)}</td> {/* Display Price */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-2xl">{dataLoading ? "Loading tasks..." : "No tasks added yet."}</p>
          )}
        </div>

        {/* Right Side - Add Task Form */}
        <div className="w-full md:w-2/3 p-6 shadow-lg bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-500">Add New Task</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-gray-700">Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                {...register('title', { required: 'Task title is required' })}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                placeholder="Enter task description"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Enter task price"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be a positive number' } })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              {loading ? "Processing..." : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
