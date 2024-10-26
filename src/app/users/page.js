'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(null); // State for the user being updated
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users data
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getusers`);
        setUsers(response.data.data);
      } catch (error) {
        toast.error(error.message, {
          duration: 2000,
          position: 'top-center',
        });
      } finally {
        setDataLoading(false);
      }
    };
    getUsers();
  }, []);

  // Handle form submission for adding a user
  const onSubmitAddUser = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/adduser`, data);
      toast.success('User added successfully', {
        position: 'top-center',
        duration: 2000,
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.message, {
        position: 'top-center',
        duration: 1000,
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  // Fetch users after adding/updating/deleting
  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getusers`);
    setUsers(response.data.data);
  };

  // Handle form submission for updating a user
  const onSubmitUpdateUser = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/updateuser`, data); // Use user ID for updating
      toast.success('User updated successfully', {
        position: 'top-center',
        duration: 2000,
      });
      setUpdatingUser(null); // Clear updating user
      fetchUsers();
    } catch (error) {
      toast.error(error.message, {
        position: 'top-center',
        duration: 1000,
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  // Handle user deletion
  // Handle user deletion
  const handleDeleteUser = async (email) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteuser`, {
        data: { email }, // Include email in the data property
      });
      toast.success('User deleted successfully', {
        position: 'top-center',
        duration: 2000,
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.message, {
        position: 'top-center',
        duration: 1000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-500">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">
        
        {/* Top - User List */}
        <div className="w-full md:w-full p-4 shadow-lg bg-white rounded-lg mb-4">
          <h1 className="text-xl font-bold mb-4 text-center text-gray-500">All Users</h1>
          {users.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full min-w-full text-left table-auto border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6">First Name</th>
                    <th className="py-3 px-6">Last Name</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Age</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="py-3 px-6">{user.firstName}</td>
                      <td className="py-3 px-6">{user.lastName}</td>
                      <td className="py-3 px-6">{user.email}</td>
                      <td className="py-3 px-6">{user.phone}</td>
                      <td className="py-3 px-6">{user.age}</td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => {
                            setUpdatingUser(user);
                            reset(user); // Prefill the update form
                          }}
                          className="text-blue-500 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          className="text-red-500 hover:underline"
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center flex items-center justify-center text-gray-500 h-[400px] text-4xl">{dataLoading ? "Processing...." : "No users added yet."}</p>
          )}
        </div>
      </div>

      {/* Bottom - Add User Form */}
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 p-6 shadow-lg bg-white rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-500">{updatingUser ? "Update User" : "Add New User"}</h1>
          <form onSubmit={updatingUser ? handleSubmit(onSubmitUpdateUser) : handleSubmit(onSubmitAddUser)} className="space-y-4">
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
                {...register('age', { required: 'Age is required' })}
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (updatingUser ? 'Updating...' : 'Adding...') : (updatingUser ? 'Update User' : 'Add User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
