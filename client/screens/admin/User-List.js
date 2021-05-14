import React from "react";
import { StyleSheet } from "react-native";
import { Card, theme } from "galio-framework";

const UserList = ({ username, email, avatar, noimage }) => {
  return (
    <Card
      flex
      borderless
      style={styles.container}
      title={username}
      caption={email}
      avatar={avatar}
      imageStyle={styles.cardImageRadius}
      imageBlockStyle={{ padding: theme.SIZES.BASE / 3 }}
      image={noimage ? "" : avatar}
      footerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flex: 1,
  },
});

export default UserList;
