import React, { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

function ServiceList() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('services')) || [];
    setServices(saved);
  }, []);

  // 🧹 Delete service by ID
  const handleDelete = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    localStorage.setItem('services', JSON.stringify(updated));
  };

  if (services.length === 0) {
    return <p className="text-center mt-6">No services added yet.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-[#d65a31]">Your Services</h2>

      {services.map((service) => (
        <div key={service.id} className="p-4 rounded shadow relative">
          {/* Title and delete icon row */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p>Slots: {service.slotNames.join(', ')}</p>
              <p>Cost per slot: ₹{service.cost}</p>
            </div>

            <button
              onClick={() => handleDelete(service.id)}
              className="text-red-400 hover:text-red-600"
              title="Delete Service"
            >
              <Trash size={18} />
            </button>
          </div>

          {/* Open tracker button */}
          <button
            className="mt-4 bg-[#e9c46a] hover:bg-[#d4af37] px-4 py-2 rounded text-[#3b2f2f] font-semibold"
            onClick={() => navigate(`/tracker/${service.id}`)}
          >
            Open Tracker
          </button>
        </div>
      ))}
    </div>
  );
}

export default ServiceList;
