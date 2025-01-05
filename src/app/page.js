"use client"

import LandingPage from "@/components/landing/landing-page";
import Schedules from "@/components/schedules/schedules";
import Image from "next/image";
import Link from "next/link";
import TicketManagement from "@/components/ticket-management/ticket-management";
import { useState, useEffect } from "react";
import { doc, onSnapshot, collection, getDocs } from "@firebase/firestore";
import { db } from "../../utils/firebase";

export default function Home() {


  const [showModal, setShowModal] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {

    (async () => {

      const tripArr = [];
      const tripsCollectionRef = collection(db, "trips");

      const querySnapshot = await getDocs(tripsCollectionRef);

      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        tripArr.push(doc.data());
      });

      setTrips(tripArr);
    })();
    // const getTrips = async () => {
    //   try {
    //     const fetchedTrips = await getTrips();
    //     setTrips(fetchedTrips);
    //   } catch (error) {
    //     console.error('Error fetching trips:', error);
    //   }
    // };

    // getTrips();
  }, []);

  // const trips = await getTrips() || [];
  console.log('The trips data is: ', trips);


  const navLinks = [
    {
      link: 'Booking',
      url: '#booking'
    },
    {
      link: 'Schedules',
      url: '#schedules'
    },
    {
      link: 'Tickets',
      url: '#ticket-management'
    }
  ]
  return (
    <div className="font-[family-name:var(--font-geist-sans)] relative">
      <div className="fixed z-[1000] py-[30px] w-full flex items-center justify-center backdrop-blur-md">
        <div className="w-[80%] flex items-center justify-between">
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
          <div className="flex items-center gap-[30px]">
            {navLinks.map((nav, index) => (
              <Link href={nav.url} key={index} className="tracking-widest">{nav.link}</Link>
            ))}
          </div>
        </div>

      </div>
      <LandingPage trips={trips} />
      <Schedules trips={trips} />
      <TicketManagement />
    </div>
  );
}
