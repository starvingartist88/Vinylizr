import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  AsyncStorage
} from 'react-native'
import { Header } from '../components/common'
import { connect } from 'react-redux'
import { fetchWantlist } from '../actions/wantlist-action.js'
import _ from 'lodash'
import { NavigationActions } from 'react-navigation'
import axios from 'axios'


class Wantlist extends Component {
  constructor(props) {
    super(props)

    this.state = {userData: {}, records: [], refreshing: false}
  }

  static navigationOptions = ({screenProps}) => ({
    header: null,
    tabBarIcon: ({ tintColor }) => (tintColor == '#e91e63'
    ?
    <Image source={require('../img/wantlistIcon_select.png')} />
    :
    <Image source={require('../img/wantlistIcon.png')} />
    )
  })

componentWillMount() {

  value = AsyncStorage.multiGet(['oauth_token', 'oauth_secret']).then((values) => {
    const user_token = values[0][1]
    const user_secret = values[1][1]

      axios({method:'GET', url:`https://api.discogs.com/oauth/identity`,
      headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization':`OAuth oauth_consumer_key="jbUTpFhLTiyyHgLRoBgq",oauth_nonce="${Date.now()}",oauth_token="${user_token}",oauth_signature="LSQDaLpplgcCGlkzujkHyUkxImNlWVoI&${user_secret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`,
      'User-Agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
     }
    })
      .then((response) => {
        this.setState({userData:response.data})

    })
    .then((response) => {
      this.getUserWantlist()
    })
      .catch( (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
  })
}

getUserWantlist() {
  const { userData } = this.state
  value = AsyncStorage.multiGet(['oauth_token', 'oauth_secret']).then((values) => {
    const user_token = values[0][1]
    const user_secret = values[1][1]
    const user_name = userData.username

      axios({method:'GET', url:`https://api.discogs.com/users/${user_name}/wants`,
      headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization':`OAuth oauth_consumer_key="jbUTpFhLTiyyHgLRoBgq",oauth_nonce="${Date.now()}",oauth_token="${user_token}",oauth_signature="LSQDaLpplgcCGlkzujkHyUkxImNlWVoI&${user_secret}",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}"`,
      'User-Agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
     }
    })
    .then((response) => {
      // console.log(response, "WANTLIST RESPONSE")
      this.setState({ records: response.data.wants, refreshing: false })

  })


      .catch( (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
  })
}

handleRefresh = () => {
  this.setState(
    {
      page: 1,
      seed: this.state.seed + 1,
      refreshing: true
    },
    () => {
      this.getUserWantlist()
    }
  )
}
handleLoadMore = () => {
  this.setState(
    {
      page: this.state.page + 1
    },
    () => {
      this.getUserWantlist()
    }
  )
}
renderFooter = () => {
  if (!this.state.loading) return null
  return (
    <View
      style={{
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
      }}
    >
      <ActivityIndicator animating size="large" />
    </View>
  )
}


_keyExtractor = (item, index) => item.id + index





  render() {
    const { records, userData } = this.state
    return (
      <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
      <Header headerText={"Wantlist"} />
    </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={records}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={item.instance_id} onPress={() => {
            this.props.navigation.navigate('AlbumDetail', {
            item: item,
            inWantlist: true
           })
         }}>

            <Image
              style={styles.albumCovers}
              source={{ uri: item.basic_information.thumb }}
            />
            </TouchableOpacity>
          )
         }
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReachedThreshold={40}
          style={styles.textContainer}
          contentContainerStyle={styles.contentContainerStyle}

        />
        </View>
      </View>
    )
  }
  }
  const styles = {
    textContainer: {
      flexDirection: 'column',
      paddingBottom: 50,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: '#000',

    },
    contentContainerStyle: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',


    },
    mainContainer: {
      flex: 1,
    },
    albumCovers: {
      height: 124,
      width: 124,
      marginLeft: .5,
      marginRight: .5,
      marginTop: .5,
      marginBottom: .5
    }
  }

const mapStateToProps = (state) => {
    return {
      ...state,
    }
}
// for click events so that dispatches can happen
const mapDispatchToProps = (dispatch) => {
    return {
        fetchWantlist: () => {
            dispatch(fetchWantlist())
        },

      }
    }



export default connect(mapStateToProps, mapDispatchToProps)(Wantlist)
