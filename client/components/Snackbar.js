import React from "react";
import SnackBar from "react-native-snackbar-component";

const SnackbarNotification = (props) => {
  return <SnackBar visible={true} {...props} position="top" />;
};

export default SnackbarNotification;
