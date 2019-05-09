import React, { Component } from "react";
import { MapView, Constants, Location, Permissions } from "expo";
import { View, Text, Platform } from "react-native";
import { BLText } from "../components/StyledComponents";
import F8StyleSheet from "../components/F8StyleSheet";
import { connect } from "react-redux";
const { Marker, Callout } = MapView;

import ListingCellView from "../subviews/ListingCellView";

class MapScreen extends Component {
  static navigationOptions = {
    title: "Nearby Stations"
  };

  state = {
    region: {
      latitude: 0,
      longitude:0,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421
    }
  };

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      return this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    }
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      const errorMessage = "Permission to access location was denied";
      console.warn(errorMessage);
      this.setState({ errorMessage });
    }
    let region = (await Location.getCurrentPositionAsync({})).coords;
    region = { ...this.state.region, ...region };
    this.setState({ region });\
  };

  calculateRegion({ latitude, longitude, accuracy }) {
    const oneDegreeOfLongitudeInMeters = 111.32;
    const circumference = 40075 / 360;
    const latitudeDelta = accuracy / oneDegreeOfLongitudeInMeters;
    const longitudeDelta = accuracy * (1 / Math.cos(latitude * circumference));
    const region = { latitude, longitude, latitudeDelta, longitudeDelta };
    this.setState({ region });
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position =>
      this.calculateRegion(position)
    );
  };

  renderMarkers() {
    return (markers = Object.keys(this.props.stations).map(key => {
      const station = this.props.stations[key];
      return (marker = (
        <Marker
          key={key}
          onPress={this.onMarkerPress.bind(this, station)}
          coordinate={{
            latitude: Number(station.location.lat),
            longitude: Number(station.location.lng)
          }}
        >
          <Callout
            onPress={() => {
              this.props.navigation.navigate("ListScreen");
              // this.props.navigation.navigate("StationDetail", {
              //   title: station.title
              // });
            }}
          >
            <BLText>{station.title}</BLText>
          </Callout>
        </Marker>
      ));
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={this.state.region}
          showsUserLocation={true}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  stations: state.main.stations
});

export default connect(mapStateToProps)(MapScreen);

const styles = F8StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  }
});
