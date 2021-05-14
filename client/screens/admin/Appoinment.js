import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  LogBox,
} from "react-native";
import { Block, Text } from "galio-framework";

import { Images, argonTheme } from "../../constants";

const { width, height } = Dimensions.get("screen");

const Appointment = ({ navigation }) => {
  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block flex middle>
          <Block style={styles.appoinmentContainer}>
            <Block flex>
              <Block flex={0.17} middle>
                <Text style={styles.tabTitle}>Panel de citas médicas</Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  appoinmentContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },

  inputIcons: {
    marginRight: 12,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "400",
    color: argonTheme.COLORS.HEADER,
  },
  createButton: {
    width: width * 0.7,
    marginTop: 25,
  },
});

export default Appointment;
