import React, { Component } from "react";
import { BLText } from "../components/StyledComponents";
import {
  ScrollView,
  View,
  Linking,
  TouchableOpacity,
  Platform
} from "react-native";
import { Image, Avatar } from "react-native-elements";
import F8StyleSheet from "../components/F8StyleSheet";
import { connect } from "react-redux";
import { getImageForStation } from "../redux/actions/readActions";
import { MaterialIndicator } from "react-native-indicators";

const CellTextRow = props => (
  <BLText style={[{ padding: 2, textAlign: "left" }, props.style]}>
    {props.children}
  </BLText>
);

const Spinner = <MaterialIndicator color={"blue"} />;

function openMap(address) {
  let baseURL = "https://www.google.com/maps/search/?api=1&query=";
  // if (Platform.OS === 'ios') baseURL = "http://maps.apple.com/?q="
  Linking.openURL(baseURL + address).catch(err =>
    console.error("An error occurred", err)
  );
}

const StationWebsite = ({ station }) => {
  if (station.website) {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(station.website)}>
        <CellTextRow style={[text.address, text.link]}>
          {station.website}
        </CellTextRow>
      </TouchableOpacity>
    );
  }
  return null;
};

const StationImage = ({ station }) => {
  if (station.mediaID > 0 && (url = station.imageURL)) {
    return (
      <Image
        style={[styles.image, { resizeMode: "cover" }]}
        source={{ uri: url }}
        PlaceholderContent={Spinner}
      />
    );
  } else {
    return (
      <View style={[styles.centered, styles.image]}>
        <BLText>No Image Provided</BLText>
      </View>
    );
  }
};

class StationDetailView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  async componentDidMount() {
    if (!this.props.station.imageURL) {
      try {
        await this.props.getImageForStation(this.props.station);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  render() {
    station = this.props.station;
    return (
      <ScrollView>
        <View style={styles.imageContainer}>
          <StationImage station={station} />
        </View>

        <View style={styles.textContainer}>
          <View style={[styles.rowContainer]}>
            <View style={[styles.infoCell]}>
              {/* Title */}
              <CellTextRow style={text.title}>{station.title}</CellTextRow>
              {/* Address */}
              <TouchableOpacity onPress={openMap.bind(null, station.address)}>
                <CellTextRow style={[text.address, text.link]}>
                  {station.address}
                </CellTextRow>
              </TouchableOpacity>
              {/* Website */}
              <StationWebsite station={station} />
            </View>
            <View style={[styles.iconCell]}>
              {/* Email */}
              <Avatar
                rounded
                icon={{ name: "email-outline", type: "material-community" }}
              />
              {/* Phone */}
              <Avatar rounded icon={{ name: "phone", type: "feather" }} />
            </View>
          </View>

          {/* Price */}

          {/* Description */}
          <CellTextRow style={[text.content, { paddingTop: 20 }]}>
            {station.content.replace("<p>", "").replace("</p>", "")}
          </CellTextRow>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  station: state.main.stations[state.main.currentStationID],
  stations: state.main.stations
});

export default connect(
  mapStateToProps,
  { getImageForStation }
)(StationDetailView);

const baseSize = 17;
const text = F8StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24
  },
  address: {
    fontSize: baseSize
  },
  content: {
    fontSize: baseSize
  },
  website: {
    fontSize: baseSize
  },
  link: {
    color: "blue",
    textDecorationLine: "underline"
  }
});

const styles = F8StyleSheet.create({
  infoCell: {
    flex: 2,
  },
  iconCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: "lightgrey"
  },
  textContainer: { alignItems: "flex-start", padding: 15 },
  image: {
    height: 350,
    width: null
  },
  bordered: {
    borderColor: "black",
    borderWidth: 1
  },
  centered: {
    justifyContent: "center",
    alignItems: "center"
  }
});
