import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGlobalContext } from "../utils/context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GOOGLE_MAPS_API_KEY from "../utils/googleMapsAPIKey";
import MapView, { Marker } from "react-native-maps";
import { auth, db } from "../utils/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const SPORTS = [
  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "Baseball",
  "Rugby",
  "Volleyball",
  "Hockey",
  "Badminton",
];

const FeedScreen = () => {
  // console.log(auth.currentUser && auth.currentUser.uid);
  const navigation = useNavigation();
  const { events, updateEvents, registeredEvents } = useGlobalContext();
  // console.log(registeredEvents);

  const [showFilterSportPicker, setShowFilterSportPicker] = useState(false);
  const [filterSport, setFilterSport] = useState("Sport");

  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterDateText, setFilterDateText] = useState("Date");

  const [showFilterLocationPicker, setShowFilterLocationPicker] =
    useState(false);
  const [filterLocation, setFilterLocation] = useState("Location");

  //When user presses join or leave event
  const handlePress = (id, spots) => {
    // console.log(id);
    let updatedSpots;
    if (registeredEvents.includes(id)) {
      //When users leave event
      updatedSpots = parseInt(spots) + 1;
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        registeredEvents: arrayRemove(id),
      });
    } else {
      updatedSpots = parseInt(spots) - 1;
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        registeredEvents: arrayUnion(id),
      });
    }
    updateDoc(doc(db, "events", id), { spots: updatedSpots });
  };

  //Updates when values in array changes
  useEffect(() => {
    updateEvents(filterSport, filterDate, filterDateText, filterLocation);
  }, [filterSport, filterDate, filterDateText, filterLocation]);

  //Visual page
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topLine}>
        <Text style={styles.title}>droppin</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Create")}
          style={styles.square}
        >
          <FontAwesome5 name="plus" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowFilterSportPicker(!showFilterSportPicker);
            setShowFilterDatePicker(false);
            setShowFilterLocationPicker(false);
            setFilterSport("Sport");
          }}
          style={[
            styles.filter,
            filterSport != "Sport" && styles.filterSelected,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.filterText,
              filterSport != "Sport" && styles.filterTextSelected,
            ]}
          >
            {filterSport}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowFilterDatePicker(!showFilterDatePicker);
            setShowFilterSportPicker(false);
            setShowFilterLocationPicker(false);
            setFilterDateText("Date");
            setFilterDate(new Date());
          }}
          style={[
            styles.filter,
            filterDateText != "Date" && styles.filterSelected,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.filterText,
              filterDateText != "Date" && styles.filterTextSelected,
            ]}
          >
            {filterDateText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowFilterLocationPicker(!showFilterLocationPicker);
            setShowFilterSportPicker(false);
            setShowFilterDatePicker(false);
            setFilterLocation("Location");
          }}
          style={[
            styles.filter,
            filterLocation != "Location" && styles.filterSelected,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.filterText,
              filterLocation != "Location" && styles.filterTextSelected,
            ]}
          >
            {filterLocation}
          </Text>
        </TouchableOpacity>
      </View>
      {showFilterSportPicker && (
        <View style={styles.sportFilter}>
          {SPORTS.map((sport) => (
            <TouchableOpacity
              onPress={() => {
                setFilterSport(sport);
                setShowFilterSportPicker(false);
              }}
              key={sport}
              style={[
                styles.sportFilterItem,
                sport == filterSport && styles.filterSelected,
              ]}
            >
              <Text
                style={[
                  styles.sportFilterText,
                  sport == filterSport && styles.filterTextSelected,
                ]}
              >
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showFilterDatePicker && (
        <DateTimePicker
          value={filterDate}
          onChange={(event, date) => {
            setFilterDate(date);
            setShowFilterDatePicker(false);
            setFilterDateText(
              new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
                .toISOString()
                .split("T")[0]
            );
          }}
          minimumDate={new Date()}
          mode="date"
          display="inline"
          themeVariant="light"
          style={styles.dateTime}
        />
      )}

      {showFilterLocationPicker && (
        <ScrollView
          horizontal={true}
          scrollEnabled={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{ width: "100%" }}
          style={styles.locationContainer}
        >
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => [
              setFilterLocation(data.structured_formatting.main_text),
              setShowFilterLocationPicker(false),
            ]}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            styles={{
              container: { marginBottom: 10 },
              textInput: styles.input,
              listView: { height: 150 },
            }}
            textInputProps={{
              placeholderTextColor: colors.darkGray,
            }}
          />
        </ScrollView>
      )}
      <ScrollView>
        {events.map((event) => (
          <View key={event.id}>
            <View style={styles.eventContainer}>
              <Text style={styles.sportName}>{event.eventName}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoColumn}>
                  <View>
                    <Text style={styles.information}>Sport</Text>
                    <Text style={styles.data}>{event.sport}</Text>
                  </View>
                  <View>
                    <Text style={styles.information}>Date</Text>
                    <Text style={styles.data}>{event.date.split(",")[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.information}>Location</Text>
                    <Text style={styles.data}>{event.location}</Text>
                  </View>
                </View>
                <View style={styles.infoColumn}>
                  <View>
                    <Text style={styles.information}>Spots available</Text>
                    <Text style={styles.data}>{event.spots}</Text>
                  </View>
                  <View>
                    <Text style={styles.information}>Time</Text>
                    <Text style={styles.data}>
                      {event.startTime.split(",")[1].split(":")[0]}
                      {":"}
                      {event.startTime.split(",")[1].split(":")[1]}{" "}
                      {event.startTime
                        .split(",")[1]
                        .substring(
                          event.startTime.split(",")[1].length - 2,
                          event.startTime.split(",")[1].length
                        )}{" "}
                      - {event.endTime.split(",")[1].split(":")[0]}
                      {":"}
                      {event.endTime.split(",")[1].split(":")[1]}{" "}
                      {event.endTime
                        .split(",")[1]
                        .substring(
                          event.endTime.split(",")[1].length - 2,
                          event.endTime.split(",")[1].length
                        )}
                    </Text>
                  </View>
                </View>
              </View>
              <MapView region={event.coordinate} style={styles.map}>
                <Marker coordinate={event.coordinate} title={event.location} />
              </MapView>
              <TouchableOpacity
                onPress={() => handlePress(event.id, event.spots)}
                style={styles.button}
              >
                <Text style={styles.join}>
                  {registeredEvents.includes(event.id) ? "Leave" : "Join"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.background} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  page: { flex: 1 },
  topLine: {
    flexDirection: "row",
    marginHorizontal: 25,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 10,
  },
  square: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderRadius: 10,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
    justifyContent: "space-between",
  },
  filter: {
    width: 115,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: colors.darkGray,
    paddingVertical: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  filterSelected: { borderColor: colors.primary },
  filterText: { color: colors.darkGray },
  filterTextSelected: { color: colors.primary },
  sportFilter: {
    flexDirection: "row",
    marginHorizontal: 25,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sportFilterItem: {
    width: "30%",
    borderWidth: 2,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 5,
    borderColor: colors.blackGray,
    paddingVertical: 5,
  },
  sportFilterText: { color: colors.blackGray },
  locationContainer: { marginHorizontal: 25 },
  input: {
    marginBottom: 0,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: colors.lightGray,
    fontSize: 20,
  },
  eventContainer: { marginTop: 20, marginHorizontal: 25 },
  infoContainer: { flexDirection: "row" },
  infoColumn: { flex: 1 },
  name: { fontSize: 15, fontWeight: "500", color: "black" },
  time: { fontSize: 15, color: colors.darkGray },
  sportName: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginTop: 8,
    marginBottom: 2,
  },
  information: { fontSize: 13, color: colors.darkGray, marginTop: 11 },
  data: { fontSize: 15, color: "black", marginTop: 3 },
  map: {
    width: "100%",
    height: 150,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    width: 150,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginLeft: "auto",
    marginTop: 20,
    padding: 20,
    alignItems: "center",
  },
  join: {
    color: "white",
    fontWeight: "500",
  },
  background: { height: 15, backgroundColor: colors.lightGray, marginTop: 30 },
});
