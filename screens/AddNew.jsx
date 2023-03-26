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
  getInitialState,
} from "../utils";

const HomePage = ({ route, navigation }) => {
  const focus = useIsFocused();

  const scrollRef = React.useRef(null);
  const [state, setState] = React.useState(getInitialState());
  const [mantras, setMantras] = React.useState([]);

  React.useEffect(() => {
    if (focus) {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });

      getMantras().then((mantra) => {
        setMantras(mantra);
        if (typeof mantra[0] !== "undefined") {
          setState({
            ...state,
            chantName: mantra[0].name,
            chantSankhya: mantra[0].num,
          });
        }
      });
    } else {
      setState(getInitialState());
    }
  }, [focus]);

  const onSubmit = async () => {
    try {
      if (
        !state.name ||
        !state.gotra ||
        !state.chantName ||
        !state.chantSankhya
      ) {
        return showAlert("सूचना ", "कृपया संपूर्ण माहिती टाका");
      }
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
      />

      <SafeAreaView style={{ flex: 1, paddingTop: -35 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView ref={scrollRef}>
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
                  नवीन माहिती जतन करा
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
                      title={`${mantra.name} (${mantra.num * state.times})`}
                      checked={state.chantName === mantra.name}
                      onPress={() => {
                        setState({
                          ...state,
                          chantName: mantra.name,
                          chantSankhya: mantra.num,
                        });
                      }}
                      textStyle={{ fontSize: 16 }}
                    />
                  </View>
                ))}

                <ButtonGroup
                  buttons={[
                    "1\nपट",
                    "2\nपट",
                    "3\nपट",
                    "4\nपट",
                    "5\nपट",
                    "6\nपट",
                    "7\nपट",
                    "8\nपट",
                  ]}
                  selectedIndex={state.times - 1}
                  onPress={(e) => {
                    setState({
                      ...state,
                      times: e + 1,
                    });
                  }}
                  containerStyle={{
                    height: 55,
                    width: "100%",
                    alignContent: "center",
                    alignSelf: 'center'
                  }}
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
                    fontSize: 21,
                    lineHeight: 35,
                  }}
                >
                  संपूर्ण जप : {state.chantSankhya * state.times}
                  {"\n"}
                  लागणारे दिवस :{" "}
                  {datediff(
                    getDateFromDateString(state.startDate),
                    getDateFromDateString(state.endDate)
                  )}
                  {"\n"}
                  रोजची जप संख्या :{" "}
                  {Math.ceil(
                    (state.chantSankhya * state.times) /
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
