'use client';
import "reflect-metadata"

import React, { useState, useRef, useEffect } from 'react';
import { FaUserPlus, FaEllipsisV, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { FiShield, FiTrash2, FiEye,  FiSlash, FiCheckCircle } from 'react-icons/fi';

// --- DI Container and Controller ---
import 'reflect-metadata'; // Required for tsyringe
import { container } from '@/app/lib/diContainer';
import { AdminUser } from '@/app/(model)/settings/settingsRepo';
import { SettingsController } from '@/app/(controller)/settings/settingsController';

// --- Helper Components (Avatar and Modal are the same, Toast is new) ---

const Avatar = ({ name }: { name: string }) => {
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
   
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm `}>
            {getInitials(name)}
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmButtonText = 'Confirm', confirmButtonClassName = 'bg-red-600 hover:bg-red-700' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center">
                    <div className="mr-4 p-2 bg-red-100 dark:bg-red-900 rounded-full">
                        <FaExclamationTriangle className="text-red-600 dark:text-red-200 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                </div>
                <div className="mt-4 text-gray-600 dark:text-gray-300">{children}</div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className={`px-4 py-2 text-white font-semibold rounded-md transition-colors ${confirmButtonClassName}`}>{confirmButtonText}</button>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, type, onDismiss }: { message: string, type: 'success' | 'error', onDismiss: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in-up`}>
            {message}
        </div>
    );
};


const AdminManagementPage = () => {
    const adminController = container.resolve(SettingsController);

    // --- STATE MANAGEMENT ---
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, confirmButtonText: 'Confirm', confirmButtonClassName: 'bg-red-600 hover:bg-red-700' });
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const dropdownRef = useRef(null);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);
                const fetchedAdmins = await adminController.getAllAdmins();
                // Map the API response to match the frontend's expected status property
                const formattedAdmins = fetchedAdmins.map(admin => ({
                    ...admin,
                    // Assuming your API returns `accountStatus` as 'active' or 'deactivated'
                    status: admin.accountStatus === 'active' ? 'Active' : 'Deactivated'
                }));
                setAdmins(formattedAdmins);
                setError(null);
            } catch (err) {
                setError('Failed to fetch admins. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, [adminController]);


    // --- Close dropdown when clicking outside ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    // --- ACTION HANDLERS (Now with API calls) ---
    const handleRemoveAdmin = (admin: AdminUser) => {
        setModalState({
            isOpen: true,
            title: 'Confirm Admin Removal',
            message: `Are you sure you want to permanently remove ${admin.username}? This action cannot be undone.`,
            confirmButtonText: 'Yes, Remove',
            confirmButtonClassName: 'bg-red-600 hover:bg-red-700',
            onConfirm: async () => {
                try {
                    await adminController.removeAdmin(admin.id);
                    setAdmins(currentAdmins => currentAdmins.filter(a => a.id !== admin.id));
                    showToast('Admin removed successfully!', 'success');
                } catch (err) {
                    showToast((err as Error).message || 'Failed to remove admin.', 'error');
                } finally {
                    closeModal();
                }
            },
        });
    };

    const handleToggleStatus = (admin: AdminUser) => {
        const isActivating = admin.status === 'Deactivated';
        setModalState({
            isOpen: true,
            title: `Confirm Status Change`,
            message: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} the account for ${admin.username}?`,
            confirmButtonText: isActivating ? 'Yes, Activate' : 'Yes, Deactivate',
            confirmButtonClassName: isActivating ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700',
            onConfirm: async () => {
                try {
                    const updatedAdmin = await adminController.toggleUserStatus(admin.id);
                    setAdmins(currentAdmins => currentAdmins.map(a =>
                        a.id === admin.id ? { ...a, status: updatedAdmin.data.accountStatus === 'active' ? 'Active' : 'Deactivated' } : a
                    ));
                    showToast(`User ${isActivating ? 'activated' : 'deactivated'} successfully!`, 'success');
                } catch (err) {
                    showToast((err as Error).message || 'Failed to update status.', 'error');
                } finally {
                    closeModal();
                }
            },
        });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    };

    const getActionsForAdmin = (admin: AdminUser) => {
        const baseActions = [
            { label: 'View Details', icon: <FiEye className="mr-2" />, style: 'text-green-600 dark:text-green-400', onClick: () => console.log("View Details", admin) },
            { label: 'Change Permissions', icon: <FiShield className="mr-2" />, style: 'text-blue-600 dark:text-blue-400', onClick: () => console.log("Change Permissions", admin) },
            // ... other non-destructive actions
        ];

        if (admin.status === 'Active') {
            baseActions.push({ label: 'Deactivate', icon: <FiSlash className="mr-2" />, style: 'text-gray-600 dark:text-gray-400', onClick: () => handleToggleStatus(admin) });
        } else {
            baseActions.push({ label: 'Activate', icon: <FiCheckCircle className="mr-2" />, style: 'text-green-600 dark:text-green-400', onClick: () => handleToggleStatus(admin) });
        }
        
        baseActions.push({ label: 'Remove Admin', icon: <FiTrash2 className="mr-2" />, style: 'text-red-600 dark:text-red-400', onClick: () => handleRemoveAdmin(admin) });
        
        return baseActions;
    };

    const filteredAdmins = admins.filter(admin =>
        admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER LOGIC ---
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading admins...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="card bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 min-h-screen h-full w-full flex flex-col">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                    <h2 className="card-title text-2xl font-bold text-gray-800 dark:text-white">Admin Management</h2>
                    <p className="card-description text-gray-500 dark:text-gray-400 mt-1">Manage your admin accounts and permissions here.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name or email..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                        <FaUserPlus />
                        <span>Add Admin</span>
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto min-h-screen">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAdmins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <Avatar name={admin.username} />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{admin.username}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div className="flex flex-wrap gap-2 max-w-xs">
                                        {admin.roles.map((perm, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{perm.role.roleName}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{admin.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(admin.updatedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right relative">
                                    <button onClick={() => setOpenDropdownId(openDropdownId === admin.id ? null : admin.id)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <FaEllipsisV />
                                    </button>
                                    {openDropdownId === admin.id && (
                                        <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <div className="py-1">
                                                {getActionsForAdmin(admin).map((action) => (
                                                    <button key={action.label} className={`w-full text-left flex items-center px-4 py-2 text-sm ${action.style} hover:bg-gray-100 dark:hover:bg-gray-700`} onClick={() => { action.onClick(); setOpenDropdownId(null); }}>
                                                        {action.icon}
                                                        <span>{action.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Render Modals and Toasts */}
            <ConfirmationModal isOpen={modalState.isOpen} onClose={closeModal} onConfirm={modalState.onConfirm} title={modalState.title} confirmButtonText={modalState.confirmButtonText} confirmButtonClassName={modalState.confirmButtonClassName}>
                <p>{modalState.message}</p>
            </ConfirmationModal>
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </div>
    );
};

export default AdminManagementPage;
