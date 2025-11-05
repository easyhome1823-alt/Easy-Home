 'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';

type UserRow = {
  id: string;
  uid?: string;
  email?: string;
  displayName?: string;
  role?: string;
  createdAt?: any;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const rows: UserRow[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setUsers(rows);
    } catch (err) {
      console.error('Error fetching users', err);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    if (!confirm(`Change role to ${newRole}?`)) return;
    setUpdating(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      alert('Role updated');
    } catch (err) {
      console.error('Error updating role', err);
      alert('Error updating role');
    } finally {
      setUpdating(null);
    }
  }

  async function removeUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This will remove the user record from Firestore.')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted');
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Error deleting user');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <AdminSidebar />

        <main>
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold">Users management</h2>
            <p className="text-sm text-gray-500">List and manage application users</p>
          </div>

          <div className="card p-6">
            {loading ? (
              <div>Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-3">{u.displayName || '—'}</td>
                        <td className="px-4 py-3">{u.email || '—'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role || ''}
                            onChange={(e) => changeRole(u.id, e.target.value)}
                            disabled={updating === u.id}
                            className="input-field"
                          >
                            <option value="admin">admin</option>
                            <option value="arrendador">arrendador</option>
                            <option value="arrendatario">arrendatario</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeUser(u.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
