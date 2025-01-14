import { doc, onSnapshot, collection, getDocs } from "@firebase/firestore";
import { db } from "../../../../utils/firebase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentDay = new Date().getDay();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const currentDayName = daysOfWeek[currentDay];

    const tripsCollectionRef = collection(db, "trips");

    const tripArr = [];

    // get the documents from the trips collection
    const querySnapshot = await getDocs(tripsCollectionRef);


    querySnapshot.forEach((doc) => {
      tripArr.push(doc.data());
    });

    // filter through the trips and return trips that have the current day as an active day
    const trips = tripArr.filter(trip => trip.active_days.includes(currentDayName));

    // filter through trips and return trips that have 'Bamenda' or 'Buea' as their departure or destination city
    const ghostTownAreas = trips.filter(trip => ['Bamenda', 'Buea'].includes(trip.travelRoute.departure_city) || ['Bamenda', 'Buea'].includes(trip.travelRoute.destination_city));


    // filter through trips and ghost town areas and return objects in trips that are not in ghost town areas

    const nonGhostTownAreas = trips.filter(trip => !ghostTownAreas.includes(trip));

    let activeGhostTownTrips = [];

    if (ghostTownAreas.length > 0) {
      switch (currentDayName) {
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
            if (trip.departure_time.includes('AM')) {
              activeGhostTownTrips.push(trip);
            }
          }
          )
          break;

        default:
          // console.log('Today is not a day of the week');
      }
    }

    return NextResponse.json({success: true, message: 'Trips fetched successfully', trips: [...nonGhostTownAreas, ...activeGhostTownTrips]});
  } catch (error) {
    return NextResponse.json({success: false, message: 'Error fetching trips', error});
  }
}