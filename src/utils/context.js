import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      const newEvents = snap.docs.map((doc) => {
        const curEvent = doc.data();
        return {
          ...curEvent,
          startDate: new Date(
            curEvent.startDate.seconds * 1000
          ).toLocaleString(),
          endDate: new Date(curEvent.endDate.seconds * 1000).toLocaleString(),
          location: curEvent.location,
          id: doc.id,
        };
      });
      setEvents(newEvents);
    });
    return unsubEvents;
  }, []);

  return (
    <AppContext.Provider value={{ events }}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);
export { AppContext, AppProvider };
