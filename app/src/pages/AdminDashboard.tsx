import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  CheckCircle,
  XCircle,
  Search,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { vehicles as defaultVehicles, type Vehicle } from '../data/vehicles';

interface Booking {
  id: string;
  userName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

// Storage key for localStorage
const VEHICLES_STORAGE_KEY = 'rochester_rentals_vehicles';

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings' | 'users'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setVehicles(parsed);
      } catch (e) {
        setVehicles(defaultVehicles);
      }
    } else {
      setVehicles(defaultVehicles);
    }
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin && !user?.isAdmin) {
      navigate('/');
    }
  }, [isAdmin, user, navigate]);

  // Mock bookings data
  const bookings: Booking[] = [
    { id: '1', userName: 'John Doe', vehicleName: 'Ford Mustang', startDate: '2026-03-15', endDate: '2026-03-18', totalPrice: 255, status: 'confirmed' },
    { id: '2', userName: 'Jane Smith', vehicleName: 'Honda CR-V Hybrid', startDate: '2026-03-20', endDate: '2026-03-25', totalPrice: 375, status: 'pending' },
    { id: '3', userName: 'Mike Johnson', vehicleName: 'Mercedes G-Class', startDate: '2026-03-10', endDate: '2026-03-12', totalPrice: 590, status: 'completed' },
  ];

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleVisibility = (id: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, isHidden: !v.isHidden } : v
    ));
    setHasChanges(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      setHasChanges(true);
    }
  };

  const handleSaveVehicle = (vehicle: Vehicle) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    } else {
      setVehicles(prev => [...prev, { ...vehicle, id: Date.now().toString() }]);
    }
    setShowAddModal(false);
    setEditingVehicle(null);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    setHasChanges(false);
    alert('Changes saved successfully!');
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all vehicles to default? This will remove all your changes.')) {
      localStorage.removeItem(VEHICLES_STORAGE_KEY);
      setVehicles(defaultVehicles);
      setHasChanges(false);
    }
  };

  const handleRefresh = () => {
    const stored = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setVehicles(parsed);
      } catch (e) {
        setVehicles(defaultVehicles);
      }
    } else {
      setVehicles(defaultVehicles);
    }
    setHasChanges(false);
  };

  if (!isAdmin && !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Header */}
      <div className="px-[7vw] mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-display text-3xl text-white">ADMIN DASHBOARD</h1>
            <p className="text-[#A6AAB4]">Welcome back, {user?.firstName}</p>
          </div>
          <button onClick={logout} className="btn-outline flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-[7vw] mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glass p-4">
            <Car size={24} className="text-gold mb-2" />
            <div className="text-2xl font-bold text-white">{vehicles.length}</div>
            <div className="text-[#A6AAB4] text-sm">Total Vehicles</div>
          </div>
          <div className="card-glass p-4">
            <Eye size={24} className="text-gold mb-2" />
            <div className="text-2xl font-bold text-white">{vehicles.filter(v => !v.isHidden).length}</div>
            <div className="text-[#A6AAB4] text-sm">Visible</div>
          </div>
          <div className="card-glass p-4">
            <Calendar size={24} className="text-gold mb-2" />
            <div className="text-2xl font-bold text-white">{bookings.length}</div>
            <div className="text-[#A6AAB4] text-sm">Active Bookings</div>
          </div>
          <div className="card-glass p-4">
            <DollarSign size={24} className="text-gold mb-2" />
            <div className="text-2xl font-bold text-white">$1,220</div>
            <div className="text-[#A6AAB4] text-sm">Revenue (MTD)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-[7vw] mb-6">
        <div className="flex gap-4 border-b border-white/10">
          {[
            { id: 'vehicles', label: 'Vehicles', icon: Car },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'text-gold border-gold'
                  : 'text-[#A6AAB4] border-transparent hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-[7vw]">
        {activeTab === 'vehicles' && (
          <div>
            {/* Actions */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6AAB4]" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-charcoal-light border border-white/10 pl-10 pr-4 py-2 text-white text-sm focus:border-gold focus:outline-none w-64"
                  />
                </div>
                <button 
                  onClick={handleRefresh}
                  className="p-2 text-[#A6AAB4] hover:text-gold transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <button 
                    onClick={handleSaveChanges}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                )}
                <button 
                  onClick={handleResetToDefault}
                  className="btn-outline flex items-center gap-2 text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400"
                >
                  Reset to Default
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Vehicle
                </button>
              </div>
            </div>

            {/* Vehicles Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Price/Day</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-[#A6AAB4] text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-charcoal-light rounded overflow-hidden">
                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{vehicle.name}</div>
                            <div className="text-[#A6AAB4] text-sm">{vehicle.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm capitalize">{vehicle.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gold font-medium">${vehicle.pricePerDay}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-white">{vehicle.rating}</span>
                          <span className="text-[#A6AAB4] text-sm">({vehicle.tripCount})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-sm ${vehicle.isHidden ? 'text-red-400' : 'text-green-400'}`}>
                          {vehicle.isHidden ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          {vehicle.isHidden ? 'Hidden' : 'Visible'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleVisibility(vehicle.id)}
                            className="p-2 text-[#A6AAB4] hover:text-gold transition-colors"
                            title={vehicle.isHidden ? 'Show' : 'Hide'}
                          >
                            {vehicle.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setShowAddModal(true);
                            }}
                            className="p-2 text-[#A6AAB4] hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-2 text-[#A6AAB4] hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car size={48} className="text-gold mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No vehicles found</h3>
                <p className="text-[#A6AAB4]">Try adjusting your search or add a new vehicle.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Dates</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-[#A6AAB4] text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{booking.userName}</td>
                      <td className="py-3 px-4 text-white">{booking.vehicleName}</td>
                      <td className="py-3 px-4 text-[#A6AAB4]">
                        {booking.startDate} to {booking.endDate}
                      </td>
                      <td className="py-3 px-4 text-gold">${booking.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-sm capitalize ${
                          booking.status === 'confirmed' ? 'text-green-400' :
                          booking.status === 'pending' ? 'text-yellow-400' :
                          booking.status === 'completed' ? 'text-blue-400' :
                          'text-red-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="text-center py-12">
            <Users size={48} className="text-gold mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">User Management</h3>
            <p className="text-[#A6AAB4]">User management will be available after Supabase integration.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showAddModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => {
            setShowAddModal(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
}

// Vehicle Modal Component
function VehicleModal({ 
  vehicle, 
  onClose, 
  onSave 
}: { 
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}) {
  const [formData, setFormData] = useState<Partial<Vehicle>>(vehicle || {
    name: '',
    make: '',
    model: '',
    category: 'suv',
    year: 2024,
    seats: 5,
    transmission: 'Auto',
    mpg: 25,
    pricePerDay: 75,
    image: '/vehicles/placeholder.jpg',
    images: [],
    description: '',
    features: [],
    turoUrl: '',
    turoId: '',
    rating: 5.0,
    tripCount: 0,
    isAvailable: true,
    isHidden: false,
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Vehicle);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-charcoal-light w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/10 shadow-2xl">
        <div className="p-6">
          <h2 className="heading-display text-2xl text-white mb-6">
            {vehicle ? 'EDIT VEHICLE' : 'ADD NEW VEHICLE'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Make</label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Price/Day ($)</label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                >
                  <option value="economy">Economy</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                >
                  <option value="Auto">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="text-[#A6AAB4] text-sm mb-1 block">MPG</label>
                <input
                  type="number"
                  value={formData.mpg}
                  onChange={(e) => setFormData({ ...formData, mpg: parseInt(e.target.value) })}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="/vehicles/vehicle-name.jpg"
              />
            </div>

            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                  placeholder="Add a feature (e.g., Apple CarPlay)"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-primary px-4"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gold/20 text-gold text-xs px-2 py-1 rounded"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Turo URL</label>
              <input
                type="url"
                value={formData.turoUrl}
                onChange={(e) => setFormData({ ...formData, turoUrl: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="https://turo.com/..."
              />
            </div>

            <div>
              <label className="text-[#A6AAB4] text-sm mb-1 block">Turo ID</label>
              <input
                type="text"
                value={formData.turoId}
                onChange={(e) => setFormData({ ...formData, turoId: e.target.value })}
                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                placeholder="1234567"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                Hidden
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                {vehicle ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
