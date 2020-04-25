import React, {
  Component
} from "react";
import { View, Text } from "react-native";
import * as colors from "../styles/colors";
import { MediaQueryStyleSheet } from "react-native-responsive";

import TcpSocket from 'react-native-tcp-socket';

export default class NetworkClient extends Component {

  constructor(props) {
    super(props);

    this.state={
      ping: 0,
      status: "Init network"
    }

  }

  render() {
    if (this.state.status !== "ok") {
      return ( <View style = {styles.infoContainer} ><Text style = {styles.infoErrorText}> {this.state.status} </Text></View>
      );
    } else if (this.state.ping > 0 && this.state.ping < 5000) {
      return ( <View style = {styles.infoContainer}><Text style = {styles.infoText} > {this.state.ping} </Text></View>
      );
    } else {
      return ( <View style = {styles.infoContainer} ><Text style = {styles.infoErrorText} > XXXX < /Text></View>);
    }
  }

  componentDidMount() {
    if (this.props.client !== null) {
      this.connectToNetwork();
    }
  }

  componentWillUnmount() {
    if (this.props.client !== null) {
      this.props.client.destroy();
    }
  }

  connectToNetwork() {
    this.setState({status : "connecting..."});

    this.props.client = TcpSocket.createConnection({
      port: 6543,
      host: "aitvt.com",
      //tls: true,
      // tlsCheckValidity: false, // Disable validity checking
      // tlsCert: require('./selfmade.pem') // Self-signed certificate
    });

    this.props.client.on('data', function(data){
      this.setState({status : "ok"});
      this.setState({ping : 1});
      console.log("Message received", data);
    });

    this.props.client.on('error', function(error){
      this.setState({status : "error"});
      console.log("Network error", error);
    });

    this.props.client.on('close', function(){
      this.setState({status : "close"});
      console.log("Connection close");
      this.props.client.distroy();
      this.props.client = null;
    });

    this.props.client.write('P1X');

  }
}

const styles = MediaQueryStyleSheet.create(
    // Base styles
    {

      infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 5
      },

      infoStyle: {
        width: 45
      },

      infoText: {
        textAlign: "center",
        color: colors.white,
        fontFamily: "Roboto-Medium",
        fontSize: 15
      },

      infoErrorText: {
        textAlign: "center",
        color: colors.red,
        fontFamily: "Roboto-Medium",
        fontSize: 15
      }
    });
