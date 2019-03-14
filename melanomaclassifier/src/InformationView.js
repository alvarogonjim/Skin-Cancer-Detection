import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card } from 'react-native-elements';


class InformationView extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Settings!</Text>
          <Card
        title='HELLO WORLD'
      >
        <View>
        </View>
        <Text style={{marginBottom: 10}}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          icon={{name: 'code'}}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='VIEW NOW' /> 
        
 
      </Card>
        
        </View>
      );
    }
  }
  
export default InformationView