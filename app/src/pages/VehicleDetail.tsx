import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Users, 
  Fuel, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Star,
  MapPin,
  Info,
  Shield
} from 'lucide-react';
import { vehicles as defaultVehicles, categoryLabels } from '../data/vehicles';
import { format, addDays, isSameDay, parseISO } from 'date-fns';

const VEHICLES_STORAGE_KEY = 'rochester_rentals_vehicles';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Load vehicles from localStorage
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
  
  const vehicle = vehicles.find(v => v.id === id);
  const [mainImage, setMainImage] = useState<string>(vehicle?.image || '');

  // Update main image when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setMainImage(vehicle.image);
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-charcoal pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-3xl text-white mb-4">Vehicle Not Found</h1>
          <p className="text-[#A6AAB4] mb-6">The vehicle you're looking for doesn't exist.</p>
          <Link to="/fleet" className="btn-primary">Back to Fleet</Link>
        </div>
      </div>
    );
  }

  const totalDays = selectedStartDate && selectedEndDate 
    ? Math.ceil((new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  
  const totalPrice = totalDays * vehicle.pricePerDay;

  const isDateBooked = (date: Date) => {
    return vehicle.bookedDates.some(bookedDate => 
      isSameDay(parseISO(bookedDate), date)
    );
  };

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      days.push(addDays(today, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateSelect = (date: Date) => {
    if (isDateBooked(date)) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(dateStr);
      setSelectedEndDate('');
    } else if (selectedStartDate && !selectedEndDate) {
      if (dateStr < selectedStartDate) {
        setSelectedStartDate(dateStr);
      } else {
        const start = parseISO(selectedStartDate);
        let hasBookedInRange = false;
        for (let d = new Date(start); d <= date; d = addDays(d, 1)) {
          if (isDateBooked(d) && !isSameDay(d, date)) {
            hasBookedInRange = true;
            break;
          }
        }
        if (!hasBookedInRange) {
          setSelectedEndDate(dateStr);
        }
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateStr >= selectedStartDate && dateStr <= selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateStr === selectedStartDate || dateStr === selectedEndDate;
  };

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-12">
      {/* Back Button */}
      <div className="px-[7vw] mb-6">
        <Link 
          to="/fleet" 
          className="inline-flex items-center gap-2 text-[#A6AAB4] hover:text-gold transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Back to Fleet</span>
        </Link>
      </div>

      <div className="px-[7vw]">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Gallery */}
          <div>
            <div className="aspect-video bg-charcoal-light rounded-lg overflow-hidden mb-4">
              <img
                src={mainImage}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`aspect-video bg-charcoal-light rounded overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-gold' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img
                    src={img}
                    alt={`${vehicle.name} view ${i + 1}`}
                    className={`w-full h-full object-cover transition-opacity ${mainImage === img ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-gold text-sm font-semibold">{categoryLabels[vehicle.category]}</span>
                <h1 className="heading-display text-3xl text-white mt-1">{vehicle.name}</h1>
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-gold">${vehicle.pricePerDay}</div>
                <div className="text-[#A6AAB4] text-sm">per day</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold" fill="currentColor" />
                ))}
              </div>
              <span className="text-white text-sm font-semibold">{vehicle.rating}</span>
              <span className="text-[#A6AAB4] text-sm">({vehicle.tripCount} trips)</span>
            </div>

            {/* Description */}
            <p className="text-[#A6AAB4] mb-6">{vehicle.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-charcoal-light rounded">
                <Calendar size={18} className="text-gold mx-auto mb-1" />
                <div className="text-white text-sm font-semibold">{vehicle.year}</div>
                <div className="text-[#A6AAB4] text-xs">Year</div>
              </div>
              <div className="text-center p-3 bg-charcoal-light rounded">
                <Users size={18} className="text-gold mx-auto mb-1" />
                <div className="text-white text-sm font-semibold">{vehicle.seats}</div>
                <div className="text-[#A6AAB4] text-xs">Seats</div>
              </div>
              <div className="text-center p-3 bg-charcoal-light rounded">
                <Fuel size={18} className="text-gold mx-auto mb-1" />
                <div className="text-white text-sm font-semibold">{vehicle.transmission}</div>
                <div className="text-[#A6AAB4] text-xs">Transmission</div>
              </div>
              <div className="text-center p-3 bg-charcoal-light rounded">
                <Info size={18} className="text-gold mx-auto mb-1" />
                <div className="text-white text-sm font-semibold">{vehicle.mpg > 0 ? vehicle.mpg : 'EV'}</div>
                <div className="text-[#A6AAB4] text-xs">{vehicle.mpg > 0 ? 'MPG' : 'Range'}</div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-1 text-sm text-[#A6AAB4] bg-charcoal-light px-3 py-1.5 rounded"
                  >
                    <CheckCircle2 size={14} className="text-gold" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Check Availability</h3>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-gold text-sm hover:underline"
                >
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </button>
              </div>

              {showCalendar && (
                <div className="bg-charcoal-light rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-[#A6AAB4] text-xs py-1">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      const isBooked = isDateBooked(date);
                      const isSelected = isDateSelected(date);
                      const inRange = isDateInRange(date);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          disabled={isBooked}
                          className={`
                            aspect-square flex items-center justify-center text-xs rounded
                            ${isBooked 
                              ? 'bg-red-500/20 text-red-400 cursor-not-allowed' 
                              : isSelected
                                ? 'bg-gold text-charcoal font-semibold'
                                : inRange
                                  ? 'bg-gold/20 text-gold'
                                  : 'bg-charcoal text-white hover:bg-white/10'
                            }
                          `}
                        >
                          {format(date, 'd')}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-charcoal rounded" />
                      <span className="text-[#A6AAB4]">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gold rounded" />
                      <span className="text-[#A6AAB4]">Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500/20 rounded" />
                      <span className="text-[#A6AAB4]">Booked</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Dates Summary */}
              {selectedStartDate && (
                <div className="bg-charcoal-light rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#A6AAB4] text-sm">Pickup:</span>
                    <span className="text-white text-sm">{format(parseISO(selectedStartDate), 'MMM dd, yyyy')}</span>
                  </div>
                  {selectedEndDate && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#A6AAB4] text-sm">Return:</span>
                        <span className="text-white text-sm">{format(parseISO(selectedEndDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#A6AAB4] text-sm">{totalDays} days × ${vehicle.pricePerDay}</span>
                          <span className="text-gold font-semibold">${totalPrice}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Rental Options */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold mb-3">Choose How to Book</h3>
              
              {/* Direct Booking */}
              <Link
                to={selectedStartDate && selectedEndDate ? `/booking?vehicle=${vehicle.id}&start=${selectedStartDate}&end=${selectedEndDate}` : '/booking'}
                className="block w-full"
              >
                <div className="bg-gold hover:bg-gold-light transition-colors rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-charcoal font-semibold">Book Direct</div>
                      <div className="text-charcoal/70 text-sm">Best rates & flexible cancellation</div>
                    </div>
                    <div className="text-charcoal font-bold">
                      ${vehicle.pricePerDay}<span className="text-xs font-normal">/day</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Turo Booking */}
              <a
                href={vehicle.turoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <div className="bg-charcoal-light hover:bg-white/5 border border-white/10 hover:border-gold/30 transition-all rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          Book on Turo
                          <ExternalLink size={14} className="text-gold" />
                        </div>
                        <div className="text-[#A6AAB4] text-sm">Verified Power Host with 5.0 rating</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-gold" fill="currentColor" />
                      <span className="text-white text-sm">5.0</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-charcoal-light rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">Free Delivery</div>
                  <div className="text-[#A6AAB4] text-sm">We deliver directly to DTW Airport terminal at no extra charge.</div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="mt-4 p-4 bg-charcoal-light rounded-lg">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-gold mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">Insurance Included</div>
                  <div className="text-[#A6AAB4] text-sm">All rentals include basic liability coverage.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
