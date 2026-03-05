import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Calendar, ExternalLink, Star, Filter } from 'lucide-react';
import { vehicles as defaultVehicles, categoryLabels, type Vehicle } from '../data/vehicles';

const VEHICLES_STORAGE_KEY = 'rochester_rentals_vehicles';

export default function Fleet() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name'>('price-low');
  const [vehicles, setVehicles] = useState<Vehicle[]>(defaultVehicles);

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
    }
  }, []);

  const categories = ['all', 'economy', 'suv', 'luxury', 'sports', 'hybrid'];

  const filteredVehicles = vehicles
    .filter(v => !v.isHidden)
    .filter(v => selectedCategory === 'all' || v.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      return a.name.localeCompare(b.name);
    });

  const visibleVehicles = vehicles.filter(v => !v.isHidden);
  const minPrice = visibleVehicles.length > 0 ? Math.min(...visibleVehicles.map(v => v.pricePerDay)) : 0;

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Header */}
      <div className="px-[7vw] mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="heading-display text-[clamp(32px,5vw,64px)] text-white mb-2">
              OUR FLEET
            </h1>
            <p className="text-[#A6AAB4]">
              {filteredVehicles.length} vehicles available • Starting from ${minPrice}/day
            </p>
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-[#A6AAB4] text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-charcoal-light border border-white/10 text-white text-sm px-3 py-2 rounded focus:border-gold focus:outline-none"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-[7vw] mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm rounded transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-charcoal font-semibold'
                  : 'bg-charcoal-light text-[#A6AAB4] border border-white/10 hover:border-gold'
              }`}
            >
              {cat === 'all' ? 'All Vehicles' : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="px-[7vw]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#A6AAB4] text-lg">No vehicles found in this category.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-gold text-sm mt-4 hover:underline"
            >
              View all vehicles
            </button>
          </div>
        )}
      </div>

      {/* Fleet Features */}
      <div className="px-[7vw] mt-16">
        <div className="card-glass p-8">
          <h3 className="text-white font-semibold text-lg mb-6 text-center">All Vehicles Include:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Professional Cleaning' },
              { icon: Fuel, label: 'Regular Maintenance' },
              { icon: ExternalLink, label: '24/7 Roadside Support' },
              { icon: Filter, label: 'Transparent Pricing' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 justify-center">
                <Icon size={18} className="text-gold" />
                <span className="text-[#A6AAB4] text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="card-glass overflow-hidden group hover:border-gold/30 transition-all">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-charcoal">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gold text-charcoal text-xs font-semibold px-2 py-1 rounded">
            {categoryLabels[vehicle.category]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-charcoal/80 text-white text-sm font-bold px-3 py-1 rounded">
            ${vehicle.pricePerDay}<span className="text-xs font-normal text-[#A6AAB4]">/day</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-semibold text-lg">{vehicle.name}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-gold" fill="currentColor" />
            <span className="text-white text-sm">{vehicle.rating}</span>
          </div>
        </div>
        <p className="text-[#A6AAB4] text-sm mb-4 line-clamp-2">{vehicle.description}</p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-[#A6AAB4]">
            <Calendar size={14} className="text-gold" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1 text-[#A6AAB4]">
            <Users size={14} className="text-gold" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1 text-[#A6AAB4]">
            <Fuel size={14} className="text-gold" />
            <span>{vehicle.mpg > 0 ? `${vehicle.mpg} MPG` : 'Electric'}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          {vehicle.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs text-[#A6AAB4] bg-charcoal px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="flex-1 btn-primary text-center text-xs py-3"
          >
            View Details
          </Link>
          <a
            href={vehicle.turoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs py-3 px-4 flex items-center gap-2"
          >
            Turo <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
