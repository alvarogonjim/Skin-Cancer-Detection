import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import PredictionView from './PredictionView';
import InformationView from './InformationView';
import Colors from './utils/Colors';

const TabNavigator = createBottomTabNavigator({
  Prediction: PredictionView,
  Information: InformationView,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Ionicons;
      let iconName;
      if (routeName === 'Information') {
        iconName = `ios-information-circle${focused ? '' : '-outline'}`;
         
      } else if (routeName === 'Prediction') {
        iconName = `ios-add-circle${focused ? '' : '-outline'}`;
      }

      // You can return any component that you like here!
      return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    showLabel: false,
    activeTintColor: Colors["tonic-color"],
    inactiveTintColor: Colors["primary-color"],
  },
}
);

export default createAppContainer(TabNavigator);