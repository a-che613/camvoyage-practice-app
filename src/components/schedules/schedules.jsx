"use client"

import { logoMaker } from "../../../utils/logo_maker";
import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { IoMdClose } from 'react-icons/io';
import {saveTicketToFirestore} from "../../../utils/create-ticket";



const Schedules = ({trips}) => {

  
  const [showModal, setShowModal] = useState(false);

  const [travelerName, setTravelerName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [seatCount, setSeatCount] = useState(1);

  const [selectedAgency, setSelectedAgency] = useState({});

  return (
    <div className="w-full flex flex-col items-center justify-center py-[50px] gap-[16px]" id="schedules">
      <div className="flex items-start justify-start w-[90%] lg:w-[80%]">
        <p className="text-3xl">Schedules</p>
      </div>
      <div className="w-[90%] lg:w-[80%] flex flex-col gap-[24px]">
        {trips.map((trip, index) => (
          <div key={index} className="w-full flex flex-col lg:flex-row rounded-[8px] py-[30px] bg-black bg-opacity-20 shadow-md shadow-[#ffffff31] relative pr-[30px] max-lg:px-[20px]">
            <p className="absolute top-0 right-0 bg-white bg-opacity-85 text-blue-600 font-semibold h-[24px] rounded-tr-[8px] flex items-center justify-center px-[10px] rounded-bl-[8px]">{trip?.trip_status.toUpperCase() ?? ''}</p>
            <div className="w-full lg:w-[20%] flex flex-row lg:flex-col items-center justify-start lg:justify-center gap-[6px] max-lg:mb-[28px]">
              <div className="border w-[80px] h-[80px] rounded-[100%] bg-white bg-opacity-85 text-[#333] flex items-center justify-center tracking-widest font-medium">{logoMaker(trip?.agency_name ?? '')}</div>
              <p>{trip?.agency_name ?? ''}</p>
            </div>
            <div className="grid lg:grid-cols-2 grow max-lg:gap-[20px]">
              <div className="flex flex-col gap-[16px] lg:border-r border-[#ffffff89] lg:pr-[20px]">
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center justify-between">
                    <p>{trip?.travelRoute?.departure_city}</p>
                    <p>{trip?.travelRoute?.destination_city}</p>
                  </div>
                  <div className="h-[1px] border w-full border-[#ffffff89]" />
                  <div className="flex items-center justify-between">
                    <p>{trip?.travelRoute?.departure_station}</p>
                    <p>{trip?.travelRoute?.destination_station}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Departure Time</p>
                    <p>{trip?.departure_time ?? ''}</p>
                  </div>
                  <div className="h-[1px] border border-[#ffffff89] w-full" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Arrival Time</p>
                    <p>{trip?.arrival_time ?? ''}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[16px] lg:pl-[20px]">
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{'Bus Class'}</p>
                    <p>{trip?.bus_class}</p>
                  </div>
                  <div className="h-[1px] border w-full border-[#ffffff89]" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{'Amenities'}</p>
                    <div>{trip?.amenities?.map((amenity, index) => <p key={index}>{amenity}</p>)}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Available Seats</p>
                    <p>{trip?.available_seats ?? ''}</p>
                  </div>
                  {/* <div className="h-[1px] border border-[#ffffff89] w-full"/> */}
                  <div className="flex items-center justify-end">
                    <button className="bg-blue-700 px-[10px] rounded-[4px] py-[5px] w-full" onClick={() => {
                      setSelectedAgency(trip);
                      setShowModal(true);
                    }}>Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showModal}
      >
        <div className=" text-gray-600 box bg-red-600">
          <Box
            className="box-container "
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
              // p: 4,
              paddingX: 3,
              paddingY: 2,
              // '& .box-container': {
              //   width: '80%'
              // },
            }}
          >
            <div className='flex flex-col gap-[20px]'>
              <div className="flex items-center justify-end">
                <IoMdClose
                  size={24}
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">Full Name</p>
                  <input type="text" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" value={travelerName} onChange={(e) => setTravelerName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">ID Number/Foreign Passport No</p>
                  <input type="text" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">Number of Seats</p>
                  <input type="number" readOnly value={seatCount} className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" onChange={(e) => setSeatCount(e.target.value)} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">Phone Number</p>
                  <input type="number" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              </div>
              <div>
                <button className="bg-blue-700 px-[10px] rounded-[4px] py-[5px] w-full h-[50px] text-white"
                  onClick={() => {
                    saveTicketToFirestore(
                      {
                        travelerName,
                        idNumber,
                        phoneNumber,
                        seatCount,
                      },
                      selectedAgency
                    )
                  }}
                >Generate Ticket</button>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}

export default Schedules;