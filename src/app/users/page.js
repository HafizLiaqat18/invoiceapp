'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import  toast  from 'react-hot-toast';

export default function UsersPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  useEffect(() => {
    const getUsers = async () => {
      try {
        // console.log("Use effect");
        const response = await axios.get("/api/getusers");
        setUsers(response.data.data);
      } catch (error) {
        toast.error(error.message,{
          duration: 2000,
          position: 'top-center'
        })
       
      } finally {
        setDataLoading(false);
      }
    }
    getUsers();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await axios.post("/api/adduser", data);
      toast.success('User added successfully', {
        position: 'top-center',
        duration: 2000, // 2 seconds
      });

      const response = await axios.get("/api/getusers");
      setUsers(response.data.data);
    } catch (error) {
      // console.log(error);
      toast.error(error.message, {
        position: 'top-center',
        duration: 1000, // 1 second
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-500">
      <div className="flex flex-col-reverse md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">

        {/* Left Side - User List */}
        <div className="w-full md:w-1/3 p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-500">All Users</h1>
          {users.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]"> {/* Updated here */}
              <table className="w-full min-w-full text-left table-auto border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6">First Name</th>
                    <th className="py-3 px-6">Last Name</th>
                    <th className="py-3 px-6">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-6">{user.firstName}</td>
                      <td className="py-3 px-6">{user.lastName}</td>
                      <td className="py-3 px-6">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-2xl">{dataLoading ? "Processing...." : "No users added yet."}</p>
          )}
        </div>

        {/* Right Side - Add User Form */}
        <div className="w-full md:w-2/3 p-6 shadow-lg bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-500">Add New User</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email format',
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                placeholder="Enter age"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                {...register('age', { required: 'Age is required', min: 1 })}
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              {loading ? "Processing...." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
