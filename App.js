/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';

import { List, ListItem } from 'react-native-elements';


var ajaxGet = function (url, callback) {
    var callback = (typeof callback == 'function' ? callback : false), xhr = null;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    if (!xhr)
           return null;
    xhr.open("GET", url,true);
    xhr.onreadystatechange=function() {
      if (xhr.readyState==4 && callback) {
        callback(xhr.responseText)
      }
    }
    xhr.send(null);
    return xhr;
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu test',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu asdf',
});

export const Feeds = Get('http://mappy.dali.dartmouth.edu/members.json');

function Get(url) {
  return fetch(url)
  .then(response => {
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) { // JSON file
      // convert to JSON
      return response.json().catch(error => Promise.reject(`ResponseError: ${error.message}`))
    }
    else if (contentType.includes('image')) { // image file
    }

  }).catch(error => Promise.reject(`NetworkError: ${error.message}`));
}


type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
      feeds: [],
      isLoading: true
    }

    this.fetchFeeds = this.fetchFeeds.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
  }


  componentDidMount() {
    this.fetchFeeds();
  }

  ListViewItemSeparator = () => {
  return (
    <View
      style={{

        height: .5,
        width: "100%",
        backgroundColor: "#000",

      }}
    />
  );
}

  fetchFeeds() {
    Feeds.then(res => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        isLoading: false,
        feeds: ds.cloneWithRows(res)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  /*
  * Parse the URL depending on if it's internal or external
  */
  parseURL(url) {
    finalUrl = "";
    if (url.startsWith("//")) { // outside URL, prepend http:
       finalUrl = "http:" + url;
    }
    else { // internal URL, prepend the DALI URL
      finalUrl = "http://mappy.dali.dartmouth.edu/" + url;
    }
    return finalUrl;
  }

  /*
  *  For either projects or terms on, return a comma-separated string
  */
  parseArray(array) {
    finalString = ""; // return a comma-separated string from the array
    if (array.length == 0) return "N/A";
    for (var i = 0; i < array.length; i++) {
        finalString += (i == 0 ? "" : ", ") + array[i];
    }
    return finalString;
  }

  render() {
    if (this.state.isLoading) { // if we're still downloading the JSON
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>DALI Members</Text>
        <ListView
          dataSource={this.state.feeds}
          renderSeparator={this.ListViewItemSeparator}
          renderRow={(rowData) =>
         <View style={{flex:1, flexDirection: 'column'}} >

           <View style={{
                 justifyContent: 'center',
                 alignItems: 'center',
                 paddingTop: 10
               }}>
             <Image
               style={{width: 150, height: 150}}
               source={{uri: this.parseURL(rowData.iconUrl)}}
             />
           </View>

           <Text style={styles.textViewContainer} >{'Name: ' + rowData.name}</Text>
           <Text style={styles.textViewContainer} >{'URL: ' + this.parseURL(rowData.url)}</Text>
           <Text style={styles.textViewContainer} >{'Message: ' + rowData.message}</Text>
           <Text style={styles.textViewContainer} >{'Projects: ' + this.parseArray(rowData.project)}</Text>
           <Text style={{paddingLeft: 20, paddingBottom: 10}} >{'Terms on: ' + this.parseArray(rowData.terms_on)}</Text>
           
         </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textViewContainer: {
    paddingLeft: 20,
  },
});
