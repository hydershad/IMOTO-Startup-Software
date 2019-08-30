import React from 'react';
import { ScrollView, StyleSheet, Button, Alert, View, Text, TouchableHighlight, KeyboardAvoidingView, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MapView } from 'expo'
import CustomCarCallout from '../components/CustomCarCallout'
import Modal from 'react-native-modal'
import Popover from 'react-native-popover-view'
import { Header } from 'react-navigation'

function onButtonPress() {
  let text = submit();
  Alert.alert('button');
}

export default class RenterScreen extends React.Component {

  /*
          <Button onPress={this.toggleSearch} title='Search'/>
  */

  constructor(props) {
    super();
    
    this.state = {
      isSearchOpen: false,
      isCarBeingRented: false,
      text: "",
      startDate: new Date(),
      endDate: new Date(),
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      availableCars: [],
      rented_car: null,
      debug: 'hello'
    }
    /*
    this.state = {
      isSearchOpen: false,
      text: "",
      startDate: new Date(),
      endDate: new Date(),
      region: {
        latitude: 30.288277206,
        longitude: -97.735235,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      debug: 'hello'
    }
    */
    this.toggleSearch.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
        });
      },
      (error) => this.setState({ text: error.message }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    );

    fetch('https://us-central1-senior-design-230918.cloudfunctions.net/get_cars_renter', {
      method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        /*
        let cars = [
          {
            year: 2000,
            make: 'Toyota',
            model: 'Camry',
            endDate: '12/12/2020',
            hourlyRate: 15,
            dailyRate: 60,
            licensePlate: '123456',
            longitude: -97.73445010185243,
            latitude: 30.28849747135628
          },
          {
            year: 2015,
            make: 'Toyota',
            model: 'Rav4',
            endDate: '11/1/2019',
            hourlyRate: 20,
            dailyRate: 75,
            licensePlate: '654321',
            longitude: -97.73706936277452,
            latitude: 30.28730482819858
          },
          {
            year: 2011,
            make: 'Ford',
            model: 'F150',
            endDate: '6/12/2019',
            hourlyRate: 25,
            dailyRate: 100,
            licensePlate: '987654',
            longitude: -97.74184780195357,
            latitude: 30.284886493050077
          }
        ]
        */
        this.setState({
          availableCars: responseJson,
          debug: this.props.screenProps
        })
      })
      .catch((error) => {
        console.error(error);
      });

  }


  toggleSearch = () => {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen
    })
  }

  rentCar = (car) => {    
    fetch('https://us-central1-senior-design-230918.cloudfunctions.net/rent_car', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_plate: car['license_plate'],
          email: this.props.screenProps,
        }),
      })
      .then((response) => response.text())
      .then((responseJson) => {
        this.setState({
          debug: responseJson,
          rented_car: car,
          isCarBeingRented: true
        })
      })
      .catch((error) => {
        console.error(error);
      });
      /*
    this.setState({
      isCarBeingRented: true,
      debug: license_plate
    })
    */

  }

  returnCar = () => {
    fetch('https://us-central1-senior-design-230918.cloudfunctions.net/test_sms', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              license_plate: this.state.rented_car['license_plate']
            }),
          })
          .then((response) => response.text())
          .then((responseJson) => {
            this.setState({
              debug: responseJson
            })
          })
          .catch((error) => {
            console.error(error);
          });

    fetch('https://us-central1-senior-design-230918.cloudfunctions.net/return_car', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_plate: this.state.rented_car['license_plate']
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          availableCars: responseJson,
          isCarBeingRented: false
        })
      })
      .catch((error) => {
        console.error(error);
      });
