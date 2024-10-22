'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function InvoiceGenerator() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Fetch users and tasks
        const fetchUsersAndTasks = async () => {
            try {
                const usersResponse = await axios.get("/api/getusers");
                const tasksResponse = await axios.get("/api/gettasks");
                setUsers(usersResponse.data.data);
                setTasks(tasksResponse.data.data);
            } catch (error) {
                toast.error("Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchUsersAndTasks();
    }, []);

    // Handle task selection
    const handleTaskSelection = (task) => {
        setSelectedTasks((prev) => {
            if (prev.includes(task)) {
                return prev.filter((t) => t !== task);  // Deselect
            } else {
                return [...prev, task];  // Select
            }
        });
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        return selectedTasks.reduce((total, task) => total + task.price, 0);
    };

    // Handle invoice generation
    const generateInvoice = async () => {
        if (!selectedUser || selectedTasks.length === 0) {
            toast('Please select a user and at least one task', {
                position: 'top-center',
                duration: 2000, // 2 seconds
              });
            return;
        }
        
        const invoice = {
            user: selectedUser,
            tasks: selectedTasks
        };
    
        try {
            await axios.post("/api/generateinvoice", invoice);
            toast.success('Invoice generated successfully', {
                duration: 2000,
                position: 'top-center'
            });
        } catch (error) {
            toast.error('Error generating invoice', {
                duration: 2000,
                position: 'top-center'
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-slate-50 text-gray-500">
            <div className="flex-grow flex flex-col md:flex-row">
                {/* Left Side: User Selection */}
                <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-4">Select User</h2>
                    
                    { loading? <p className='text-gray-900 flex h-4/5 w-full justify-center items-center text-3xl'>Loading.....</p>: users.length === 0 ? (
                        <p className='text-gray-900 flex h-3/5 w-full justify-center items-center text-3xl'>No users available</p>
                    ) : (
                        <ul>
                            {users.map(user => (
                                <li key={user._id} className="mb-2">
                                    <button 
                                        className={`w-full py-2 px-4 rounded-md ${selectedUser === user ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        {/* Display user name, email, and age */}
                                        <div className="font-bold">{user.firstName} {user.lastName}</div>
                                        <div className="text-sm">{user.email}</div>
                                        <div className="text-sm">Age: {user.age}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Right Side: Task Selection */}
                <div className="w-full md:w-2/3 p-4 bg-white overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-4">Select Tasks</h2>
                    {loading? <p className='text-gray-900 flex h-4/5 w-full justify-center items-center text-3xl'>Loading.....</p>:tasks.length === 0 ? (
                        <p className='text-gray-900 flex h-3/5 w-full justify-center items-center text-3xl'>No tasks available</p>
                    ) : (
                        <ul>
                            {tasks.map(task => (
                                <li key={task._id} className="mb-2">
                                    <label className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            value={task._id} 
                                            onChange={() => handleTaskSelection(task)} 
                                            checked={selectedTasks.includes(task)} 
                                        />
                                        {/* Display task title and price */}
                                        <span className="ml-2">{task.title} - ${task.price}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bottom Section: Display Selected User, Tasks, and Total Price */}
            <div className="w-full p-4 bg-gray-200 mt-6">
                <div className="text-lg font-bold">
                    <p>User: {selectedUser?.firstName} {selectedUser?.lastName}</p>
                    <p>Email: {selectedUser?.email}</p>
                    <p>Tasks Selected: {selectedTasks?.length}</p>
                    <p>Total Price: ${calculateTotalPrice()}</p>
                </div>

                {/* Generate Invoice Button */}
                <button 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={generateInvoice}
                >
                    Generate Invoice
                </button>
            </div>
        </div>
    );
}













// 'use client'

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// export default function InvoiceGenerator() {
//     const [users, setUsers] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [selectedTasks, setSelectedTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         // Fetch users and tasks
//         const fetchUsersAndTasks = async () => {
//             try {
//                 const usersResponse = await axios.get("/api/getusers");
//                 const tasksResponse = await axios.get("/api/gettasks");
//                 setUsers(usersResponse.data.data);
//                 setTasks(tasksResponse.data.data);
//             } catch (error) {
//                 toast.error("Error fetching data");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUsersAndTasks();
//     }, []);

//     // Handle task selection
//     const handleTaskSelection = (task) => {
//         setSelectedTasks((prev) => {
//             if (prev.includes(task)) {
//                 return prev.filter((t) => t !== task);  // Deselect
//             } else {
//                 return [...prev, task];  // Select
//             }
//         });
//     };

//     // Calculate total price
//     const calculateTotalPrice = () => {
//         return selectedTasks.reduce((total, task) => total + (task.quantity * task.unitPrice), 0);
//     };

//     // Handle invoice generation
//     const generateInvoice = async () => {
//         if (!selectedUser || selectedTasks.length === 0) {
//             toast('Please select a user and at least one task', {
//                 position: 'top-center',
//                 duration: 2000, // 2 seconds
//             });
//             return;
//         }
        
//         const invoice = {
//             user: selectedUser,
//             tasks: selectedTasks.map(task => ({
//                 title: task.title,
//                 description: task.description,
//                 quantity: task.quantity,
//                 unitPrice: task.unitPrice,
//                 price: task.price,
//             }))
//         };
    
//         try {
//             await axios.post("/api/generateinvoice", invoice);
//             toast.success('Invoice generated successfully', {
//                 duration: 2000,
//                 position: 'top-center'
//             });
//         } catch (error) {
//             toast.error('Error generating invoice', {
//                 duration: 2000,
//                 position: 'top-center'
//             });
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen p-6 bg-slate-50 text-gray-500">
//             <div className="flex-grow flex flex-col md:flex-row">
//                 {/* Left Side: User Selection */}
//                 <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-y-auto" style={{ maxHeight: '80vh' }}>
//                     <h2 className="text-xl font-bold mb-4">Select User</h2>
                    
//                     { loading? <p className='text-gray-900 flex h-4/5 w-full justify-center items-center text-3xl'>Loading.....</p>: users.length === 0 ? (
//                         <p className='text-gray-900 flex h-3/5 w-full justify-center items-center text-3xl'>No users available</p>
//                     ) : (
//                         <ul>
//                             {users.map(user => (
//                                 <li key={user._id} className="mb-2">
//                                     <button 
//                                         className={`w-full py-2 px-4 rounded-md ${selectedUser === user ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                                         onClick={() => setSelectedUser(user)}
//                                     >
//                                         {/* Display user name, email, and age */}
//                                         <div className="font-bold">{user.firstName} {user.lastName}</div>
//                                         <div className="text-sm">{user.email}</div>
//                                         <div className="text-sm">Age: {user.age}</div>
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//                 {/* Right Side: Task Selection */}
//                 <div className="w-full md:w-2/3 p-4 bg-white overflow-y-auto" style={{ maxHeight: '80vh' }}>
//                     <h2 className="text-xl font-bold mb-4">Select Tasks</h2>
//                     {loading? <p className='text-gray-900 flex h-4/5 w-full justify-center items-center text-3xl'>Loading.....</p>:tasks.length === 0 ? (
//                         <p className='text-gray-900 flex h-3/5 w-full justify-center items-center text-3xl'>No tasks available</p>
//                     ) : (
//                         <ul>
//                             {tasks.map(task => (
//                                 <li key={task._id} className="mb-2">
//                                     <label className="flex items-center">
//                                         <input 
//                                             type="checkbox" 
//                                             value={task._id} 
//                                             onChange={() => handleTaskSelection(task)} 
//                                             checked={selectedTasks.includes(task)} 
//                                         />
//                                         {/* Display task title, quantity, unit price, and price */}
//                                         <span className="ml-2">{task.title} - ${task.unitPrice} x {task.quantity} = ${task.quantity * task.unitPrice}</span>
//                                         <p className="ml-2 text-sm text-gray-600">{task.description}</p>
//                                     </label>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             </div>

//             {/* Bottom Section: Display Selected User, Tasks, and Total Price */}
//             <div className="w-full p-4 bg-gray-200 mt-6">
//                 <div className="text-lg font-bold">
//                     <p>User: {selectedUser?.firstName} {selectedUser?.lastName}</p>
//                     <p>Email: {selectedUser?.email}</p>
//                     <p>Tasks Selected: {selectedTasks?.length}</p>
//                     <p>Total Price: ${calculateTotalPrice()}</p>
//                 </div>

//                 {/* Generate Invoice Button */}
//                 <button 
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
//                     onClick={generateInvoice}
//                 >
//                     Generate Invoice
//                 </button>
//             </div>
//         </div>
//     );
// }






