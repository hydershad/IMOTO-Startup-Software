import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RenterScreen from '../screens/RenterScreen';
import PostScreen from '../screens/PostScreen'

// const username = this.props.navigation.getParam('user', 'NO_NAME');

const RenterStack = createStackNavigator({
  Rent: {
    screen: RenterScreen,
    params: { user: 'brendngo' }
  }
});

RenterStack.navigationOptions = {
  tabBarLabel: 'Rent',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-key`
          : 'md-key'
      }
    />
  ),
};

const PostStack = createStackNavigator({
  Post: {
    screen: PostScreen
  }
});

PostStack.navigationOptions = {
  tabBarLabel: 'Post',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-car`
          : 'md-car'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Post',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}
    />
  ),
};

const TabNavigator = createBottomTabNavigator({
  RenterStack,
  PostStack,
});

export default class MainTabNavigator extends React.Component {

  static router = TabNavigator.router;

  render() {
    return(
      <TabNavigator navigation={this.props.navigation} screenProps={this.props.navigation.getParam('user', 'NO_NAME')} />
    )
  }

}

/*
export default createBottomTabNavigator({
  RenterStack,
  LinksStack,
  SettingsStack
});
*/
