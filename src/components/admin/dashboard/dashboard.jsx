"use client"

import { Modal, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import Image from "next/image";
import CreateTrips from "@/components/admin/modals/create-trips";
import DeleteTrips from "@/components/admin/modals/delete-trips";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { formatDate } from "../../../../utils/date-utils";
import { auth } from "../../../../utils/firebase";


const DashboardCard = ({ moreStyles, count, label }) => {
  return (
    <div className={`h-[100px] rounded-[4px] max-md:min-w-[85%] border ${moreStyles} flex flex-col gap-[8px] items-center justify-center`}>
      <p className="text-[28px]">{count}</p>
      <p className="text-[15px]">{label}</p>
    </div>
  );
}


const AdminDashboard = () => {


  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  const [showModal, setShowModal] = useState(false);
  const [showCreateTripsModal, setShowCreateTripsModal] = useState(false);
  const [showDeleteTripsModal, setShowDeleteTripsModal] = useState(false)
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 10;

  const [showAgency, setShowAgency] = useState(true);
  const [status, setStatus] = useState(false);
  const [showTripDate, setShowTripDate] = useState(false);
  const [adminData, setAdminData] = useState({username: 'Admin', email: 'admin@gmail.com'})

  const [date, setDate] = useState(new Date());

  const logout = () => {

    sessionStorage.clear();
    signOut(auth) // Clear session storage
    router.push("/admin/login"); // Redirect to the login page
  };

  useEffect(() => {
    const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const loginTime = Date.now();
    sessionStorage.setItem("loginTime", loginTime); // Save login time

    // Set up interval to check time elapsed
    const interval = setInterval(() => {
      const storedLoginTime = sessionStorage.getItem("loginTime");
      if (storedLoginTime) {
        const elapsedTime = Date.now() - parseInt(storedLoginTime, 10);
        if (elapsedTime >= twoHoursInMs) {
          logout(); // Logout after 2 hours
          clearInterval(interval); // Clear the interval
        }
      }
    }, 1000); // Check every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user && !userSession) {
      router.push('/admin/login');
    }
    setAdminData(JSON.parse(userSession));
    console.log('This is the user', adminData, JSON.parse(userSession));
  }, [userSession])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000)

    return () => clearInterval(intervalId);
  }, [])

  const [refetch, setRefetch] = useState('');

  const fetchTrips = async (departureDate) => {
    try {


      const response = await fetch(`/api/get-trips?departure_date=${departureDate}`);
      const data = await response.json();


      // console.log('The data is: ', data);

      if (data.success) {
        // console.log('The trips data is: ', data.trips);
        setTrips(data.trips);
      } else {
        console.error('Error fetching trips:', data.message);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const departureDate = currentDate.toISOString().split("T")[0];

    fetchTrips(departureDate);
  }, [refetch]);

  const [currentTrips, setCurrentTrips] = useState([])


  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;

  useEffect(() => {
    const currTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);
    setCurrentTrips(currTrips)
  }, [trips])

  // console.log('The current trips are: ', currentTrips);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white text-black text-opacity-90">
      <div className="h-[90px] w-full bg-white border-b shadow-sm flex items-center justify-center">
        <div className="w-[92%] flex justify-between items-center py-[4px]">
          <div className="h-[auto] w-[90px] lg:w-[125px] bg-white rounded-[10px] p-1 max-md:hidden">
            <Image
              src={'/main-logo-en-png.png'}
              width={135}
              height={86}
              style={{ width: 'auto', height: 'auto' }}
              priority
              alt="CamVoyage logo"
            />
          </div>
          {/* <div>
            // <p className='font-mono'>
            //   {date.toLocaleTimeString()}
            // </p>
          </div> */}
          <div className="flex items-center gap-[20px]">
            <div className="h-[40px] w-[40px] bg-blue-600 bg-opacity-20 flex items-center justify-center rounded-[100%]">{adminData?.username?.substring(0,1)}</div>
            <div className="flex flex-col">
              <p className="text-[14px] font-bold">{adminData?.username ?? ''}</p>
              <p className="text-[12px]">{adminData?.email ?? ''}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full">
        <div className="h-full w-[200px] bg-white max-lg:hidden border-r drop-shadow-md flex">
          <div className="self-end justify-self-center w-full flex items-center justify-center">
            <button className="text-[20px] text-red-500 py-[20px]" onClick={logout}>Log out</button>
          </div>
        </div>
        <div className="grow overflow-y-auto px-[5px] md:px-[30px] py-[20px] pb-[120px] flex flex-col gap-[25px]">
          <div className="flex flex-col gap-[16px] max-md:px-[15px]">
            <p className="font-semibold text-[20px] text-blue-600">Dashboard</p>
            <div className="flex overflow-x-auto lg:grid grid-cols-5 gap-5" >
              <DashboardCard
                count={trips?.length ?? 0}
                label={'Total Trips Today'}
                moreStyles={`bg-blue-500 border border-blue-800 text-white`}
              />
              <DashboardCard
                count={
                  trips.filter(trip => trip.trip_status.toLowerCase() == "scheduled").length ?? 0
                }
                label={'Scheduled'}
                moreStyles={`bg-blue-50 border border-blue-600 bg-opacity-40`}
              />
              <DashboardCard
                count={trips.filter(trip => trip.trip_status.toLowerCase() == "onboarding").length ?? 0}
                label={'Onboarding'}
                moreStyles={`bg-yellow-50 border border-yellow-600 bg-opacity-40`}
              />
              <DashboardCard
                count={trips.filter(trip => trip.trip_status.toLowerCase() == "on time").length ?? 0}
                label={'On Time'}
                moreStyles={`bg-green-50 border border-green-600 bg-opacity-40`}
              />
              <DashboardCard
                count={trips.filter(trip => trip.trip_status.toLowerCase() == "expired").length ?? 0}
                label={'Expired'}
                moreStyles={`bg-red-50 border border-red-600 bg-opacity-40`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[16px] pt-[20px] max-md:px-[15px]">
            <p className="text-[20px] font-semibold text-blue-600">What will you like to do today <span>{adminData?.username ?? ''}</span>?</p>
            <div className="flex items-center gap-[20px] flex-wrap max-lg:justify-center">
              <button className="border px-[10px] py-[6px] rounded-[4px]" onClick={() => setShowCreateTripsModal(true)}>Create a Trip</button>
              {/* <button className="border px-[10px] py-[6px] rounded-[4px]" onClick={() => setShowModal(true)}>Allocate Seats</button> */}
              <button className="border px-[10px] py-[6px] rounded-[4px]" onClick={() => setShowDeleteTripsModal(true)}>Delete Trips</button>
              <button className="border px-[10px] py-[6px] rounded-[4px]" onClick={() => setShowModal(true)}>Update a Trip</button>
            </div>
          </div>
          <div className="mt-[20px] flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <p className="text-[20px] max-md:px-[15px] text-blue-600">{"Today's Schedule"}</p>
              <input type="date" name="date" id="date" onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const departureDate = selectedDate.toISOString().split("T")[0];

                // console.log('Selected Departure date', departureDate)
                fetchTrips(departureDate);
              }} className="border rounded-[4px] px-[8px] py-[4px]" />
            </div>
            <div className="border  max-lg:text-[14px] rounded-[4px] bg-white">
              <div className="flex items-end justify-end gap-[10px] py-[12px] px-[6px] lg:hidden text-black font-medium tracking-wide">
                <button className={`px-[4px] py-[3px] ${showAgency ? "border-b  border-blue-600 text-blue-600" : ""}`} onClick={() => {
                  setShowAgency(true);
                  setStatus(false);

                  setShowTripDate(false);
                }}>Agency</button>
                <button className={`px-[4px] py-[3px] ${showTripDate ? " border-b border-blue-600 text-blue-600" : ""}`} onClick={() => {
                  setShowAgency(false);
                  setStatus(false);

                  setShowTripDate(true);

                }}>Date</button>
                <button className={`px-[4px] py-[3px] ${status ? "border-b border-blue-600 text-blue-600 " : ""}`}
                  onClick={() => {
                    setShowAgency(false);
                    setStatus(true);

                    setShowTripDate(false);

                  }}
                >Seats & Status</button>
              </div>
              <table className="w-full border text-black rounded-[4px] overflow-clip ">
                <thead className="border-t">
                  <tr>
                    <th className="w-[5%] py-[8px] bg-white bg-opacity-30">#</th>
                    <th className="border w-[10%] lg:w-[20%] py-[8px] bg-white bg-opacity-30">Travel Route</th>
                    <th className="border w-[20%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Agency Name</th>
                    {showAgency && <th className="border w-[20%] py-[8px] bg-white bg-opacity-30 lg:hidden">Agency Name</th>}

                    <th className="border w-[12%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Departure</th>
                    <th className="border w-[12%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Arrival</th>

                    {showTripDate && <th className="border w-[12%] py-[8px] bg-white bg-opacity-30 lg:hidden">Departure</th>}
                    {showTripDate && <th className="border w-[12%] py-[8px] bg-white bg-opacity-30 lg:hidden">Arrival</th>}

                    <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Alloc. Seats</th>
                    <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Avail. Seats</th>
                    <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 max-lg:hidden">Trip Status</th>

                    {status && <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 lg:hidden">Alloc. Seats</th>}
                    {status && <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 lg:hidden">Avail. Seats</th>}
                    {status && <th className="border w-[10%] py-[8px] bg-white bg-opacity-30 lg:hidden">Trip Status</th>}

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border h-[200px] bg-gray-50 font-mono">
                  {currentTrips.map((trip, index) => (
                    <tr key={index} className="">
                      <td className="w-[5%] text-center">{index + 1}</td>
                      <td className="w-[10%] lg:w-[20%] border">
                        <div className="flex flex-col justify-center items-center gap-[6px] py-[4px]">
                          <div className="flex flex-col md:flex-row items-center md:gap-[8px] leading-none">
                            <p className="font-medium">{trip?.travelRoute?.departure_city ?? ''}</p>
                            <p>-</p>
                            <p className="font-medium">{trip?.travelRoute?.destination_city ?? ''}</p>
                          </div>
                          <div className="h-[0.5px] bg-gray-400 w-full" />
                          <div className="flex flex-col md:flex-row text-[12.5px]  text-gray-500 items-center lg:gap-[8px] leading-none py-[4px]">
                            <p>{trip?.travelRoute?.departure_station ?? ''}</p>
                            <p>-</p>
                            <p>{trip?.travelRoute?.destination_station ?? ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="w-[10%] border text-center max-lg:hidden">{trip?.agency_name ?? ''}</td>
                      {showAgency && <td className="w-[10%] border text-center lg:hidden">{trip?.agency_name ?? ''}</td>}

                      <td className="w-[10%] border max-lg:hidden">
                        <div className="flex flex-col justify-center items-center gap-[2px]">
                          <p className="text-[14px]">{formatDate(trip?.departure_date) ?? ''}</p>
                          <p className="text-[12px]">at</p>
                          <p className={`text-[13px]`}>{trip?.departure_time ?? ''}</p>
                        </div>
                      </td>

                      {showTripDate && <td className="w-[10%] border lg:hidden">
                        <div className="flex flex-col justify-center items-center gap-[2px]">
                          <p className="text-[14px]">{formatDate(trip?.departure_date) ?? ''}</p>
                          <p className="text-[12px]">at</p>
                          <p className={`text-[13px]`}>{trip?.departure_time ?? ''}</p>
                        </div>
                      </td>}

                      <td className="w-[10%] border max-lg:hidden">
                        <div className="flex flex-col justify-center items-center gap-[2px]">
                          <p className="text-[14px]">{formatDate(trip?.arrival_date) ?? ''}</p>
                          <p className="text-[12px]">at</p>
                          <p className="text-[13px]">{trip?.arrival_time ?? ''}</p>
                        </div>
                      </td>

                      {showTripDate && <td className="w-[10%] border lg:hidden">
                        <div className="flex flex-col justify-center items-center gap-[2px]">
                          <p className="text-[14px]">{formatDate(trip?.arrival_date) ?? ''}</p>
                          <p className="text-[12px]">at</p>
                          <p className="text-[13px]">{trip?.arrival_time ?? ''}</p>
                        </div>
                      </td>}
                      <td className="w-[10%] border text-center max-lg:hidden">40</td>
                      <td className="w-[10%] border text-center max-lg:hidden">{trip?.available_seats ?? ''}</td>
                      <td className="w-[10%] border text-center max-lg:hidden">{trip?.trip_status ?? ''}</td>

                      {status && <td className="w-[10%] border text-center lg:hidden">40</td>}
                      {status && <td className="w-[10%] border text-center lg:hidden">{trip?.available_seats ?? ''}</td>}
                      {status && <td className="w-[10%] border text-center lg:hidden">{trip?.trip_status ?? ''}</td>}

                      {/* <td className="border">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex flex-col items-center border">
                        <div className="flex items-center gap-[8px]">
                          <p>{trip?.travelRoute?.departure_city ?? ''}</p>
                          <p>-</p>
                          <p>{trip?.travelRoute?.destination_city ?? ''}</p>
                        </div>
                        <div className="flex text-[12px] items-center gap-[8px]">
                          <p>{trip?.travelRoute?.departure_station ?? ''}</p>
                          <p>-</p>
                          <p>{trip?.travelRoute?.destination_station ?? ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex flex-col border">
                        <p>{trip?.departure_date ?? ''}</p>
                        <p>{trip?.departure_time ?? ''}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex flex-col border">
                        <p>{trip?.arrival_date ?? ''}</p>
                        <p>{trip?.arrival_time ?? ''}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">{trip.day ?? ''}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center py-[8px] border-t h-fit">
                {Array.from({ length: Math.ceil(trips.length / tripsPerPage) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateTrips open={showCreateTripsModal} onClose={() => setShowCreateTripsModal(false)} setRefetch={setRefetch} />

      <DeleteTrips open={showDeleteTripsModal} onClose={() => setShowDeleteTripsModal(false)} />

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
                  <input type="time" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">ID Number/Foreign Passport No</p>
                  <input type="text" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px]">Phone Number</p>
                  <input type="number" className="h-[48px] lg:h-[50px] border px-[16px] rounded-[4px]" />
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

export default AdminDashboard;