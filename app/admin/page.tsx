'use client';

import { useState, useEffect } from 'react';
import { useStore, Staff, Event } from '@/lib/store';
import { Lock, LogOut, Plus, Trash2, Edit, Save, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'staff' | 'events' | 'settings'>('content');

  // Store
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);
  const addStaff = useStore((state) => state.addStaff);
  const updateStaff = useStore((state) => state.updateStaff);
  const deleteStaff = useStore((state) => state.deleteStaff);
  const addEvent = useStore((state) => state.addEvent);
  const updateEvent = useStore((state) => state.updateEvent);
  const deleteEvent = useStore((state) => state.deleteEvent);

  // Local state for forms
  const [editContent, setEditContent] = useState(content);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({ name: '', title: '', image: '' });
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '', date: '', description: '' });
  const [newPassword, setNewPassword] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
    const authStatus = sessionStorage.getItem('cdes_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isHydrated) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('cdes_admin_password') || 'Password@123';
    
    if (username === 'cdes_admin' && password === storedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cdes_admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cdes_admin_auth');
  };

  const handleSaveContent = () => {
    updateContent(editContent);
    alert('Content saved successfully!');
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.title && newStaff.image) {
      addStaff({ ...newStaff, id: Date.now().toString() } as Staff);
      setNewStaff({ name: '', title: '', image: '' });
    } else {
      alert('Please fill all staff fields');
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.description) {
      addEvent({ ...newEvent, id: Date.now().toString() } as Event);
      setNewEvent({ title: '', date: '', description: '' });
    } else {
      alert('Please fill all event fields');
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length >= 8) {
      localStorage.setItem('cdes_admin_password', newPassword);
      alert('Password changed successfully!');
      setNewPassword('');
    } else {
      alert('Password must be at least 8 characters long');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Login</h1>
          <p className="text-center text-gray-500 mb-8">CDES Taraba State University</p>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium text-center border border-red-100">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">Return to Website</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-900 text-white flex-shrink-0 shadow-xl z-10 md:min-h-screen">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold tracking-tight">CDES Admin</h2>
          <p className="text-blue-300 text-xs mt-1">Content Management System</p>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'content', label: 'General Content' },
            { id: 'staff', label: 'Staff Directory' },
            { id: 'events', label: 'Events Management' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                activeTab === tab.id ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-blue-800 md:absolute bottom-0 w-full md:w-64">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-300 hover:bg-red-900/30 rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
          <Link href="/" className="w-full flex items-center gap-2 px-4 py-3 text-blue-300 hover:bg-blue-800/50 rounded-xl transition-colors font-medium mt-2">
            View Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">{activeTab.replace('-', ' ')}</h1>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Edit size={20} className="text-blue-500" />
                  Text Content
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      value={editContent.mission}
                      onChange={(e) => setEditContent({ ...editContent, mission: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
                    <textarea
                      value={editContent.vision}
                      onChange={(e) => setEditContent({ ...editContent, vision: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                      rows={4}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={editContent.contactEmail}
                        onChange={(e) => setEditContent({ ...editContent, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="text"
                        value={editContent.contactPhone}
                        onChange={(e) => setEditContent({ ...editContent, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                    <input
                      type="text"
                      value={editContent.contactAddress}
                      onChange={(e) => setEditContent({ ...editContent, contactAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-500" />
                  Images (URLs)
                </h3>
                <div className="space-y-6">
                  <ImageUpload
                    label="Logo Image"
                    value={editContent.logoImage}
                    onChange={(val) => setEditContent({ ...editContent, logoImage: val })}
                  />
                  <ImageUpload
                    label="Banner Image"
                    value={editContent.bannerImage}
                    onChange={(val) => setEditContent({ ...editContent, bannerImage: val })}
                  />
                  <ImageUpload
                    label="VC Image"
                    value={editContent.vcImage}
                    onChange={(val) => setEditContent({ ...editContent, vcImage: val })}
                  />
                  <ImageUpload
                    label="Director Image"
                    value={editContent.directorImage}
                    onChange={(val) => setEditContent({ ...editContent, directorImage: val })}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveContent}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md"
              >
                <Save size={20} />
                Save All Changes
              </button>
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-emerald-500" />
                  Add New Staff
                </h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="e.g. Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newStaff.title}
                      onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="e.g. Admin Officer"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Staff Image"
                      value={newStaff.image || ''}
                      onChange={(val) => setNewStaff({ ...newStaff, image: val })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddStaff}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
                >
                  Add Staff Member
                </button>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Current Staff Directory</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                        <th className="pb-4 font-semibold">Image</th>
                        <th className="pb-4 font-semibold">Name</th>
                        <th className="pb-4 font-semibold">Title</th>
                        <th className="pb-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {content.staff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4">
                            <img src={staff.image} alt={staff.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                          </td>
                          <td className="py-4 font-medium text-gray-900">{staff.name}</td>
                          <td className="py-4 text-gray-600">{staff.title}</td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => deleteStaff(staff.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-emerald-500" />
                  Add New Event
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="e.g. Annual Career Fair"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                      rows={3}
                      placeholder="Brief description of the event..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Event Image (Optional)"
                      value={newEvent.image || ''}
                      onChange={(val) => setNewEvent({ ...newEvent, image: val })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddEvent}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
                >
                  Add Event
                </button>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Manage Events</h3>
                <div className="space-y-4">
                  {content.events.map((event) => (
                    <div key={event.id} className="flex justify-between items-start p-4 border border-gray-100 rounded-2xl hover:border-blue-200 transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
                        <p className="text-sm text-blue-600 font-medium mb-2">{event.date}</p>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {content.events.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No events found. Add one above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-blue-500" />
                Change Admin Password
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Enter new password (min 8 chars)"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
