import React, { Component } from "react";
import {
  Image,
  Input,
  Button,
  ThemeProvider,
  Overlay
} from "react-native-elements";
import { View, Text, Picker } from "react-native";
import { DotIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import { login, assignUser } from "../redux/actions/authActions";
import F8StyleSheet from "../components/F8StyleSheet";
import { Dropdown } from "react-native-material-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import User from "../models/User";
import uuid from "react-native-uuid";

class LoginView extends Component {
  state = {
    username: "",
    // username: uuid.v1(),
    password: "",
    isLoading: false,
    usernameError: "",
    passwordError: ""
  };

  autoLogin() {
    setTimeout(() => {
      this.handleLogin();
    }, 500);
  }

  async componentDidMount() {
    await this.setState({ selectedUserId: 1 });
    // this.autoLogin();
  }

  async performLogin(user) {
    await this.props.assignUser(user);
    this.props.navigation.navigate("Main");
  }

  async handleLogin() {
    const { username, password } = this.state;
    if (!username) this.setState({ usernameError: "Username required" });
    if (!password) this.setState({ passwordError: "Password required" });
  }

  selectDropdown(id) {
    this.setState({ selectedUserId: id, username: "", usernameError: "" });
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.superContainer}>
        <View style={styles.container}>
          <Overlay
            containerStyle={styles.modal}
            height={200}
            width={200}
            isVisible={this.state.isLoading}
            style={styles.modal}
            borderRadius={20}
            overlayBackgroundColor={"lightblue"}
          >
            <View style={styles.modalContainer}>
              <DotIndicator color={"darkgrey"} />
              <Text>Logging in...</Text>
            </View>
          </Overlay>

          <ThemeProvider theme={theme}>
            <Image
              source={require("../../assets/logos/ElectroLogo.png")}
              style={styles.image}
            />
            <Input
              placeholder="Username"
              label={this.state.username && "Username"}
              value={this.state.username}
              autoCorrect={false}
              autoCapitalize={"none"}
              onChangeText={username => {
                this.setState({
                  username,
                  selectedUserId: null,
                  usernameError: ""
                });
              }}
              errorMessage={this.state.usernameError}
            />
            <Input
              placeholder="Password"
              label={this.state.password && "Password"}
              secureTextEntry
              value={this.state.password}
              autoCorrect={false}
              autoCapitalize={"none"}
              onChangeText={password => {
                this.setState({
                  password,
                  selectedUserId: null,
                  passwordError: ""
                });
              }}
              errorMessage={this.state.passwordError}
            />
            <Button title="Login" onPress={this.handleLogin.bind(this)} />
          </ThemeProvider>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function dropdownFriendlyUsers(users) {
  return Object.entries(users).map(([id, user]) => {
    return {
      label: user.username,
      value: id
    };
  });
}

export default connect(
  state => ({
    isLoading: state.auth.isLoading,
    user: state.auth.user,
    users: state.auth.users,
    dropdownUsers: dropdownFriendlyUsers(state.auth.users),
    error: state.auth.error
  }),
  { login, assignUser }
)(LoginView);

const theme = {
  Input: {
    containerStyle: {
      padding: 10
    }
  },
  Button: {
    containerStyle: {
      padding: 30,
      width: "100%"
    }
  }
};

const styles = F8StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  superContainer: {
    flex: 1,
    justifyContent: "center"
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 40
  },
  modalContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    margin: 40
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
