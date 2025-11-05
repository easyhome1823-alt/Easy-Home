 'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminSidebar from '@/components/AdminSidebar';
import Navbar from '@/components/Navbar';
import { deleteProperty } from '@/lib/propertyService';

type PropertyRow = {
  id: string;
  title?: string;
  location?: any;
  price?: number;
  available?: boolean;
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all'|'available'|'unavailable'>('all');

  useEffect(() => { fetchProperties(); }, []);

  async function fetchProperties() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'properties'));
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setProperties(rows);
    } catch (err) {
      console.error('Error fetching properties', err);
      alert('Error loading properties');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filterCity && !(p.location?.city || '').toLowerCase().includes(filterCity.toLowerCase())) return false;
      if (filterStatus === 'available' && !p.available) return false;
      if (filterStatus === 'unavailable' && p.available) return false;
      return true;
    });
  }, [properties, filterCity, filterStatus]);

  async function toggleAvailable(id: string, current: boolean) {
    try {
      await updateDoc(doc(db, 'properties', id), { available: !current });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, available: !current } : p));
    } catch (err) {
      console.error('Error updating property', err);
      alert('Error updating property');
    }
  }

  async function removeProperty(id: string) {
    if (!confirm('Delete property and its images? This cannot be undone.')) return;
    try {
      // Use service that deletes images and doc
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      alert('Property deleted');
    } catch (err) {
      console.error('Error deleting property', err);
      alert('Error deleting property');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <AdminSidebar />

        <main>
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold">Properties management</h2>
            <p className="text-sm text-gray-500">List, filter and manage properties</p>
          </div>

          <div className="card p-6 mb-4">
            <div className="flex flex-wrap gap-3 items-center">
              <input
                placeholder="Filter by city"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="input-field"
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="input-field">
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <div className="ml-auto text-sm text-gray-600">Showing: {filtered.length} properties</div>
            </div>
          </div>

          <div className="card p-6">
            {loading ? (<div>Loading...</div>) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">City</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Available</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-t">
                        <td className="px-4 py-3">{p.title || '—'}</td>
                        <td className="px-4 py-3">{p.location?.city || '—'}</td>
                        <td className="px-4 py-3">{p.price ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.price) : '—'}</td>
                        <td className="px-4 py-3">{p.available ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleAvailable(p.id, !!p.available)} className="btn-secondary text-sm">
                              Toggle
                            </button>
                            <button onClick={() => removeProperty(p.id)} className="text-red-600 text-sm">
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
