import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Header } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import {
  datediff,
  getJapCount,
  getList,
  getDateFromDateString,
  getTodayDateString,
  checkBetweenTwoDates,
} from "../utils";

// show only current jap (in running)
const HomePage = ({ route, navigation }) => {
  const focus = useIsFocused();
  const scrollRef = React.useRef(null);

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (focus) {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });

      getList().then((allItems) => {
        const loc_items = [];

        const todayDate = getTodayDateString();

        for (let myItem of allItems) {
          if (
            checkBetweenTwoDates(myItem.startDate, myItem.endDate, todayDate)
          ) {
            loc_items.push(myItem);
          }
        }
        setItems(loc_items);
        // setItems(data);
      });
    }
  }, [focus]);

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
                आजचे जप
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
                    मंत्र : {item.chantName} ({item.chantSankhya}) ({item.times}{" "}
                    पट)
                    {"\n"}
                    एकूण संख्या : {item.chantSankhya * item.times}
                    {"\n"}
                    तारखा : {item.startDate} - {item.endDate}
                    {"\n"}
                    दिवस :{" "}
                    {datediff(
                      getDateFromDateString(item.startDate),
                      getDateFromDateString(item.endDate)
                    )}
                  </Text>

                  <Text
                    style={{ fontSize: 20, marginTop: 7.5, fontWeight: "bold" }}
                  >
                    आजची जप संख्या :{" "}
                    {getJapCount(
                      item.chantSankhya * item.times,
                      item.startDate,
                      item.endDate
                    )}
                    {/* {"\n"}
                    एकूण जप संख्या : {item.chantSankhya * item.times} */}
                  </Text>
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
                  आज कोणताही जप उपलब्ध नाही !
                </Text>
              )}

              {/* <Button
                  title={"User Login"}
                  size="lg"
                  titleStyle={styles.btnText}
                  buttonStyle={styles.buttons}
                  containerStyle={styles.btnContainer}
                  onPress={() => {
                    navigation.navigate("UserLogin");
                  }}
                /> */}
              {/* <Button
                  title={"User Signup"}
                  size="lg"
                  titleStyle={styles.btnText}
                  buttonStyle={styles.buttons}
                  containerStyle={styles.btnContainer}
                  onPress={() => {
                    navigation.navigate("UserRegister");
                  }}
                /> */}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
