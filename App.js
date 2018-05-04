/**
 * Simple app displaying the DALI members
 * @author Alan Lu
 */

import React, {Component} from 'react';
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

import {List, ListItem} from 'react-native-elements';

export const Feeds = Get('http://mappy.dali.dartmouth.edu/members.json');

function Get(url) {
  return fetch(url).then(response => {
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) { // JSON file
      // convert to JSON
      return response.json().catch(error => Promise.reject(`ResponseError: ${error.message}`))
    } else if (contentType.includes('image')) { // image file
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
  }

  componentDidMount() {
    this.fetchFeeds();
  }

  ListViewItemSeparator = () => {
    return (<View style={{
        height: .5,
        width: "100%",
        backgroundColor: "#000"
      }}/>);
  }

  /*
  * Downloads the JSON file containing all the members from the DALI server
  */
  fetchFeeds() {
    Feeds.then(res => {
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({isLoading: false, feeds: ds.cloneWithRows(res)});
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
    } else { // internal URL, prepend the DALI URL
      finalUrl = "http://mappy.dali.dartmouth.edu/" + url;
    }
    return finalUrl;
  }

  /*
  *  For either projects or terms on, return a comma-separated string
  */
  parseArray(array) {
    finalString = ""; // return a comma-separated string from the array
    if (array.length == 0)
      return "N/A";
    for (var i = 0; i < array.length; i++) {
      finalString += (
        i == 0
        ? ""
        : ", ") + array[i];
    }
    return finalString;
  }

  render() {
    if (this.state.isLoading) { // if we're still downloading the JSON
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

           <View style={{paddingTop: 10, paddingBottom: 10}} >
             <Text style={styles.sectionTitle} >Name: <Text style={styles.textViewContainer}>{rowData.name}</Text></Text>
             <Text style={styles.sectionTitle} >URL: <Text style={styles.textViewContainer}>{this.parseURL(rowData.url)}</Text></Text>
             <Text style={styles.sectionTitle} >Message: <Text style={styles.textViewContainer}>{rowData.message}</Text></Text>
             <Text style={styles.sectionTitle} >Projects: <Text style={styles.textViewContainer}>{this.parseArray(rowData.project)}</Text></Text>
             <Text style={styles.sectionTitle} >Terms on: <Text style={styles.textViewContainer}>{this.parseArray(rowData.terms_on)}</Text></Text>
           </View>

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
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  sectionTitle: {
    paddingLeft: 10,
    color: '#000000'
  },
  textViewContainer: {
    fontWeight: 'normal',
    color: '#56595b'
  }
});
