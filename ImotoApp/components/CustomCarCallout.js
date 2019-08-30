import React from 'react';
import { View, Button, Text } from 'react-native'

export default class CustomCarCallout extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {

		let car = this.props.car;

		return(
			<View>
				<Text>{car['year']} {car['make']} {car['model']}</Text>
				<Text>Available Until: {car['end_time']}</Text>
				<Text>License Plate: {car['license_plate']}</Text>
				<Text>Hourly: ${car['hourly_rate']}, Daily: ${car['daily_rate']}</Text>
				<Button onPress={() => this.props.rentCar(this.props.car)} title='Rent'/>
			</View>
		)
	}
}