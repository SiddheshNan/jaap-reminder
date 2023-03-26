import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar, Card, Header, ButtonGroup } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import { getList } from "../utils";

// show only current jap (in running)
const HomePage = ({ route, navigation }) => {
  const focus = useIsFocused();

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (focus) {
      getList().then((data) => {
        setItems(data);
      });
    }
  }, [focus]);

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
        <ScrollView>
          <View style={{ flex: 1, height: "100%", marginTop: 15 }}>
            <Card containerStyle={{ padding: 20, borderRadius: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <Text>{JSON.stringify(items)}</Text>
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
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
