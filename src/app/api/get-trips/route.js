import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../../../utils/firebase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const departureDate = searchParams.get('departure_date');

    if (!departureDate) {
      return NextResponse.json({ success: false, message: 'departure_date parameter is required' }, { status: 400 });
    }

    const date = new Date(departureDate);
    const day = date.getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[day];

    const tripsCollectionRef = collection(db, "trips");
    const tripsSnapshot = await getDocs(tripsCollectionRef);
    const trips = tripsSnapshot.docs.map(doc => {
      const tripData = doc.data();
      if (tripData.departure_date && tripData.departure_date.toDate) {
        tripData.departure_date = tripData.departure_date.toDate().toLocaleDateString('en-CA');
      }
      if (tripData.arrival_date && tripData.arrival_date.toDate) {
        tripData.arrival_date = tripData.arrival_date.toDate().toLocaleDateString('en-CA');
      }
      return tripData;
    });


    // console.log('The trips data is: ', trips, typeof(trips[0].departure_date));

    const filteredTrips = trips.filter(
      (trip) => {
        const databaseDate = new Date(trip.departure_date);
        const tripDepartureDate = databaseDate.toISOString().split("T")[0];
        // console.log(tripDepartureDate, departureDate)
        return tripDepartureDate == departureDate;
      }
    );


    // console.log('These are the trips for today', filteredTrips)

    return NextResponse.json({ success: true, message: 'Trips fetched successfully', trips: filteredTrips });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching trips', error: error.message }, { status: 500 });
  }
}