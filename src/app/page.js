"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import axios from "axios"; 
import { toast } from 'react-hot-toast'; 

const AdminLogin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Loading state

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { email, password } = data;
        setLoading(true); // Set loading to true when starting login

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
                email,
                password,
            });

            const result = response.data;

            if (result.success) {
                toast.success("Login successful!");
                router.push('/users');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state after request
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                },
                            })}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                                validate: (value) =>
                                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                    "Password must contain at least one special character",
                            })}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-gray-500' : 'bg-indigo-500'} text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300`}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Loading...' : 'Login'} {/* Change button text while loading */}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
