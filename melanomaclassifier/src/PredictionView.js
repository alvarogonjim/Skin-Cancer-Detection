import React from "react";
import { Text, View, Image, StyleSheet, Platform } from "react-native";
import { Header, Card, Button } from "react-native-elements";
import Colors from "./utils/Colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from "react-native-image-picker";

const styles = StyleSheet.create({
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: Colors["secondary-color"],
    textAlign: "center",
    marginBottom: 20,
    marginTop: 15
  },
  textPrev:{
    fontSize: 15,
    color: Colors["tonic-color"],
    textAlign: "center",
  },
  titlesPrev:{
    fontSize: 15,
    color: Colors["primary-color"],
    textAlign: "center",
  },
  image: {
    paddingVertical: 150,
    width: 300,
    height: 300,
    borderRadius: 50
  },
  prevContainer: {
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
class PredictionView extends React.Component {
  state = {
    avatarSource: null,
    avatarData: null,
    photo: null,
    prediction: null,
    probability: null,
  };
  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          photo: response,
          avatarSource: source,
          avatarData: response.data
        });
      }
    });
  }

  retrievePredictionInfo = () => {
    debugger;
    const data = new FormData();
    data.append('file', {
    name: this.state.photo.fileName,
    type: this.state.photo.type,
    uri: Platform.OS === 'android' ? this.state.photo.uri : this.state.photo.uri.replace("file//", ""),
    })
    fetch('http://192.168.1.45:5000/predict', {
      method: 'POST',
      body:data
    })
    .then(response => response.json())
    .then(response => {
      console.log('Upload success', response)
      this.setState({photo:null,
      prediction: response['prediction'],
    probability: response['probability']})
    }).catch(error => {
      console.log('Upload error', error)
    })
  }


  render() {
    let source = 'data:image/jpeg;base64,' + this.state.avatarData
    let imagePrevisualization = this.state.avatarSource ? (
      <View style={styles.prevContainer}>
        <Image
          style={{ marginTop: 10, marginBottom: 10, width: 300, height: 300 }}
          source={{ uri: source }}
        />
        <Button
          icon={
            <Icon
              name='arrow-right'
              size={15}
              color='white'
            />
          }
          buttonStyle={{
            backgroundColor: Colors["primary-color"],
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0
          }}
          title='PREDICTION'
          onPress={() => this.retrievePredictionInfo()}
        />
      </View>

    ) : (<View />);

    let textPrevisualization = this.state.prediction ? (
      <View style={styles.prevContainer}>
        <Text style={styles.titlesPrev}>
        Prediction:
          <Text style={styles.textPrev}>
            {this.state.prediction}
          </Text>
        </Text>
        <Text style={styles.titlesPrev}>
        Probability:
        <Text style={styles.textPrev}>
        {this.state.probability} %
        </Text>
        </Text>
        
      </View>
    ) : (<View />);
    return (<View>
      <Header
        statusBarProps={{ barStyle: "light-content" }}
        outerContainerStyles={{ backgroundColor: Colors["tonic-color"] }}
        innerContainerStyles={{ justifyContent: "space-around" }}
        centerComponent={{
          text: "PREDICTION",
          style: { color: Colors["sub-text-color"] }
        }}
      />

      <Card title="UPLOAD THE LESSION">
        <View />
        <Text style={{ marginBottom: 10 }}>
          Take a picture or upload a photo of the lession and press on the button predict to get the predicted results.
        </Text>
        <Button
          icon={{ name: "camera-alt" }}
          backgroundColor={Colors["secondary-color"]}
          buttonStyle={{
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 10
          }}
          title="UPLOAD"
          onPress={this.selectPhotoTapped.bind(this)}
        />
      </Card>
      {imagePrevisualization}
      {textPrevisualization}
    </View>
    )
  }
}

export default PredictionView;
