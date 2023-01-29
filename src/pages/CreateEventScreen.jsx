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
import { FontAwesome5 } from "@expo/vector-icons";

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

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePlaceholder, setShowDatePlaceholder] = useState(true);
  const [showStartTimePlaceholder, setShowStartTimePlaceholder] =
    useState(true);
  const [showEndTimePlaceholder, setShowEndTimePlaceholder] = useState(true);

  const [spots, setSpots] = useState("");

  const [location, setLocation] = useState("");

  const [coordinate, setCoordinate] = useState("");

  const checkCompleted = () => {
    if (eventName === "") return false;
    if (sport === "Sport") return false;
    if (showDatePlaceholder === true) return false;
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
      date,
      startTime,
      endTime,
      spots: parseInt(spots),
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
        setShowDatePicker(false);
        setShowEndTimePicker(false);
        setShowFilterSportPicker(false);
      }}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        >
          <TouchableOpacity onPress={navigation.goBack} style={{ padding: 15 }}>
            <FontAwesome5 name="chevron-left" size={20} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Event</Text>
        </View>

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
              setShowDatePicker(!showDatePicker);
              setShowDatePlaceholder(false);
            }}
          >
            <Text
              style={[
                styles.placeholder,
                !showDatePlaceholder && { color: "black" },
              ]}
            >
              {showDatePlaceholder
                ? "Date"
                : date.toLocaleString().split(",")[0]}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              onChange={(event, date) => {
                setDate(date);
                setShowDatePicker(false);
              }}
              mode="date"
              display="inline"
              themeVariant="light"
              minimumDate={new Date()}
              language="en"
              style={{ marginTop: 30 }}
            />
          )}
          <View style={styles.timeContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowStartTimePicker(!showStartTimePicker);
                setShowStartTimePlaceholder(false);
                setShowEndTimePicker(false);
              }}
              style={[
                styles.dateTime,
                !showStartTimePlaceholder && { alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  styles.placeholder,
                  !showStartTimePlaceholder && { color: "black" },
                ]}
              >
                {showStartTimePlaceholder
                  ? "Start time"
                  : startTime.getHours() +
                    ":" +
                    ((time) => (time < 10 ? "0" + time : time))(
                      startTime.getMinutes()
                    )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowEndTimePicker(!showEndTimePicker);
                setShowEndTimePlaceholder(false);
                setShowStartTimePicker(false);
              }}
              style={[
                styles.dateTime,
                !showEndTimePlaceholder && { alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  styles.placeholder,
                  !showEndTimePlaceholder && { color: "black" },
                ]}
              >
                {showEndTimePlaceholder
                  ? "End time"
                  : endTime.getHours() +
                    ":" +
                    ((time) => (time < 10 ? "0" + time : time))(
                      endTime.getMinutes()
                    )}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              onChange={(event, startTime) => setStartTime(startTime)}
              mode="time"
              display="spinner"
              themeVariant="light"
              style={{}}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              onChange={(event, endTime) => setEndTime(endTime)}
              mode="time"
              display="spinner"
              themeVariant="light"
              style={{}}
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
                // console.log(json.results[0].geometry.location);
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
    marginLeft: 5,
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
  dateTime: {
    width: 150,
    marginTop: 30,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: colors.lightGray,
    fontSize: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: "auto",
  },
  buttonText: { color: "white", fontSize: 20 },
});
