import React from "react";
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Header, Overlay, Input } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import {
  getMantras,
  setMantras,
  showAlert,
  planets_default,
  scollEnabled,
} from "../utils";

const Mantras = ({ route, navigation }) => {
  const focus = useIsFocused();

  const scrollRef = React.useRef(null);
  const [modal, setModal] = React.useState({
    visible: false,
    name: "",
    num: "",
  });

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (focus) {
      if (scollEnabled)
        scrollRef?.current?.scrollTo({
          y: 0,
          animated: true,
        });

      getMantras().then((data) => {
        setItems(data);
      });
    }
  }, [focus]);

  const addNewMantra = () => {
    const mantraName = modal.name;
    const mantraNum = modal.num;

    if (!mantraName || !mantraNum)
      return showAlert("सूचना ", "कृपया मंत्र आणि जप संख्या टाका");

    const newItems = [...items, { name: mantraName, num: mantraNum }];

    setItems(newItems);
    setMantras(newItems);
    setModal({ visible: false, name: "", num: "" });
    showAlert("सूचना ", "मंत्र जतन झाले!");
  };

  const deleteMantra = (index) => {
    Alert.alert("सूचना", "तुम्हाला हा मंत्र डिलीट करायचा का ?", [
      {
        text: "नाही",
        style: "cancel",
      },
      {
        text: "होय",
        onPress: () => {
          const newItems = items.filter((item, i) => i !== index);
          setItems(newItems);
          setMantras(newItems);
        },
        style: "destructive",
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
      />

      <Overlay isVisible={modal.visible}>
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
            नवीन मंत्र जतन करा
          </Text>

          <Input
            placeholder="येथे मंत्राचे नाव लिहा"
            style={{ paddingLeft: 10 }}
            value={modal.name}
            onChangeText={(text) => setModal({ ...modal, name: text })}
          />
          <Input
            placeholder="जप संख्या (फक्त 1 पट)"
            style={{ paddingLeft: 10 }}
            value={modal.num}
            keyboardType="numeric"
            onChangeText={(text) => setModal({ ...modal, num: text })}
          />
          <Button title="जतन करा" onPress={addNewMantra} />
          <Button
            title="रद्द करा"
            buttonStyle={{ backgroundColor: "#E74C3C", marginTop: 10 }}
            onPress={() => setModal({ visible: false, name: "", num: "" })}
          />
        </View>
      </Overlay>

      <SafeAreaView style={{ flex: 1, paddingTop: -35 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView ref={scrollRef}>
            <View style={{ flex: 1, height: "100%" }}>
              <Card
                containerStyle={{
                  padding: 20,
                  borderRadius: 15,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 25,
                    fontWeight: "bold",
                  }}
                >
                  मंत्रे यादी
                </Text>

                <Button
                  size="sm"
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  buttonStyle={{
                    backgroundColor: "#27AE60",
                    borderRadius: 5,
                    marginTop: 10,
                    marginBottom: 5,
                  }}
                  onPress={() => setModal({ visible: true })}
                >
                  नवीन मंत्र जतन करा
                </Button>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center",
                    width: "95%",
                    marginTop: 10,
                  }}
                >
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
                            {"\n"}
                            (संख्या : {item.num})
                          </Text>

                          {planets_default.filter(
                            (planet) => planet.name === item.name
                          ).length > 0 ? null : (
                            <Button
                              title="डिलीट करा"
                              buttonStyle={{
                                marginLeft: 10,
                                borderRadius: 5,
                                marginTop: 7.5,
                                backgroundColor: "#E74C3C",
                              }}
                              onPress={() => deleteMantra(index)}
                            />
                          )}
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
                        marginTop: 20,
                      }}
                    >
                      कोणतेही मंत्र नाही,{"\n"}कृपया नवीन मंत्र संपादित करा
                    </Text>
                  )}
                </View>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Mantras;