/*
    fetch('https://us-central1-senior-design-230918.cloudfunctions.net/get_cars_renter', {
      method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          availableCars: responseJson,
          isCarBeingRented: false
        })
      })
      .catch((error) => {
        console.error(error);
      });
      */
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  onSubmit = () => {
      fetch('https://us-central1-senior-design-230918.cloudfunctions.net/function-1', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          param1: 'Aravind is a pos',
          param2: 'Aravind is a pos 2',
        }),
      })
      .then((response) => response.text())
      .then((responseJson) => {
        this.setState({text: responseJson})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static navigationOptions = {
    title: 'Rent',
  };

  render() {
    const username = this.props.screenProps;
    let car = this.state.rented_car;
    var overlay = this.state.isCarBeingRented ? (
        <View style={styles.rentingModalContainer} opacity={0.9}>
            <View style={styles.rentingText}>
              <Text>You are currently renting a {car['year']} {car['make']} {car['model']}</Text>
              <Text>Return by: {car['end_time']}</Text>
              <Text>License Plate: {car['license_plate']}</Text> 
              <Button onPress={this.returnCar.bind(this)} title='Return Car'/>
            </View>
        </View>) : null;

    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          region={this.state.region}
        >
          {
            this.state.availableCars.map((car) => {
              return(
                <MapView.Marker
                  key={car['license_plate']}
                  coordinate={
                    {
                      latitude: car.latitude,
                      longitude:  car.longitude
                    }
                  }
                >
                  <MapView.Callout>
                      <CustomCarCallout rentCar={this.rentCar.bind(this)} car={car}/>
                  </MapView.Callout>
                </MapView.Marker>
              )
            })
          }
        </MapView>
        <View>
          <Modal style={styles.searchModalContainer} isVisible={this.state.isSearchOpen}>
            <KeyboardAvoidingView behavior="padding">
              <View>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                      <Input 
                        label='Start Date'
                        placeholder="MM/DD/YYYY" 
                        onChangeText={(text) => this.setState({expiryDate: text})}
                        leftIcon={<Icon
                          name='calendar'
                          size={24}
                          color='black'
                        />}
                        leftIconContainerStyle={styles.leftIcon}
                      />
                  </View>
                  <View style={{flex:1}}>
                      <Input 
                        label='Start Time'
                        placeholder="HH:MM" 
                        onChangeText={(text) => this.setState({text})}
                        leftIcon={<Icon
                          name='clock-o'
                          size={24}
                          color='black'
                        />}
                       leftIconContainerStyle={styles.leftIcon}
                      />
                  </View>
                </View>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                      <Input 
                        label='End Date'
                        placeholder="MM/DD/YYYY" 
                        onChangeText={(text) => this.setState({text})}
                        leftIcon={<Icon
                          name='calendar'
                          size={24}
                          color='black'
                        />}
                        leftIconContainerStyle={styles.leftIcon}
                      />
                  </View>
                  <View style={{flex:1}}>
                      <Input 
                        label='End Time'
                        placeholder="HH:TT" 
                        onChangeText={(text) => this.setState({text})}
                        leftIcon={<Icon
                          name='clock-o'
                          size={24}
                          color='black'
                        />}
                       leftIconContainerStyle={styles.leftIcon}
                      />
                  </View>
                </View>
                <Input
                  label='Number of Seats'
                  placeholder='#'
                  onChangeText={(text) => this.setState({text})}
                  leftIcon={<Icon
                    name='universal-access'
                    size={24}
                    color='black'
                  />}
                  leftIconContainerStyle={styles.leftIcon}
                />
                <Button onPress={this.toggleSearch} title='Submit'/>
              </View>
            </KeyboardAvoidingView>      
          </Modal>
        </View>
        {overlay}
      </View>
    );
  }
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  leftIcon: {
    paddingRight: 5
  },
  submitButton: {
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  searchButton: {
    backgroundColor: '#fff'
  },
  searchModalContainer: {
    backgroundColor:'#fff', 
    justifyContent: "flex-start", 
    paddingTop: 30, 
    marginBottom: 300,
    marginTop: 100
  },
  rentingModalContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: deviceWidth,
    height: deviceHeight,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rentingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 250
  }
});
