import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import colors from "../styles/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GOOGLE_MAPS_API_KEY from "../utils/googleMapsAPIKey";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import Geocoder from "react-native-geocoding";

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

const CreateEventScreen = () => {
  const navigation = useNavigation();

  const [eventName, setEventName] = useState("");

  const [open, setOpen] = useState(false);
  const [showFilterSportPicker, setShowFilterSportPicker] = useState(false);
  const [sport, setSport] = useState("Sport");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePlaceholder, setShowStartDatePlaceholder] =
    useState(true);
  const [showEndDatePlaceholder, setShowEndDatePlaceholder] = useState(true);

  const [spots, setSpots] = useState("");

  const [location, setLocation] = useState("");

  const [coordinate, setCoordinate] = useState("");

  const checkCompleted = () => {
    if (eventName === "") return false;
    if (sport === "Sport") return false;
    if (showStartDatePlaceholder === true) return false;
    if (showEndDatePlaceholder === true) return false;
    if (spots === "") return false;
    if (location === "") return false;
    return true;
  };
  const handleDone = () => {
    if (!checkCompleted()) {
      console.error("error");
      return;
    }
    const event = {
      eventName,
      sport,
      startDate,
      endDate,
      spots,
      location,
      coordinate,
    };
    addDoc(collection(db, "events"), event);
    navigation.navigate("Feed");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        setOpen(false);
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
        setShowFilterSportPicker(false);
      }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Event</Text>
        <KeyboardAwareScrollView
          extraScrollHeight={190}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps={"handled"}
        >
          <TextInput
            value={eventName}
            onChangeText={setEventName}
            placeholder="Event name"
            placeholderTextColor={colors.darkGray}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => {
              setShowFilterSportPicker(!showFilterSportPicker);
            }}
            style={[styles.input, sport != "Sport" && styles.filterSelected]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                sport != "Sport" && { color: "black" },
              ]}
            >
              {sport}
            </Text>
          </TouchableOpacity>
          {showFilterSportPicker && (
            <View style={styles.sportFilter}>
              {SPORTS.map((sports) => (
                <TouchableOpacity
                  onPress={() => {
                    setSport(sports);
                    setShowFilterSportPicker(false);
                  }}
                  key={sports}
                  style={[
                    styles.sportFilterItem,
                    sports == sport && styles.filterSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sportFilterText,
                      sports == sport && styles.filterTextSelected,
                    ]}
                  >
                    {sports}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setShowStartDatePicker(!showStartDatePicker);
              setShowStartDatePlaceholder(false);
            }}
          >
            <Text
              style={[
                styles.placeholder,
                !showStartDatePlaceholder && { color: "black" },
              ]}
            >
              {showStartDatePlaceholder
                ? "Start date"
                : startDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              onChange={(event, startDate) => setStartDate(startDate)}
              mode="datetime"
              display="inline"
              themeVariant="light"
              style={styles.dateTime}
            />
          )}
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setShowEndDatePicker(!showEndDatePicker);
              setShowEndDatePlaceholder(false);
            }}
          >
            <Text
              style={[
                styles.placeholder,
                !showEndDatePlaceholder && { color: "black" },
              ]}
            >
              {showEndDatePlaceholder ? "End date" : endDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              onChange={(event, endDate) => setEndDate(endDate)}
              mode="datetime"
              display="inline"
              themeVariant="light"
              style={styles.dateTime}
            />
          )}
          <TextInput
            keyboardType="number-pad"
            value={spots}
            onChangeText={setSpots}
            placeholder="Spots available"
            placeholderTextColor={colors.darkGray}
            style={styles.input}
          />
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{ width: "100%" }}
          >
            <GooglePlacesAutocomplete
              placeholder="Location"
              onPress={async (data, details = null) => {
                const json = await Geocoder.from(data.description);
                setLocation(data.structured_formatting.main_text);
                setCoordinate(json.results[0].geometry.location);
                console.log(json.results[0].geometry.location);
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: "en",
              }}
              styles={{
                textInput: [styles.input, { marginBottom: 0, height: "auto" }],
                listView: { height: 150 },
              }}
              textInputProps={{ placeholderTextColor: colors.darkGray }}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
        <TouchableOpacity onPress={handleDone} style={styles.button}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: { marginHorizontal: 30, flex: 1 },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 20,
  },
  input: {
    marginTop: 30,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: colors.lightGray,
    fontSize: 20,
  },
  placeholder: {
    color: colors.darkGray,
    fontSize: 20,
  },
  dropdown: {
    backgroundColor: colors.lightGray,
    borderColor: colors.lightGray,
    marginTop: 30,
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    color: colors.darkGray,
  },
  filterText: { color: colors.darkGray, fontSize: 20 },
  sportFilter: {
    flexDirection: "row",
    marginHorizontal: 0,
    marginTop: 10,
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
  filterSelected: { borderColor: colors.primary },
  sportFilterText: { color: colors.blackGray },
  filterTextSelected: { color: colors.primary },
  dropdownContainer: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  startTime: { flexDirection: "row", justifyContent: "space-between" },
  dateTime: { marginTop: 30 },
  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: "auto",
  },
  buttonText: { color: "white", fontSize: 20 },
});
