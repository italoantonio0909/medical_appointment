import React from "react";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = (props) => {
  return (
    <DropDownPicker
      items={[
        { label: "UK", value: "uk" },
        { label: "France", value: "france" },
        { label: "Germany", value: "germany" },
      ]}
      placeholder="Select a country"
      containerStyle={{ height: 40 }}
      style={{ backgroundColor: "#ffffff" }}
      dropDownStyle={{ backgroundColor: "white" }}
    />
  );
};

export default Dropdown;
