import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGlobalContext } from "../utils/context";
import DateTimePicker from "@react-native-community/datetimepicker";

const FeedScreen = () => {
  const navigation = useNavigation();
  const { events } = useGlobalContext();

  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date());

  const [filterDateText, setFilterDateText] = useState("Date");

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
        <TouchableOpacity style={styles.filter}>
          <Text style={styles.filterText}>Sport</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowFilterDatePicker(!showFilterDatePicker)}
          style={[styles.filter, showFilterDatePicker && styles.filterSelected]}
        >
          <Text
            style={[
              styles.filterText,
              showFilterDatePicker && styles.filterTextSelected,
            ]}
          >
            {filterDateText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filter}>
          <Text style={styles.filterText}>Location</Text>
        </TouchableOpacity>
      </View>
      {showFilterDatePicker && (
        <DateTimePicker
          value={filterDate}
          onChange={(event, date) => {
            setFilterDate(date);
            setShowFilterDatePicker(false);
            setFilterDateText(date.toISOString().split("T")[0]);
          }}
          mode="date"
          display="inline"
          themeVariant="light"
          style={styles.dateTime}
        />
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
                    <Text style={styles.information}>Start</Text>
                    <Text style={styles.data}>{event.startDate}</Text>
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
                    <Text style={styles.information}>End</Text>
                    <Text style={styles.data}>{event.endDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.map} />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.join}>Join</Text>
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
    marginHorizontal: 30,
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
  filter: {
    width: 100,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: colors.darkGray,
    paddingVertical: 5,
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 10,
  },
  filterSelected: { borderColor: colors.primary },
  filterText: { color: colors.darkGray },
  filterTextSelected: { color: colors.primary },
  filterContainer: { flexDirection: "row", marginHorizontal: 20 },
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
