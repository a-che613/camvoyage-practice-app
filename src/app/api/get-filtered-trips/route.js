import { NextResponse } from "next/server";
import { doc, onSnapshot, collection, getDocs } from "@firebase/firestore";
import { db } from "../../../../utils/firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const departureDate = searchParams.get('departure_date');

    if (!departureDate) {
      return NextResponse.json({ error: 'departure_date parameter is required' }, { status: 400 });
    }

    const date = new Date(departureDate);
    const day = date.getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[day];


    // console.log('The day is: ', dayName);

    const tripsCollectionRef = collection(db, "trips");
    const tripsSnapshot = await getDocs(tripsCollectionRef);
    const allTrips = tripsSnapshot.docs.map(doc => doc.data());

    const tripArr = allTrips.filter(trip => trip.active_days.includes(dayName));

    // filter through the trips and return trips that have the current day as an active day
    const trips = tripArr.filter(trip => trip.active_days.includes(dayName));

    // filter through trips and return trips that have 'Bamenda' or 'Buea' as their departure or destination city
    const ghostTownAreas = trips.filter(trip => ['Bamenda', 'Buea'].includes(trip.travelRoute.departure_city) || ['Bamenda', 'Buea'].includes(trip.travelRoute.destination_city));


    // filter through trips and ghost town areas and return objects in trips that are not in ghost town areas

    const nonGhostTownAreas = trips.filter(trip => !ghostTownAreas.includes(trip));

    let activeGhostTownTrips = [];

    if (ghostTownAreas.length > 0) {
      switch (dayName) {
        case 'Sunday':
          activeGhostTownTrips = ghostTownAreas.filter(trip => trip.departure_time.includes('AM'));
          ghostTownAreas.filter(trip => ['Bamenda', 'Buea'].includes(trip.travelRoute.departure_city)).map(trip => {
            if (trip.departure_time.includes('PM')) {
              activeGhostTownTrips.push(trip);
            }
          })
          break;
        case 'Monday':
          ghostTownAreas.filter(trip => ['Bamenda', 'Buea'].includes(trip.travelRoute.destination_city)).map(trip => {
            if (trip.departure_time.includes('PM')) {
              activeGhostTownTrips.push(trip);
            }
          }
          )
          break;

        default:
          ghostTownAreas.map(trip => {
            // if (trip.departure_time.includes('AM')) {
              activeGhostTownTrips.push(trip);
            // }
          }
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Trips fetched successfully', trips: [...nonGhostTownAreas, ...activeGhostTownTrips] });

  } catch (error) {
    // console.log('Error fetching trips:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}