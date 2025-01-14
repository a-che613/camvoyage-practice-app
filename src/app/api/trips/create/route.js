import { addDoc, collection, getDocs, updateDoc, doc } from "@firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../../../../../utils/firebase";

export async function POST(request) {
  try {

    const body = await request.json();

    const {
      departure_date,
      departure_time,
      estimated_duration,
      agency_name,
      allocated_seats,
      amenities,
      bus_class,
      departure_city,
      destination_city,
      departure_station,
      destination_station,
      ticket_price
    } = body;

    if (!departure_date || !departure_time || !estimated_duration || !allocated_seats || !agency_name || !amenities || !bus_class || !departure_city || !destination_city || !departure_station || !destination_station || !ticket_price) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    function convertTo24HourTime(time12h) {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12;
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return `${hours}:${minutes}`;
    }

    const departureDate = new Date(`${departure_date}T${convertTo24HourTime(departure_time)}`);
    const arrivalDateTime = new Date(departureDate.getTime() + estimated_duration * 60 * 60 * 1000);


    const arrival_date = arrivalDateTime.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const arrival_time = arrivalDateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    // console.log(departureDate, estimated_duration, arrivalDateTime, arrival_date, arrival_time);

    // console.log("Departure Date:", departureDate.toISOString());
    // console.log("Departure Time:", departure_time);
    // console.log("Arrival Date:", arrival_date);
    // console.log("Arrival Time:", arrival_time);


    const newTrip = {
      agency_name,
      allocated_seats,
      amenities,
      bus_class,
      "travelRoute": {
        departure_city,
        destination_city,
        departure_station,
        destination_station,
      },
      ticket_price,
      "departure_date": departureDate.toISOString(),
      "arrival_date": arrivalDateTime.toISOString(),
      arrival_time,
      departure_time,
      estimated_duration,
      "available_seats": allocated_seats,
      "trip_status": "Scheduled"
    }

    const tripsCollectionRef = collection(db, "trips");

    const docRef = await addDoc(tripsCollectionRef, newTrip);

    await updateDoc(doc(tripsCollectionRef, docRef.id), { trip_id: docRef.id });


    return NextResponse.json(
      { success: true, message: "Trip created successfully", tripId: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error creating trip", error: error.message },
      { status: 500 }
    );

  }
}