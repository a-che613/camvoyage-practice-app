"use client"

import { Modal, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import Image from "next/image";


const CreateTrips = ({ open, onClose, setRefetch }) => {

  function formatTimeTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 or 12 to 12, and others to 1-11
    return `${String(formattedHours).padStart(2, '0')}:${minutes} ${period}`;
  }

  const [formData, setFormData] = useState({
    departure_city: '',
    destination_city: '',
    departure_station: '',
    destination_station: '',
    agency_name: '',
    ticket_price: '',
    departure_date: '',
    departure_time: '',
    estimated_duration: '',
    bus_class: '',
    allocated_seats: '',
    amenities: [],
  });


  const [amenityInput, setAmenityInput] = useState('');

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput(''); // Clear input
    }
  };

  // Remove an amenity
  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [name] == 'estimated_duration' || [name] == "ticket_price" || [name] == "allocated_seats" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log(formData);

    const newData = {
      ...formData,
      "departure_time": formatTimeTo12Hour(formData['departure_time'])
    }

    console.log(newData, 'new data');

    try {
      const response = await fetch('/api/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Trip created successfully!');
        setFormData({
          departure_city: '',
          destination_city: '',
          departure_station: '',
          destination_station: '',
          agency_name: '',
          ticket_price: '',
          departure_date: '',
          departure_time: '',
          estimated_duration: '',
          bus_class: '',
          allocated_seats: '',
          amenities: [],
        });
        setRefetch('refetch');
      } else {
        console.log(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('An error occurred while creating the trip.');
    }
  };

  return (
    <Modal open={open}>
      <div className="text-gray-600 box bg-red-600">
        <Box
          className="box-container"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'auto',
            paddingX: 3,
            paddingY: 2,
          }}
        >
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-semibold">Create Trips</p>
              <IoMdClose size={24} onClick={onClose} className="cursor-pointer" />
            </div>
            <form className="grid grid-cols-2 gap-[20px]" onSubmit={handleSubmit}>
              {[
                { label: 'Departure City', name: 'departure_city' },
                { label: 'Destination City', name: 'destination_city' },
                { label: 'Departure Station', name: 'departure_station' },
                { label: 'Destination Station', name: 'destination_station' },
                { label: 'Agency Name', name: 'agency_name' },
                { label: 'Ticket Price', name: 'ticket_price', type: 'number' },
                { label: 'Departure Date', name: 'departure_date', type: 'date' },
                { label: 'Departure Time', name: 'departure_time', type: 'time' },
                { label: 'Estimated Duration', name: 'estimated_duration', type: 'number' },
                { label: 'Bus Class', name: 'bus_class' },
                { label: 'Allocated Seats', name: 'allocated_seats', type: 'number' },
              ].map(({ label, name, type = 'text' }) => (
                <div key={name} className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">{label}</p>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]"
                  />
                </div>
              ))}

              <div className="col-span-2 flex flex-col gap-[6px]">
                <p className="text-[14px]">Amenities</p>
                <div className="flex flex-wrap gap-[10px] my-[10px]">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-[5px] bg-gray-200 px-[10px] py-[5px] rounded-[20px] text-[13px] border border-gray-500"
                    >
                      <span>{amenity}</span>
                      <IoMdClose
                        size={16}
                        onClick={() => handleRemoveAmenity(index)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-[10px]">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px] flex-grow w-full"
                    placeholder="Enter an amenity"
                  />
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={handleAddAmenity}
                      className="bg-blue-700 px-[10px] rounded-[4px] py-[5px] text-white h-[48px] lg:h-[50px]"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-700 px-[10px] rounded-[4px] py-[5px] w-full h-[50px] text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </Box>
      </div>
    </Modal>
  );
};


export default CreateTrips;