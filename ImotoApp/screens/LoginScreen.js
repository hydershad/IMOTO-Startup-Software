import React from 'react'; 

import { Alert, Text, Button, ScrollView, View, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

export default class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: 'Brendan',
			password: '',
			isModalVisible: false,
			name: '',
			dob: '',
			license: '',
			cardNumber: '',
			expiryDate: '',
			ccv: '',
			billingAddress: '',
			text: ''
		}
		this.toggleModal.bind(this);
	}

	login = () => {
		/*
		fetch('https://us-central1-senior-design-230918.cloudfunctions.net/verify_login', {
			method: 'POST',
			headers: {
			  Accept: 'application/json',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  email: this.state.email,
			  password: this.state.password
			}),
			})
			.then((response) => response.text())
			.then((responseJson) => {
				if(responseJson == 'True') {
					this.props.navigation.navigate('Main', {
						user: this.state.email
					});
				} else {
					this.setState({text: 'Invalid email/password'})
				}
			})
			.catch((error) => {
				console.error(error);
			});
		*/
		
		this.props.navigation.navigate('Main', {
			user: this.state.email
		});
		
		/*
		fetch('https://us-central1-senior-design-230918.cloudfunctions.net/get_cars_renter', {
				method: 'GET'
			})
			.then((response) => response.text())
			.then((responseJson) => {
				this.setState({text: responseJson})
			})
			.catch((error) => {
				console.error(error);
			});
		*/ 
		/*
		fetch('https://us-central1-senior-design-230918.cloudfunctions.net/test_sms', {
				method: 'GET'
			})
			.then((response) => response.text())
			.then((responseJson) => {
				this.setState({text: responseJson})
			})
			.catch((error) => {
				console.error(error);
			});
		*/
	}

	toggleModal = () => {
		this.setState({
			isModalVisible: !this.state.isModalVisible
		})
	}

	createAccount = () => {
		fetch('https://us-central1-senior-design-230918.cloudfunctions.net/create_user', {
			method: 'POST',
			headers: {
			  Accept: 'application/json',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  email: this.state.email,
			  password: this.state.password,
			  name: this.state.name,
			  dob: this.state.dob,
			  license: this.state.license,
			  cardnum: this.state.cardNumber,
			  cardexpiry: this.state.expiryDate,
			  ccv: this.state.ccv,
			  address: this.state.billingAddress
			}),
			})
			.then((response) => response.text())
			.then((response) => {
				if(response == this.state.email) {
					this.props.navigation.navigate('Main', {
						user: this.state.email
					});
				} else {
					this.setState({text: 'Failed to create account. ' + response})
				}
			})
			.catch((error) => {
				this.setState({text: 'failure'})
				console.error(error);
			}
		);
		
		/*
		fetch('https://us-central1-senior-design-230918.cloudfunctions.net/create_user', {
			method: 'POST',
			headers: {
			  Accept: 'application/json',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  email: 'b@gmail.com',
			  password: 'thisisbrendan',
			  name: 'Aravind',
			  dob: '12/25/1997',
			  license: '78623574',
			  cardnum: '92837492735',
			  cardexpiry: '12/2019',
			  ccv: '123',
			  address: '1 Hacker Way'
			}),
			})
			.then((response) => response.text())
			.then((responseJson) => {
				this.setState({text: responseJson})
			})
			.catch((error) => {
				this.setState({text: 'failure'})
				console.error(error);
			}
		);
		*/
		this.toggleModal();
		/*
		this.props.navigation.navigate('Main', {
			user: this.state.email
		});
		*/
	}

	render() {
		return(
			<KeyboardAvoidingView behavior="padding" style={styles.container}>
				<View style={styles.viewContainer}>
					<Text style={styles.logo}>Imoto</Text>
				</View>
				<View style={styles.loginContainer}>
					<Input 
					containerStyle={styles.input}
					placeholder='Email' 
					onChangeText={(text) => this.setState({email: text})}
					leftIcon={<Icon
			            name='envelope'
			            size={24}
			            color='black'
			          />}
			        leftIconContainerStyle={styles.leftIcon}
					/>
					<Input 
						containerStyle={styles.input}
						password={true}
						secureTextEntry={true}
						placeholder='Password' 
						onChangeText={(text) => this.setState({password: text})}
						leftIcon={<Icon
				            name='lock'
				            size={24}
				            color='black'
				          />}
				        leftIconContainerStyle={styles.leftIcon}
				        underlineColorAndroid="transparent"
					/>
					<TouchableOpacity style={styles.buttonContainer} 
					                     onPress={this.login.bind(this)}>
					             <Text style={styles.buttonText}>LOGIN</Text>
					</TouchableOpacity> 
					<Button onPress={this.toggleModal} title='Create New Account'/>
					<ScrollView>
						<Text>{this.state.text}</Text>
					</ScrollView>
				</View>
				<Modal style={styles.modalContainer} isVisible={this.state.isModalVisible} backdropOpacity={0.5} backgroundColor='#2c3e50'>
					<KeyboardAvoidingView behavior="position">
						<View>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Name'
								onChangeText={(text) => this.setState({name: text})}
								leftIcon={<Icon
						            name='user'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Email'
								onChangeText={(text) => this.setState({email: text})}
								leftIcon={<Icon
						            name='envelope'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Password'
								onChangeText={(text) => this.setState({password: text})}
								leftIcon={<Icon
						            name='lock'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Date of Birth (MM/DD/YYYY)'
								onChangeText={(text) => this.setState({dob: text})}
								leftIcon={<Icon
						            name='birthday-cake'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Drivers License Number'
								onChangeText={(text) => this.setState({license: text})}
								leftIcon={<Icon
						            name='id-card'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Credit/Debt Card Number'
								onChangeText={(text) => this.setState({cardNumber: text})}
								leftIcon={<Icon
						            name='credit-card'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<View style={{flexDirection:"row"}}>
			                    <View style={{flex:1}}>
			                        <Input 
			                        	placeholder="Expiry Date" 
			                        	containerStyle={styles.smallInput1} 
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
			                        	placeholder="CVV" 
			                        	containerStyle={styles.smallInput2} 
			                        	onChangeText={(text) => this.setState({ccv: text})}
			                        	leftIcon={<Icon
								            name='shield'
								            size={24}
								            color='black'
								          />}
								         leftIconContainerStyle={styles.leftIcon}
			                        />
			                    </View>
			                </View>
							<Input 
								containerStyle={styles.smallInput}
								placeholder='Billing Address'
								onChangeText={(text) => this.setState({billingAddress: text})}
								leftIcon={<Icon
						            name='map-pin'
						            size={24}
						            color='black'
						          />}
						         leftIconContainerStyle={styles.leftIcon}
							/>
							<Button onPress={this.createAccount.bind(this)} title='Submit'/>
						</View>
					</KeyboardAvoidingView>
				</Modal>
			</KeyboardAvoidingView>
		)
	}
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#2c3e50',
    padding: 20
  },
  input: {
	height: 40,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  smallInput: {
  	height: 40,
    backgroundColor: '#fff',
    marginBottom: 5
  },
  smallInput1: {
  	height: 40,
    backgroundColor: '#fff',
    marginBottom: 5,
    justifyContent: 'flex-start'
  },
  smallInput2: {
  	height: 40,
    backgroundColor: '#fff',
    marginBottom: 5,
    justifyContent: 'flex-end'
  },
  viewContainer: {
  	flexGrow: 1,
  	alignItems: 'center'
  },
  loginContainer: {
  	flex: 1
  },
  buttonContainer:{
    backgroundColor: '#2980b6',
    paddingVertical: 15,
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
},
  logo: {
	fontSize: 100,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FF8C00',
    position: 'absolute',
    paddingTop: 50
	},
  leftIcon: {
    width: 40,
    marginLeft: 0,
    paddingLeft: 0
  },
  modalContainer: {
  	paddingLeft: 10, 
  	paddingRight: 10,
  }
});
