/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Search, UserPlus, Filter, ShieldCheck, Mail, Phone, MapPin, Tag, Trash2 } from 'lucide-react';
import { Consumer, ConnectionType } from '../types';

interface ConsumerViewProps {
  consumers: Consumer[];
  onAddConsumer: (consumer: Omit<Consumer, 'id' | 'dateJoined'>) => void;
  onDeleteConsumer: (id: string) => void;
}

export default function ConsumerView({ consumers, onAddConsumer, onDeleteConsumer }: ConsumerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [connectionType, setConnectionType] = useState<ConnectionType>('domestic');
  const [meterNo, setMeterNo] = useState('');

  // Handle opening modal and auto-suggesting a clean Meter No
  const openAddModal = () => {
    // Generate a beautiful, realistic meter number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    setMeterNo(`MTR-${randomSuffix}`);
    setShowAddModal(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) return;

    onAddConsumer({
      name,
      email,
      phone,
      address,
      connectionType,
      meterNo,
    });

    // Reset Form Fields
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setConnectionType('domestic');
    setShowAddModal(false);
  };

  // Filter & Search consumers
  const filteredConsumers = consumers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.meterNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || c.connectionType === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6" id="consumer-view-root">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Consumer Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage grid connections, meters, and subscription classifications</p>
        </div>
        <button
          id="btn-add-consumer-modal"
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Register Consumer
        </button>
      </div>

      {/* Filtering and Query interface */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xxs">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="consumer-search-input"
            type="text"
            placeholder="Search by name, customer ID, email, or meter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-2 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3" />
          <select
            id="filter-connection-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-3 py-3 focus:outline-none transition font-semibold appearance-none"
          >
            <option value="all">All Service Connections</option>
            <option value="domestic">Domestic Sub-system</option>
            <option value="commercial">Commercial Hubs</option>
            <option value="industrial">Industrial Facilities</option>
            <option value="agricultural">Agricultural Utilities</option>
          </select>
        </div>

        {/* Summary tag */}
        <div className="flex items-center justify-end px-3 font-mono text-xs text-slate-400 font-semibold uppercase">
          Filtered: {filteredConsumers.length} of {consumers.length}
        </div>
      </div>

      {/* Directory Cards layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="consumers-list-grid">
        {filteredConsumers.map((c) => {
          // Compute distinct visual tag colors and representations
          const tagColors = {
            domestic: 'bg-blue-50 text-blue-700 border-blue-200/60',
            commercial: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
            industrial: 'bg-purple-50 text-purple-700 border-purple-200/60',
            agricultural: 'bg-amber-50 text-amber-700 border-amber-200/60',
          }[c.connectionType];

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xs rounded-2xl p-5 transition-all flex flex-col justify-between group"
              id={`consumer-card-${c.id}`}
            >
              <div>
                {/* Header segment with badge and Delete icon */}
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border capitalize tracking-wide ${tagColors}`}>
                    {c.connectionType}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`delete-consumer-${c.id}`}
                      onClick={() => onDeleteConsumer(c.id)}
                      title="Decommission Consumer"
                      className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Profile detail section */}
                <div className="mt-4">
                  <h3 className="font-sans font-semibold text-slate-800 text-base leading-tight">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 font-mono text-xs font-semibold text-slate-400">
                    <span className="text-slate-500 bg-slate-55 py-0.5 px-1.5 rounded-sm select-all">{c.id}</span>
                    <span>·</span>
                    <span className="text-blue-600 bg-blue-50/50 py-0.5 px-1.5 rounded-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-500" />
                      {c.meterNo}
                    </span>
                  </div>
                </div>

                {/* Contact data listings */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-500">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate select-all">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="select-all">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" title={c.address}>{c.address}</span>
                  </div>
                </div>
              </div>

              {/* Bottom joined stats */}
              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono uppercase">
                <span>GRID JOINED</span>
                <span className="text-slate-500">{c.dateJoined}</span>
              </div>
            </div>
          );
        })}

        {filteredConsumers.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-700 text-sm">No Accounts Discovered</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">Check current parameter listings or configure a new consumer</p>
          </div>
        )}
      </div>

      {/* Registration Overlay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-consumer-modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold font-sans">Consumer Enrollment</h3>
                <p className="text-xs text-slate-300 mt-0.5">Setup a new state energy consumer registry</p>
              </div>
              <button
                id="close-add-modal-btn"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition text-lg"
              >
                &times;
              </button>
            </div>

            {/* Form Segment */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-medium">Full Name</label>
                <input
                  id="inp-consumer-name"
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Grid Connection Classification */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-slate-700 font-medium">Connection Tier</label>
                  <select
                    id="inp-consumer-connection"
                    value={connectionType}
                    onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="domestic">Domestic Subdivision</option>
                    <option value="commercial">Commercial/Retails</option>
                    <option value="industrial">High Voltage Industrial</option>
                    <option value="agricultural">Agricultural/Farming Subsidized</option>
                  </select>
                </div>
              </div>

              {/* Auto allocated Details preview */}
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Assigned ID</span>
                  <span className="font-semibold font-mono text-slate-700">CON-[AUTO]</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Meter serial number</span>
                  <span className="font-semibold font-mono text-blue-700">{meterNo}</span>
                </div>
              </div>

              {/* Contact specifications */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-medium">Email Address</label>
                  <input
                    id="inp-consumer-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-medium">Phone Line</label>
                  <input
                    id="inp-consumer-phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-medium">Service Address</label>
                <textarea
                  id="inp-consumer-address"
                  required
                  placeholder="321 Elm Drive, Elm City"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Modal footer controls */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  id="btn-cancel-enrollment"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-enrollment"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-bold"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
