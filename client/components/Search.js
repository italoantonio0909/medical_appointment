import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { theme } from "galio-framework";
import argonTheme from "../constants/Theme";

import Icon from "./Icon";
import Input from "./Input";

const { width } = Dimensions.get("window");

const Search = (props) => {
  return (
    <Input
      placeholder="Escribe para buscar"
      right
      color="black"
      style={styles.search}
      placeholderTextColor={"#8898AA"}
      {...props}
      iconContent={
        <Icon
          size={16}
          color={theme.COLORS.MUTED}
          name="search-zoom-in"
          family="ArgonExtra"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  search: {
    height: 48,
    width: width - 60,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER,
  },
});

export default Search;
