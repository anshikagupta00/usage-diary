import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Tracker = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [calendar, setCalendar] = useState({});
  const [mode, setMode] = useState('taken');

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('services')) || [];
    const found = all.find(s => s.id === parseInt(serviceId));
    if (!found) return navigate('/');
    setService(found);
    setCalendar(found.calendar || {});
  }, [serviceId, navigate]);

  if (!service) return <p className="mt-10 text-center">Loading...</p>;

  const saveToLocalStorage = (updated) => {
    const all = JSON.parse(localStorage.getItem('services')) || [];
    const updatedServices = all.map(s =>
      s.id === service.id ? { ...s, calendar: updated } : s
    );
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const handleSlotToggle = (date, slotIndex) => {
    const updated = { ...calendar };
    if (!updated[monthKey]) updated[monthKey] = {};
    if (!updated[monthKey][date]) {
      updated[monthKey][date] = {
        slotStatus: Array(service.slotCount).fill(mode === 'not')
      };
    }
    updated[monthKey][date].slotStatus[slotIndex] = !updated[monthKey][date].slotStatus[slotIndex];
    setCalendar(updated);
    saveToLocalStorage(updated);
  };

  const resetCalendarMonth = () => {
    const updated = { ...calendar };
    delete updated[monthKey];
    setCalendar(updated);
    saveToLocalStorage(updated);
  };

  const calculateTotal = () => {
    let total = 0;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendar[monthKey]?.[dateStr];
      if (dayData) {
        const slots = dayData.slotStatus || [];
        total += slots.filter(status => status).length * service.cost;
      } else {
        if (mode === 'not') {
          total += service.slotCount * service.cost;
        }
      }
    }
    return total;
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const calendarCells = [];
  for (let i = 0; i < offset; i++) calendarCells.push(<div key={`empty-${i}`} />);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = calendar[monthKey]?.[dateStr];
    const defaultStatus = mode === 'not';

    calendarCells.push(
      <div key={dateStr} className="bg-[#fff4e6] p-2 rounded shadow text-center border border-[#f0d9c4]">
        <h4 className="font-bold text-[#d65a31]">{day}</h4>
        {service.slotNames.map((slot, idx) => {
          const status = dayData?.slotStatus?.[idx] ?? defaultStatus;
          return (
            <button
              key={idx}
              onClick={() => handleSlotToggle(dateStr, idx)}
              className={`mt-1 w-full text-xs rounded px-2 py-1 font-medium ${
                status ? 'bg-[#90be6d] hover:bg-[#74b059]' : 'bg-[#e0c3a3] hover:bg-[#cda67e]'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    );
  }

  const downloadCSV = () => {
    const rows = [["Date", ...service.slotNames]];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const slotStatus = calendar[monthKey]?.[dateStr]?.slotStatus ?? Array(service.slotCount).fill(mode === 'not');
      const row = [dateStr, ...slotStatus.map(status => (status ? "Taken" : "Not Taken"))];
      rows.push(row);
    }

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" });
    link.download = `${service.title}_${monthName}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-bold mb-2 text-[#d65a31]">{service.title} - Tracker</h2>
      <p><strong>Slots:</strong> {service.slotNames.join(', ')}</p>
      <p><strong>Cost per slot:</strong> ₹{service.cost}</p>

      <div className="my-4 flex gap-2 items-center">
        <span className="mr-2 font-semibold">Mode:</span>
        <button
          onClick={() => setMode('taken')}
          className={`px-3 py-1 rounded-l font-semibold ${
            mode === 'taken' ? 'bg-[#90be6d]' : 'bg-[#e0c3a3]'
          }`}
        >
          Mark Taken
        </button>
        <button
          onClick={() => setMode('not')}
          className={`px-3 py-1 rounded-r font-semibold ${
            mode === 'not' ? 'bg-[#e76f51]' : 'bg-[#e0c3a3]'
          }`}
        >
          Mark Not Taken
        </button>
        <button
          onClick={resetCalendarMonth}
          className="ml-auto bg-[#c0392b] hover:bg-[#a93226] text-white px-3 py-1 rounded font-semibold"
        >
          Reset Month
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
          className="bg-[#f0d9c4] px-3 py-1 rounded hover:bg-[#e6c5a4]"
        >
          ←
        </button>
        <h3 className="text-xl font-bold text-[#d65a31] text-center">
          {new Date(selectedYear, selectedMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
          className="bg-[#f0d9c4] px-3 py-1 rounded hover:bg-[#e6c5a4]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2 font-semibold text-[#5e4b3a]">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarCells}
      </div>

      <p className="mt-6 text-xl font-bold text-[#2a9d8f] text-center">
        Total Bill: ₹{calculateTotal()}
      </p>

      <button
        onClick={downloadCSV}
        className="mt-4 bg-[#e9c46a] hover:bg-[#d4af37] px-4 py-2 rounded text-[#3b2f2f] font-semibold"
      >
        Download Monthly Summary (CSV)
      </button>

      <br />

      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-[#ccc] hover:bg-[#bbb] px-4 py-2 rounded text-[#3b2f2f]"
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default Tracker;
