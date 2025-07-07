import React from 'react'

const ServiceForm = () => {

    const [title, setTitle] = React.useState('')
    const [slotCount, setSlotCount] = React.useState(1)
    const [slotNames, setSlotNames] = React.useState([''])
    const [cost, setCost] = React.useState('')
    
    const handleSlotCountChange = (e) => {
        const count = parseInt(e.target.value)
        setSlotCount(count)

        const updatedSlots= Array(count).fill('')
        setSlotNames(updatedSlots);
    }

    const handleSlotNameChange = (index, value) => {
        const updatedSlots = [...slotNames]
        updatedSlots[index] = value
        setSlotNames(updatedSlots)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const newService = {
            id: Date.now(),
            title,
            slotCount,
            slotNames,
            cost: parseFloat(cost),
            calendar:{}
        }

        const old=JSON.parse(localStorage.getItem('services')) || []
        old.push(newService)
        localStorage.setItem('services', JSON.stringify(old))

        // Reset form
        setTitle('')
        setSlotCount(1)
        setSlotNames([''])
        setCost('')
        alert('Service added successfully!')
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

        {/* title */}
        <input 
            type="text"
            placeholder="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
        />

        {/* Slot Count */}
        <input 
            type="text" 
            min={1}
            max={5}
            value={slotCount}
            onChange={handleSlotCountChange}
            className="w-full p-2 rounded text-black"
        />

        {/* Slot Names */}
        {slotNames.map((slot,index)=>(
            <input 
                key={index}
                type="text"
                placeholder={`Slot ${index + 1} Name`}
                value={slot}
                onChange={(e) => handleSlotNameChange(index, e.target.value)}
                className="w-full p-2 rounded text-black"
                required
            />
        ))}

        {/* Cost */}
        <input 
            type="number"
            placeholder="Cost per Slot"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
        />

        {/* Submit Button */}
        <button
            type="submit"
            className=" w-full mt-4 bg-[#e9c46a] hover:bg-[#d4af37] px-4 py-2 rounded text-[#3b2f2f] font-semibold"
        >
            Save Service
        </button>   

    </form>
  )
}

export default ServiceForm

