import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import Geocoder from "react-native-geocoding";
import GOOGLE_MAPS_API_KEY from "./googleMapsAPIKey";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  Geocoder.init(GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    const unsubEvents = onSnapshot(
      query(collection(db, "events"), where("endDate", ">=", new Date())),
      (snap) => {
        const newEvents = snap.docs.map((doc) => {
          const curEvent = doc.data();
          Geocoder.from(curEvent.location).then((json) => {
            console.log(json);
          });
          return {
            ...curEvent,
            startDate: new Date(
              curEvent.startDate.seconds * 1000
            ).toLocaleString(),
            endDate: new Date(curEvent.endDate.seconds * 1000).toLocaleString(),
            location: curEvent.location,
            coordinate: {
              latitude: curEvent.coordinate.lat,
              longitude: curEvent.coordinate.lng,
              latitudeDelta: 0.009,
              longitudeDelta: 0.005,
            },
            id: doc.id,
          };
        });
        setEvents(newEvents);
      }
    );
    return unsubEvents;
  }, []);

  const updateEvents = async (sport, date, dateText, location) => {
    const dateBegin = new Date(date);
    dateBegin.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(24, 0, 0, 0);
    const queryParams = [
      sport !== "Sport" && where("sport", "==", sport),
      ...(dateText !== "Date"
        ? [where("endDate", ">=", dateBegin), where("endDate", "<", dateEnd)]
        : []),
      location !== "Location" && where("location", "==", location),
      where("endDate", ">=", new Date()),
    ].filter((queryParam) => queryParam);
    const q = query(collection(db, "events"), ...queryParams);
    const querySnapshot = await getDocs(q);
    const newEvents = querySnapshot.docs.map((doc) => {
      const curEvent = doc.data();
      return {
        ...curEvent,
        startDate: new Date(curEvent.startDate.seconds * 1000).toLocaleString(),
        endDate: new Date(curEvent.endDate.seconds * 1000).toLocaleString(),
        location: curEvent.location,
        id: doc.id,
      };
    });
    setEvents(newEvents);
  };

  return (
    <AppContext.Provider value={{ events, updateEvents }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);
export { AppContext, AppProvider };
