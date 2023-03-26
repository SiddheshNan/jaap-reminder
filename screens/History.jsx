import React from "react";
import { ScrollView, View, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar, Card, Header, ButtonGroup } from "@rneui/themed";
import Constants from "expo-constants";

// show only current jap (in running)

const HomePage = ({ route, navigation }) => {
  const [searchText, setSearchText] = React.useState("");
  const [items, setItems] = React.useState([]);

  const onSearchType = (queryString) => {
    setSearchText(queryString);

    if (!queryString) {
      setItems([]);
      return;
    }
    // let lowerQueryString = queryString.toLowerCase().trim();

    // if (hasNumber(lowerQueryString)) {
    //   const aartiMatchedByNumber = BOOKLET.filter((item) => {
    //     if (item.number.indexOf(lowerQueryString) >= 0) return true;
    //   });
    //   setItems(aartiMatchedByNumber);
    // } else {
    //   const aartiBySearch = SEARCH.search(lowerQueryString);
    //   setItems(aartiBySearch.map(({ item }) => item));
    // }
    // flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const searchRef = React.useRef(null);
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
          <SearchBar
            onChangeText={onSearchType}
            value={searchText}
            ref={searchRef}
            lightTheme={true}
            round={true}
            inputStyle={{
              backgroundColor: "white",
              fontSize: 15,
            }}
            containerStyle={{
              backgroundColor: "#EAECEE",
              padding: 10,
            }}
            inputContainerStyle={{
              backgroundColor: "white",
              padding: 2, // search box size! Dont change this
              borderColor: "#AEB6BF",
              borderWidth: 1,
              borderBottomWidth: 1,
            }}
            placeholderTextColor={"#85929E"}
            placeholder={"Search Here.."}
          />

          <ScrollView>
            <View style={{ flex: 1, height: "100%", marginTop: 50 }}>
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;
