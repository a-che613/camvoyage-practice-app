"use client"

import Image from "next/image";
import { FaArrowRightLong, FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { BsPerson } from "react-icons/bs";
import { GoArrowSwitch } from "react-icons/go";
import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";



const CustomInput = ({name, value, onChange, placeholder}) => {
  return (
    <input type="text" placeholder={placeholder} className="h-[50px] border rounded-[4px] px-[16px] " name={name} value={value} onChange={onChange} />
  );
}


const LandingPage = ({trips}) => {

  const [tripType, setTripType] = useState({type: 'One way', icon: ''});
  const [seatCount, setSeatCount] = useState(1);
  const [dropSeatCount, setDropSeatCount] = useState(1);
  const [busClass, setBusClass] = useState('');
  const [departureLoc, setDepartureLoc] = useState('');
  const [destinationLoc, setDestinationLoc] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');


  const [showTripDrop, setShowTripDrop] = useState(false);
  const [showSeatDrop, setShowSeatDrop] = useState(false);
  const [showClassDrop, setShowClassDrop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // states to handle the modal input fields (traveler name, ID number, phone number)

  const [travelerName, setTravelerName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


  const tripTypes = [
    {
      type: "One way",
      icon: <FaArrowRightLong />
    },
    {
      type: "Round trip",
      icon: <FaArrowRightArrowLeft />
    },
  ]

  const busClasses = [
    'Regular',
    'Classic',
    'VIP'
  ]

  return (
    <div className="w-full h-screen  relative" id="booking">
      <div className="absolute inset-0">
        <Image
          src="/bg-image.jpg"
          alt="Landing page"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="inset-0 bg-black absolute bg-opacity-70" />
      <div className="relative h-full items-end justify-center flex w-full">
        <div className="w-[90%] lg:w-[80%] flex flex-col items-center justify-center mb-[50px] gap-[10px]">
          <p className="text-[34px] lg:text-[46px]">Book Your Trip</p>
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[15px]">
              <div className="flex items-center gap-[10px] cursor-pointer relative" onClick={() => setShowTripDrop(!showTripDrop)}>
                {tripType.type == "" ? <p>Trip type</p> : <div className="flex items-center gap-[5px]">
                  <div>{tripType.icon}</div>
                  <p>{tripType.type}</p>
                </div>}
                <IoMdArrowDropdown />
                {showTripDrop && <div className="absolute left-0 right-0 bottom-[-2px] w-[150%] translate-y-full shadow-xl rounded-[4px] bg-white z-[500]">
                  {
                    tripTypes.map((trip, index) => (
                      <div className="flex items-center px-[10px] py-[2px] text-black text-opacity-70"
                        key={index}
                        onClick={() => {
                          setTripType(trip);
                          setShowTripDrop(false)
                        }}
                      >
                        <div className="flex gap-[10px] items-center">
                          <div>{trip.icon}</div>
                          <div>{trip.type}</div>
                        </div>

                      </div>
                    ))
                  }
                </div>}
              </div>
              <div className="relative">
                <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => setShowSeatDrop(!showSeatDrop)}>
                  <div className="flex items-center gap-[5px]">
                    <BsPerson />
                    <p>{seatCount}</p>
                  </div>
                  <IoMdArrowDropdown />
                </div>
                {showSeatDrop && <div className="absolute left-0 right-0 bottom-[-2px] w-[180%] translate-y-full shadow-xl rounded-[4px] bg-white z-[500] flex flex-col text-black gap-[5px] text-opacity-70 px-[10px] py-[8px]">
                  <div className="w-full flex items-center justify-between ">
                    <button className="border px-[8px] rounded-[4px]" onClick={() => setDropSeatCount(prev => prev - 1)}>-</button>
                    <p>{dropSeatCount}</p>
                    <button className="border px-[8px] rounded-[4px]" onClick={() => setDropSeatCount(prev => prev + 1)}>+</button>
                  </div>
                  <button className="text-right text-[14px]" onClick={() => {
                    setShowSeatDrop(false);
                    setSeatCount(dropSeatCount);
                  }}>Done</button>
                </div>}
              </div>
              <div className="flex items-center gap-[10px] relative cursor-pointer" onClick={() => setShowClassDrop(!showClassDrop)}>
                {busClass == "" ? <p>Bus class</p> : <div className="flex items-center gap-[5px]">
                  <p>{busClass}</p>
                </div>}
                <IoMdArrowDropdown />
                {showClassDrop && <div className="absolute left-0 right-0 bottom-[-2px] w-[150%] translate-y-full shadow-xl rounded-[4px] bg-white z-[500] flex flex-col text-black gap-[5px] text-opacity-70 px-[10px] py-[8px]">
                  {
                    busClasses.map((busClass, index) => (
                      <p className="cursor-pointer" onClick={() => {
                        setBusClass(busClass);
                        setShowClassDrop(false)
                      }} key={index}>{busClass}</p>
                    ))
                  }
                </div>}
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-[10px]">
              <div className="grid grid-cols-2 gap-[10px] relative">
                <div className="h-[35px] w-[35px] rounded-[100%] border border-black bg-white text-black absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <GoArrowSwitch />
                </div>
                <CustomInput 
                  placeholder={'From'}
                  name={'departureLoc'}
                  value={departureLoc}
                  onChange={(e) => setDepartureLoc(e.target.value)}
                />
                <CustomInput 
                  placeholder={'To'}
                  name={'destinationLoc'}
                  value={destinationLoc}
                  onChange={(e) => setDestinationLoc(e.target.value)}
                />
              </div>
              <div className={`grid ${tripType.type == 'Round trip' ? "grid-cols-2" : "grid-cols-1"} gap-[10px] max-lg:pt-[8px]`}>
                <input type="date" placeholder="Departure date" 
                name="departure-date" className="px-[16px] h-[50px] rounded-[4px]"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                />
               {tripType.type == 'Round trip' && <input type="date" name="return-date" 
               placeholder="Return date"
               
               id="date" className="px-[16px] rounded-[4px] h-[50px]" 
               value={returnDate}
               onChange={(e) => setReturnDate(e.target.value)}
               />}
              </div>
            </div>
            <div className="flex items-end justify-end w-full pt-[10px]">
              <button className="bg-blue-700 px-[10px] rounded-[4px] py-[5px]  h-[40px] text-white" onClick={() => {
                setShowModal(true);
              }}>Book Your Trip</button>
            </div>
          </div>
        </div>
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
                  <p className="text-[14px]">Phone Number</p>
                  <input type="number" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              </div>
              <div>
                <button className="bg-blue-700 px-[10px] rounded-[4px] py-[5px] w-full h-[50px] text-white">Generate Ticket</button>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;