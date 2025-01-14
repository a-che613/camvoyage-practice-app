"use client"

import { Modal, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import Image from "next/image";


const DeleteTrips = ({ open, onClose }) => {

  const deleteOptions = [
    'Trip Status',
    'Date'
  ]

  const [activeOption, setActiveOption] = useState(0);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');


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
            width: '40%',
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
              <p className="text-[20px] font-semibold">Delete Trips</p>
              <IoMdClose size={24} onClick={onClose} className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-[30px]">

              <div>
                <p>Delete by:</p>
                <div className="flex gap-[20px] items-center">
                  {deleteOptions.map((opt, index) => (
                    <div key={index} className={`border py-[10px] px-[8px] rounded-[4px] cursor-pointer ${index == activeOption ? "border-blue-600 bg-blue-50" : "border-gray-400 bg-gray-50"}`}
                      onClick={() => setActiveOption(index)}
                    >{opt}</div>
                  ))}
                </div>
              </div>
              {deleteOptions[activeOption] == "Date" && <div className="flex flex-col gap-[8px]">
                <p className="text-[14px]">Select a date</p>
                <input type="date" className="h-[48px] lg:h-[50px] border rounded-[4px]" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>}
              {deleteOptions[activeOption] == "Trip Status" && <div className="flex flex-col gap-[8px]">
                <p className="text-[14px]">Select a status</p>
                <div className="relative">
                  <div className="h-[48px] lg:h-[50px] border w-full rounded-[4px] px-[16px] flex items-center ">{selectedStatus}</div>
                  <div className="absolute bg-white shadow-xl left-0 right-0">
                    {
                      [
                        'Scheduled',
                        'On Time',
                        'Onboarding',
                        'Expired',
                        'Cancelled'
                      ].map((status, index) => (
                        <div key={index} className="px-[16px] py-[3px] cursor-pointer" onClick={() => setSelectedStatus(status)}>{status}</div>
                      ))
                    }
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </Box>
      </div>
    </Modal>
  );
};


export default DeleteTrips;