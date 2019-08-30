import React from 'react';
import { ScrollView, StyleSheet, Button, Alert, Modal, View, Text, TouchableHighlight, FlatList, DatePickerIOS, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Input, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function onButtonPress() {
    Alert.alert('on Press!')
}

/* TODO: change to pull list of reservations */


export default class ReservationsScreen extends React.Component {

    constructor() {
      super();
      this.state = {
        isOpen: false,
        text: "",
        index: 0,
        newCarPlate: "",
        newCarMake: "",
        newCarModel: "",
        newCarColor: "",
        newCarYear: "",
        newCarPassengers: "",
        chosenCar: {},
        startDate: new Date(),
        startTime: "",
        endDate: new Date(),
        endTime: "",
      }
    }

    toggle = () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }

    renderScreen = () => {
      if(!this.state.isOpen) {
        if (this.state.index == 0){
          return this.renderReservationsListScreen();
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

    submitCarPosting = () => {

    }

    renderPostCarScreen = () => {
      var car = this.state.chosenCar;
      return (
        <View>
          <Button onPress={this.postCarListScreen.bind(this)} title='Back'/>
          <Text style={{fontSize: 20}}>This is your {car.make} {car.model} with plate number {car.plate}</Text>
          {/*
          <DatePickerIOS date={this.state.startDate} onDateChange={this.setStartDate}/>
          */}
          <Input
            label='Start Date'
            onChangeText={(text) => this.setState({startDate: text})}
            placeholder='01/31/2000'
            leftIcon={<Icon
              name='calendar'
              size={24}
              color='black'
            />}
            leftIconContainerStyle={styles.leftIcon}
          />
          <Input
            label='Start Time'
            placeholder="12:00"
            onChangeText={(text) => this.setState({startTime: text})}
            leftIcon={<Icon
              name='clock-o'
              size={24}
              color='black'
            />}
           leftIconContainerStyle={styles.leftIcon}
          />
          <Input
            label='End Date'
            onChangeText={(text) => this.setState({endDate: text})}
            placeholder='01/31/2000'
            leftIcon={<Icon
              name='calendar'
              size={24}
              color='black'
            />}
            leftIconContainerStyle={styles.leftIcon}
          />
          <Input
            label='End Time'
            placeholder="12:00"
            onChangeText={(text) => this.setState({endTime: text})}
            leftIcon={<Icon
              name='clock-o'
              size={24}
              color='black'
            />}
           leftIconContainerStyle={styles.leftIcon}
          />
          <Button onPress={this.submitCarPosting.bind(this)} title='Submit' />
        </View>
      )
    }

    renderSeparator = () => {
      return (
        <View
          style={{
            height: 2,
            //width: "86%",
            backgroundColor: "#CED0CE",
            //marginLeft: "14%"
          }}
        />
      );
    };

    renderHeader = () => {
      return (
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          My Cars:
        </Text>
      )
    }

    renderReservationsListScreen = () => {
      return (
        <View>
          <FlatList
            data = {[
              {plate: 'ABC123', make: 'Toyota', model: 'Corolla'},
              {plate: 'XYZ456', make: 'Honda', model: 'Accord'},
            ]}
            keyExtractor={item => item.plate}
            renderItem = {
              ({item}) =>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.postCarScreen.bind(this, item)}
                >
                  <Text
                    style={{fontSize: 15}}
                  >
                    {item.plate}
                  </Text>
                </TouchableOpacity>

            }
            containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
        )
    }

    updateIndex = (selectedIndex) => {
      this.setState({index: selectedIndex})
    }

    createNewCar = () => {

    }

    renderInputScreen = () => {
      return (
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
        </View>
        )
    }

    static navigationOptions = {
      title: 'Reservations',
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
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10
  }
});
