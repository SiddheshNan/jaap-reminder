import React from "react";
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import {
  Input,
  Card,
  Header,
  Button,
  CheckBox,
  ButtonGroup,
} from "@rneui/themed";
import {
  getMantras,
  getTodayDateString,
  getDateFromDateString,
  getStringFromDate,
  addDateToExistingDateString,
  datediff,
  getList,
  saveList,
  showAlert,
} from "../utils";

const getInitialState = () => {
  return {
    name: "",
    gotra: "",

    chantName: "",
    chantSankhya: 0,

    startDate: getTodayDateString(),
    endDate: addDateToExistingDateString(getTodayDateString(), 30),

    additional_text: "",
    cost_text: "",
  };
};

const HomePage = ({ route, navigation }) => {
  const focus = useIsFocused();

  const [state, setState] = React.useState(getInitialState());

  const [mantras, setMantras] = React.useState([]);

  const [times, setTimes] = React.useState(1);

  React.useEffect(() => {
    if (focus) {
      getMantras().then((mantra) => {
        setMantras(mantra);
        setState({
          ...state,
          chantName: mantra[0].name,
          chantSankhya: mantra[0].num,
        });
      });
    } else {
      setState(getInitialState());
    }
  }, [focus]);

  const onSubmit = async () => {
    try {
      const allItems = [...(await getList())];
      allItems.push({ ...state });
      saveList(allItems);
      setState(getInitialState());
      Alert.alert("सूचना ", "जतन झाले !", [
        { text: "OK", onPress: () => navigation.navigate("HomePage") },
      ]);
    } catch (error) {
      showAlert("Error", `${error.name} ${error.message}`);
    }
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Header
        elevated={1}
        backgroundColor="#FFB200"
        centerComponent={{
          text: Constants.manifest.name,
          style: {
            color: "white",
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 5,
            marginBottom: 5,
          },
        }}
        // leftComponent={{
        //   icon: "arrow-back",
        //   color: "#fff",
        //   style: {
        //     marginTop: 12,
        //     marginLeft: 15,
        //   },
        //   onPress: () => navigation.goBack(),
        // }}
      />

      <SafeAreaView style={{ flex: 1, paddingTop: -35 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ flex: 1, height: "100%" }}>
              <Card
                containerStyle={{
                  padding: 35,
                  borderRadius: 15,
                  marginBottom: 30,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 25,
                    fontSize: 25,
                    fontWeight: "bold",
                  }}
                >
                  नवीन माहिती टाका
                </Text>
                <Input
                  placeholder="पूर्ण नाव"
                  value={state.name}
                  onChangeText={(e) => setState({ ...state, name: e })}
                  style={{
                    paddingLeft: 10,
                  }}
                />
                <Input
                  placeholder="गोत्र"
                  value={state.gotra}
                  onChangeText={(e) => setState({ ...state, gotra: e })}
                  style={{
                    paddingLeft: 10,
                  }}
                />

                {mantras.map((mantra, index) => (
                  <View key={index}>
                    <CheckBox
                      size={28}
                      title={`${mantra.name} (${mantra.num * times})`}
                      checked={state.chantName === mantra.name}
                      onPress={() => {
                        setState({
                          ...state,
                          chantName: mantra.name,
                          chantSankhya: mantra.num * times,
                        });
                      }}
                    />
                  </View>
                ))}

                <ButtonGroup
                  buttons={["1 पट", "2 पट", "3 पट", "4 पट"]}
                  selectedIndex={times - 1}
                  onPress={(e) => {
                    setTimes(e + 1);
                    setState({
                      ...state,
                      chantSankhya:
                        mantras.find(
                          (mantra) => mantra.name === state.chantName
                        ).num *
                        (e + 1),
                    });
                  }}
                  containerStyle={{ height: 50 }}
                />

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 10,
                    marginTop: 15,
                  }}
                />
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 7.5,
                    }}
                  >
                    प्रारंभ तारीख: {state.startDate}
                  </Text>
                  <Button
                    onPress={() =>
                      DateTimePickerAndroid.open({
                        value: getDateFromDateString(state.startDate),
                        onChange: (event, selectedDate) => {
                          setState({
                            ...state,
                            startDate: getStringFromDate(selectedDate),
                            endDate: addDateToExistingDateString(
                              getStringFromDate(selectedDate),
                              30
                            ),
                          });
                        },
                        mode: "date",
                      })
                    }
                    title="प्रारंभ तारीख बदला"
                    buttonStyle={{
                      marginLeft: 10,
                      borderRadius: 5,
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", marginTop: 17 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 7.5,
                    }}
                  >
                    शेवट तारीख: {state.endDate}
                  </Text>
                  <Button
                    onPress={() =>
                      DateTimePickerAndroid.open({
                        value: getDateFromDateString(state.endDate),
                        onChange: (event, selectedDate) => {
                          setState({
                            ...state,
                            endDate: getStringFromDate(selectedDate),
                          });
                        },
                        mode: "date",
                      })
                    }
                    title="शेवट तारीख बदला"
                    buttonStyle={{
                      marginLeft: 10,
                      borderRadius: 5,
                    }}
                  />
                </View>

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 10,
                    marginTop: 15,
                  }}
                />

                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 22,
                    lineHeight: 35,
                  }}
                >
                  लागणारे दिवस :{" "}
                  {datediff(
                    getDateFromDateString(state.startDate),
                    getDateFromDateString(state.endDate)
                  )}
                  {"\n"}
                  रोजची जप संख्या :{" "}
                  {Math.ceil(
                    state.chantSankhya /
                      datediff(
                        getDateFromDateString(state.startDate),
                        getDateFromDateString(state.endDate)
                      )
                  )}
                </Text>

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 15,
                    marginTop: 10,
                  }}
                />

                <Input
                  placeholder="अतिरिक्त माहिती येथे लिहा"
                  value={state.additional_text}
                  onChangeText={(e) =>
                    setState({ ...state, additional_text: e })
                  }
                  multiline
                  numberOfLines={4}
                  // maxLength={40}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    borderWidth: 1,
                  }}
                />

                <Input
                  placeholder="हिशोब येथे लिहा"
                  value={state.cost_text}
                  onChangeText={(e) => setState({ ...state, cost_text: e })}
                  multiline
                  numberOfLines={4}
                  // maxLength={40}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    borderWidth: 1,
                  }}
                />

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 22 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  onPress={onSubmit}
                >
                  जतन करा
                </Button>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
