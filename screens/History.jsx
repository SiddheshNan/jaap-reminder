import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  Input,
  Card,
  Header,
  Button,
  CheckBox,
  ButtonGroup,
} from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
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

const Stack = createNativeStackNavigator();

const ItemList = ({ route, navigation }) => {
  const focus = useIsFocused();
  const scrollRef = React.useRef(null);

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (focus) {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });

      getList().then((data) => {
        setItems(data.reverse());
      });
    }
  }, [focus]);

  const changeItem = (index) => {
    navigation.navigate("EditScreen", { itemIndex: index });
  };

  const deleteItem = (index) => {
    Alert.alert("सूचना ", "तुम्हाला हे डिलीट करायचे आहे का ?", [
      {
        text: "नाही",
        style: "cancel",
      },
      {
        text: "होय ",
        onPress: () => {
          const newItems = items.filter((item, i) => i !== index);
          setItems(newItems);
          saveList(newItems);
          showAlert("सूचना ", "डिलीट केले !");
        },
      },
    ]);
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Header
        elevated={0}
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
                  paddingVertical: 25,
                  paddingHorizontal: 23,
                  borderRadius: 15,
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
                  संपूर्ण यादी संपादन
                </Text>

                {items.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      marginBottom: 20,
                      paddingVertical: 12,
                      paddingHorizontal: 25,
                      borderColor: "#FFB200",
                    }}
                  >
                    <Text style={{ fontSize: 18, lineHeight: 26 }}>
                      नाव : {item.name}
                      {"\n"}
                      गोत्र : {item.gotra}
                      {"\n"}
                      मंत्र : {item.chantName} (संपूर्ण संख्या :{" "}
                      {item.chantSankhya * item.times}){"\n"}
                      तारखा : {item.startDate} - {item.endDate}
                      {"\n"}(
                      {datediff(
                        getDateFromDateString(item.startDate),
                        getDateFromDateString(item.endDate)
                      )}{" "}
                      दिवस)
                    </Text>
                    <Button
                      size="sm"
                      titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                      buttonStyle={{
                        backgroundColor: "#27AE60",
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                      onPress={() => changeItem(index)}
                    >
                      बदल करा
                    </Button>

                    <Button
                      size="sm"
                      titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                      buttonStyle={{
                        backgroundColor: "#E74C3C",
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                      onPress={() => deleteItem(index)}
                    >
                      डिलीट करा
                    </Button>
                  </View>
                ))}

                {items.length === 0 && (
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      color: "#28B463",
                    }}
                  >
                    यादी रिकामी आहे,{"\n"} कृपया नवीन माहिती ऍड करा
                  </Text>
                )}
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const EditScreen = ({ route, navigation }) => {
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
        const itemIndex = route.params.itemIndex;
        getList().then((data) => {
          const item = data[itemIndex];
          setState(item);
        });
      });
    } else {
      setState(getInitialState());
    }
  }, [focus]);

  const onSubmit = async () => {
    try {
      if (!state.name || !state.gotra) {
        return showAlert("सूचना ", "कृपया नाव आणि गोत्र टाका ");
      }

      const allItem = await getList();
      const itemIndex = route.params.itemIndex;
      allItem[itemIndex] = state;
      await saveList(allItem);

      Alert.alert("सूचना ", "जतन झाले !", [
        { text: "OK", onPress: () => navigation.goBack() },
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
                  माहिती एडिट करा
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
                  buttons={["1 पट", "2 पट", "3 पट", "4 पट"]}
                  selectedIndex={state.times - 1}
                  onPress={(e) => {
                    setState({
                      ...state,
                      times: e + 1,
                      chantSankhya: mantras.find(
                        (mantra) => mantra.name === state.chantName
                      ).num,
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

function History({ navigation }) {
  const focus = useIsFocused();
  React.useEffect(() => {
    if (focus) {
      navigation.navigate("ItemList");
    }
  }, [focus]);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ItemList"
    >
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
    </Stack.Navigator>
  );
}

export default History;
