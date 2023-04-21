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
  Overlay,
} from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import {
  getMantras,
  getJapCount,
  getTodayDateString,
  getDateFromDateString,
  getStringFromDate,
  addDateToExistingDateString,
  datediff,
  getList,
  saveList,
  showAlert,
  getInitialState,
  setMantras,
  scollEnabled,
  doBackup,
  doRestore,
} from "../utils";

const Stack = createNativeStackNavigator();

const ItemList = ({ route, navigation }) => {
  const focus = useIsFocused();
  const scrollRef = React.useRef(null);

  const [items, setItems] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  const onStart = () => {
    getList().then((data) => {
      setItems(data);
    });
  };

  React.useEffect(() => {
    if (focus) {
      if (scollEnabled)
        scrollRef?.current?.scrollTo({
          y: 0,
          animated: true,
        });
      onStart();
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
        rightComponent={{
          icon: "backup",
          color: "#fff",
          size: 30,
          style: {
            marginTop: 7,
            marginRight: 13,
          },
          onPress: () => setModalVisible(true),
        }}
      />

      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View
          style={{ paddingVertical: 25, paddingHorizontal: 25, width: 300 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 21,
              marginBottom: 15,
            }}
          >
            कृपया पुढील पर्याय निवडा
          </Text>
          <Button
            size="sm"
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
            buttonStyle={{
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={() => doBackup().then(() => setModalVisible(false))}
          >
            संपूर्ण बॅकअप घ्या
          </Button>

          <Button
            size="sm"
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
            buttonStyle={{
              // backgroundColor: "#E74C3C",
              borderRadius: 5,
              marginTop: 25,
            }}
            onPress={() =>
              doRestore().then(() => {
                onStart();
                setModalVisible(false);
              })
            }
          >
            रिस्टोर करा
          </Button>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              marginBottom: 25,
              marginTop: 25,
            }}
          />
          <Button
            size="sm"
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
            buttonStyle={{
              borderRadius: 5,
              backgroundColor: "#27AE60",
            }}
            onPress={() => setModalVisible(false)}
          >
            मागे या
          </Button>
        </View>
      </Overlay>

      <SafeAreaView style={{ flex: 1, paddingTop: -35 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView ref={scrollRef}>
            <View style={{ flex: 1, height: "100%", marginBottom: 30 }}>
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
                      मंत्र : {item.chantName} ({item.chantSankhya}) (
                      {item.times} पट)
                      {"\n"}
                      एकूण संख्या : {item.chantSankhya * item.times}
                      {"\n"}
                      तारीख : {item.startDate} - {item.endDate}
                      {"\n"}
                      दिवस :{" "}
                      {datediff(
                        getDateFromDateString(item.startDate),
                        getDateFromDateString(item.endDate)
                      )}
                      {"\n"}
                      एक दिवसाचा जप :{" "}
                      {getJapCount(
                        item.chantSankhya * item.times,
                        item.startDate,
                        item.endDate
                      )}
                      {item.additional_text && (
                        <>
                          {"\n"}
                          अतिरिक्त माहिती : {item.additional_text}
                        </>
                      )}
                      {item?.cost_text && (
                        <>
                          {"\n"}
                          हिशोब : {item.cost_text}
                        </>
                      )}
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
                    यादी रिकामी आहे,{"\n"} कृपया नवीन माहिती संपादित करा
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

  const [costOverlay, setCostOverlay] = React.useState({
    visible: false,
    cost: "",
    date: "",
  });

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
          const myData = data[itemIndex];
          console.log(myData);
          setState({
            ...getInitialState(),
            ...myData,
          });
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

      <Overlay
        isVisible={costOverlay.visible}
        onBackdropPress={() =>
          setCostOverlay({ ...costOverlay, visible: false })
        }
      >
        <View
          style={{ paddingVertical: 20, paddingHorizontal: 25, width: 300 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 25,
            }}
          >
            नवीन हिशोब टाका
          </Text>

          <Input
            placeholder="येथे रक्कम टाका "
            style={{ paddingLeft: 10 }}
            value={costOverlay.cost}
            keyboardType="numeric"
            onChangeText={(text) =>
              setCostOverlay({ ...costOverlay, cost: text })
            }
          />
          <Input
            placeholder="येथे तारीख टाका "
            style={{ paddingLeft: 10 }}
            value={costOverlay.date}
            keyboardType="default"
            onChangeText={(text) =>
              setCostOverlay({ ...costOverlay, date: text })
            }
          />
          <Button
            title="जतन करा"
            onPress={() => {
              setState({
                ...state,
                cost_arr: [
                  ...state.cost_arr,
                  { cost: costOverlay.cost, date: costOverlay.date },
                ],
              });
              setCostOverlay({ visible: false, cost: "", date: "" });
            }}
          />
          <Button
            title="रद्द करा"
            buttonStyle={{ backgroundColor: "#E74C3C", marginTop: 10 }}
            onPress={() =>
              setCostOverlay({ visible: false, cost: "", date: "" })
            }
          />
        </View>
      </Overlay>

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
                  माहिती संपादित करा
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
                  buttons={["1\nपट", "2\nपट", "3\nपट", "4\nपट"]}
                  selectedIndex={state.times - 1}
                  onPress={(e) => {
                    setState({
                      ...state,
                      times: e + 1,
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
                            // endDate: addDateToExistingDateString(
                            //   getStringFromDate(selectedDate),
                            //   30
                            // ),
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

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 15,
                    marginTop: 0,
                  }}
                />

                {state.cost_arr.map((item, index) => (
                  <View
                    key={`${item.cost}-${item.date}`}
                    style={{ marginLeft: 5, marginBottom: 5 }}
                  >
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                      Rs. {item.cost} - {item.date}{" "}
                      <Button
                        color={"error"}
                        size="sm"
                        title="डिलिट"
                        onPress={() => {
                          const oldCostArr = state.cost_arr;
                          oldCostArr.splice(index, 1);
                          setState({
                            ...state,
                            cost_arr: oldCostArr,
                          });
                        }}
                      />
                    </Text>
                  </View>
                ))}

                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 20,
                    lineHeight: 35,
                    marginTop: 10,
                  }}
                >
                  एकूण हिशोब बेरीज :{" "}
                  {state.cost_arr
                    .map((item) => parseInt(item.cost) || 0)
                    .reduce((a, b) => a + b, 0)}
                </Text>

                <Button
                  onPress={() =>
                    setCostOverlay({
                      ...costOverlay,
                      visible: true,
                    })
                  }
                  color={"warning"}
                  title="नवीन हिशोब टाका"
                  buttonStyle={{
                    marginTop: 10,
                    marginLeft: 10,
                    borderRadius: 5,
                  }}
                />

                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 0,
                    marginTop: 10,
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
