import React from 'react';
import { ScrollView, StyleSheet, Button, Alert, Modal, View, Text, TouchableHighlight, FlatList, DatePickerIOS, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Input, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geocode from "react-geocode";

function onButtonPress() {
    Alert.alert('on Press!')
}

export default class PostScreen extends React.Component {

    constructor() {
      super();
      Geocode.setApiKey("AIzaSyCgRtXEN_QfQilqkqsvqiGNtcUiBgpC498");
      this.state = {
        addingCar: false,
        text: '',
        email: 'test@test.com',
        index: 0,
        data: [],
        data_debug: '',

        newCarPlate: '',
        newCarMake: '',
        newCarModel: '',
        newCarColor: '',
        newCarYear: '',
        newCarPassengers: '',

        chosenCar: {},
        startTime: new Date(),
        endTime: new Date(),
        hourlyRate: 0,
        dailyRate: 0,
        address: '',
        longitude: 0, //-97.737831,
        latitude: 0, //30.281656,

        debug: ''
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.address !== this.state.address){
        this.updateLongLat();
      }
    }


    updateLongLat = () => {
      Geocode.fromAddress(this.state.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({
            longitude: parseFloat(lng),
            latitude: parseFloat(lat),
          });
        },
        error => {
          console.log(error);
        }
      )
    }

    getCars = () => {
      fetch('https://us-central1-senior-design-230918.cloudfunctions.net/get_car_owner', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            data: responseJson,
            //data_debug: JSON.stringify(responseJson)
          })
        })
        .catch((error) => {
          this.setState({debug: 'failure'})
          console.error(error);
        }
      );
    }

    submitCarPosting = () => {
      this.updateLongLat();
      // this.setState({data_debug:
      //   JSON.stringify({
      //     license_plate: this.state.chosenCar.license_plate,
      //     start_time: this.state.startTime, //SQL timestamp
      //     end_time: this.state.endTime, //SQL timestamp
      //     hourly_rate: this.state.hourlyRate, //double
      //     daily_rate: this.state.dailyRate, //double
      //     address: this.state.address, //string
      //     longitude: this.state.longitude, //double
      //     latitude: this.state.latitude //double
      // 	})
      // });

      fetch('https://us-central1-senior-design-230918.cloudfunctions.net/add_to_car_posting', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_plate: this.state.chosenCar.license_plate,
          start_time: this.state.startTime, //SQL timestamp
          end_time: this.state.endTime, //SQL timestamp
          hourly_rate: this.state.hourlyRate, //double
          daily_rate: this.state.dailyRate, //double
          address: this.state.address, //string
          longitude: this.state.longitude, //double
          latitude: this.state.latitude //double
        }),
        })
        .then((response) => response.text())
        .then((responseJson) => {
          this.setState({debug: responseJson})
        })
        .catch((error) => {
          this.setState({debug: 'failure'})
          console.error(error);
        }
      );

      this.setState({index: 0});
    }

    createNewCar = () => {
      fetch('https://us-central1-senior-design-230918.cloudfunctions.net/add_car_to_fleet', {
  			method: 'POST',
  			headers: {
  			  Accept: 'application/json',
  			  'Content-Type': 'application/json',
  			},
  			body: JSON.stringify({
          license_plate: this.state.newCarPlate,
          email: this.state.email,
          make: this.state.newCarMake,
          model: this.state.newCarModel,
          year: this.state.newCarYear,
          color: this.state.newCarColor,
          passengers: this.state.newCarPassengers,
          listed: false
  			}),
  			})
  			.then((response) => response.text())
  			.then((responseJson) => {
  				this.setState({debug: responseJson})
  			})
  			.catch((error) => {
  				this.setState({debug: 'failure'})
  				console.error(error);
  			}
  		);
      this.toggle();
    }

    toggle = () => {
      this.setState({
        addingCar: !this.state.addingCar
      })
    }


    updateIndex = (selectedIndex) => {
      this.setState({index: selectedIndex})
    }

    renderScreen = () => {
      if(!this.state.addingCar) {
        if (this.state.index == 0){
          return this.renderCarListScreen();
        } else if (this.state.index == 1){
          return this.renderPostCarScreen();
        }
      } else {
        return this.renderInputScreen();
      }
    }

    postCarScreen = (thisCar) => {
      this.setState({
        index: 1,
        chosenCar: thisCar,
      })
    }

    postCarListScreen = () => {
      this.setState({
        index: 0,
      })
    }

    renderCarListScreen = () => {
      this.getCars();
      return (
        <KeyboardAvoidingView behavior="padding">
          <View>
            <Button
              style={styles.button}
              onPress={this.toggle.bind(this)}
              title='Add Cars'
            />

            <FlatList
              data = {this.state.data}
              keyExtractor={item => item.license_plate}
              renderItem = {
                ({item}) => (
                  <TouchableOpacity
                    style={styles.listButtonContainer}
                    onPress={this.postCarScreen.bind(this, item)}
                  >
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                  }}>
                    <Icon
                      name='car'
                      iconStyle={{padding: 20, fontSize: 24}}
                    />
                    <Text style={{fontSize: 18, paddingLeft: 10}}>
                      {item.license_plate}
                    </Text>
                  </View>
                  </TouchableOpacity>
              )}
              containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
            />
          </View>
          </KeyboardAvoidingView>
        )
    }

    renderPostCarScreen = () => {
      var car = this.state.chosenCar;
      return (
        <KeyboardAvoidingView behavior="padding">
          <View>
            <Button
              style={styles.button}
              onPress={this.postCarListScreen.bind(this)}
              title='Back'
            />
            <Text style={{fontSize: 18}}>
              This is your <Text style={{fontWeight: 'bold'}}>{car.make} {car.model}, {car.license_plate}. </Text>
            </Text>
            <Text style={styles.label}>Start</Text>
            <DatePickerIOS
              date={this.state.startTime}
              onDateChange={(date) => this.setState({startTime: date})}
            />
            <Text style={styles.label}>End</Text>
            <DatePickerIOS
              date={this.state.endTime}
              onDateChange={(date) => this.setState({endTime: date})}
            />
            <Text style={styles.label}>Hourly Rate</Text>
            <Input
              placeholder=" $$$"
              onChangeText={(text) => this.setState({hourlyRate: parseFloat(text)})}
              leftIcon={<Icon
                name='money'
                size={24}
                color='black'
              />}
             leftIconContainerStyle={styles.leftIcon}
            />
            <Text style={styles.label}>Daily Rate</Text>
            <Input
              placeholder=" $$$"
              onChangeText={(text) => this.setState({dailyRate: parseFloat(text)})}
              leftIcon={<Icon
                name='money'
                size={24}
                color='black'
              />}
             leftIconContainerStyle={styles.leftIcon}
            />
            <Text style={styles.label}>Address</Text>
            <Input
              placeholder=" Address"
              onChangeText={(text) => this.setState({address: text})}
              leftIcon={<Icon
                name='map'
                size={24}
                color='black'
              />}
             leftIconContainerStyle={styles.leftIcon}
            />
            <Button
              style={styles.button}
              onPress={this.submitCarPosting.bind(this)}
              title='Submit'
            />
          </View>
        </KeyboardAvoidingView>
      )
    }

    renderInputScreen = () => {
      return (
        <KeyboardAvoidingView behavior="padding">
          <View>
            <Button onPress={this.toggle.bind(this)} title='Close'/>
            <Input
              label='License Plate Number'
              onChangeText={(text) => this.setState({newCarPlate: text})}
            />
            <Input
              label='Make'
              onChangeText={(text) => this.setState({newCarMake: text})}
            />
            <Input
              label='Model'
              onChangeText={(text) => this.setState({newCarModel: text})}
            />
            <Input
              label='Color'
              onChangeText={(text) => this.setState({newCarColor: text})}
            />
            <Input
              label='Year'
              onChangeText={(text) => this.setState({newCarYear: text})}
            />
            <Input
              label='No. of Passengers'
              onChangeText={(text) => this.setState({newCarPassengers: text})}
            />
            <Button onPress={this.createNewCar.bind(this)} title='Submit'/>
            <Text> {this.state.debug} </Text>
          </View>
        </KeyboardAvoidingView>
        )
    }

    renderSeparator = () => {
      return (
        <View style={{height: 2, backgroundColor: "#CED0CE",}} />
      );
    };

    renderHeader = () => {
      return (
        <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'left', paddingTop: 15}}>
          My available cars:
        </Text>
      )
    }

    static navigationOptions = {
      title: 'Post',
    };

    render() {
      return (
        <ScrollView style={styles.container}>
          {this.renderScreen()}
        </ScrollView>
      );
    }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#2980b6',
  },
  label: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    color: '#696969',
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  listButtonContainer: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10
  },
  buttonContainer:{
    backgroundColor: '#2980b6',
    paddingVertical: 15,
    flex: 1
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
});
