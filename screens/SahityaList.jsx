import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Text,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getSahitya, setSahitya, scollEnabled, showAlert } from "../utils";

const SahityaList = ({ route, navigation }) => {
  const focus = useIsFocused();
  const scrollRef = React.useRef(null);

  const [modal, setModal] = React.useState({
    visible: false,
    name: "",
    details: "",
  });

  const [items, setItems] = React.useState([]);

  const onStart = () => {
    getSahitya().then((data) => {
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
          setSahitya(newItems);
          showAlert("सूचना ", "डिलीट केले !");
        },
      },
    ]);
  };

  const shareItem = (data) => {
    Share.share({
      message: data.details,
    }).catch(() => {});
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
            <Overlay
              isVisible={modal.visible}
              //   onBackdropPress={() => setModal({ ...modal, visible: false })}
            >
              <View
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 25,
                  width: 300,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 25,
                    fontWeight: "bold",
                    marginBottom: 25,
                  }}
                >
                  नवीन साहित्य जतन करा
                </Text>

                <Input
                  placeholder="येथे नाव लिहा"
                  style={{ paddingLeft: 10 }}
                  value={modal.name}
                  onChangeText={(text) => setModal({ ...modal, name: text })}
                />
                <Input
                  placeholder="येथे साहित्य पेस्ट करा "
                  multiline={false}
                  numberOfLines={2}
                  style={{ paddingLeft: 10 }}
                  value={modal.details}
                  keyboardType="default"
                  onChangeText={(text) => setModal({ ...modal, details: text })}
                />
                <Button
                  title="जतन करा"
                  onPress={() => {
                    if (modal.name == "" || modal.details == "") {
                      Alert.alert("सूचना ", "कृपया नाव व साहित्य भरा !");
                      return;
                    }
                    const newItems = [
                      ...items,
                      {
                        name: modal.name,
                        details: modal.details,
                      },
                    ];
                    setItems(newItems);
                    setSahitya(newItems);
                    setModal({ visible: false, name: "", details: "" });
                    showAlert("सूचना ", "जतन केले !");
                  }}
                />
                <Button
                  title="रद्द करा"
                  buttonStyle={{ backgroundColor: "#E74C3C", marginTop: 10 }}
                  onPress={() =>
                    setModal({ visible: false, name: "", details: "" })
                  }
                />
              </View>
            </Overlay>
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
                  साहित्य
                </Text>

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 0,
                    marginBottom: 20,
                  }}
                  onPress={() => setModal({ visible: true })}
                >
                  नवीन साहित्य जतन करा
                </Button>

                {items.map((item, index) => (
                  <View key={index} style={{ width: "100%", marginTop: 12 }}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 5,
                        paddingVertical: 12,
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: "#FFB200",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            marginTop: 4,
                            fontSize: 18,
                            maxWidth: 160,
                            flex: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {item.name}
                        </Text>

                        <Button
                          title="पाठवा"
                          buttonStyle={{
                            marginLeft: 10,
                            borderRadius: 5,
                            marginTop: 7.5,
                            backgroundColor: "#F39C12",
                          }}
                          onPress={() => shareItem(item)}
                        />

                        <Button
                          title="डिलीट करा"
                          buttonStyle={{
                            marginLeft: 10,
                            borderRadius: 5,
                            marginTop: 7.5,
                            backgroundColor: "#E74C3C",
                          }}
                          onPress={() => deleteItem(index)}
                        />
                      </View>
                    </View>
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
                    यादी रिकामी आहे,{"\n"} कृपया नवीन साहित्य जतन करा
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

export default SahityaList;
