import React, { Component } from 'react'
import { Text, View, Linking } from 'react-native'
import axios from 'axios'
import DeepLinking from 'react-native-deep-linking'

import {
  Button,
  CardSection,
  Spinner,
  Logo,
  AsyncStorage
} from './common'


class LoginForm extends Component {
  constructor(props) {
    super(props)


      this.getToken = this.getToken.bind(this)
  }

  static navigationOptions = () => ({
    drawerLabel: 'LoginForm',
    header: null,
    cardStyle: {
      backgroundColor: '#000000'
    },
  });


  componentWillMount() {
    getToken = this.getToken()
    if (getToken === null || getToken === undefined) {
    console.log("NO TOKEN YOU HAVE BEEN LOGGED OUT ");
       this.props.loggedOut
    } else {
      console.log("you are LOGGED IN FROM THE LOGIN FORM MY FRIEND: ");
       this.props.loggedIn()
    }



  }

  getToken() {
    if(this.props.isLoggedIn) {
    AsyncStorage.getItem('oauth_token').then((result) => {
      console.log(result) //Display key value
      if (result === null || result === undefined) {
        return null
      }
      if (result) {
        return result
      }

    }).catch((error) => {
      console.log(error, "NOT WORKING FOR GETITING TOKENS")
    })
  } else {
    console.log("not Logged In");
  }
  }




discogsRedirect = () => {
  const { access_token } = this.props
  Linking.openURL(`https://discogs.com/oauth/authorize?oauth_token=${access_token}`)

}


  render() {
    return (
      <View
        style={styles.sectionContainer}>

      <View style={styles.containerLogo}>
        <Logo />
      </View>


        <CardSection>
        <Button
          style={styles.buttonSection} onPress={this.discogsRedirect}>
          Log in
        </Button>
        </CardSection>

      </View>
    );
  }
}

const styles = {
  sectionContainer: {
    flex: 1,
    backgroundColor: '#000000'
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  form: {
    flex: 1,
  },

  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  sectionContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'column',
    marginTop: 45,
    backgroundColor: '#000000'


  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
  },
  forgotTextStyle: {
    color: 'white',
    alignSelf: 'flex-end',
    bottom: 25

  },
  createButton: {
    flex:1,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    height: 20,
  },
  buttonSection: {
    marginTop: 25
  },
  TextInputStyle: {
    color: '#fff',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 7,
    height: 40,
    marginTop: 40
  },
  textInputContainerStyle: {
    flexDirection: 'column',

  }
  };

export default LoginForm;
