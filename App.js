/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import resolveAssetSource from 'resolveAssetSource';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const optionsCamera = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

let {height, width} = Dimensions.get('window');

type Props = {};

let imageRes = {
  width: 0,
  height: 0
};

let resizedRes = {
  width: 0,
  height: 0
};

export default class App extends Component<Props> {
  constructor(){
    super();
    this.state = {
      mode: "default",
      avatarSource: null,
      frameSelection: 0,
      frameSelect: {
        url: null,
        type: "uri",
        contentWidth: 0,
        contentHeight: 0,
        marginHorizontal: 0,
        marginVertical: 0
      },
      resizedRes: resizedRes,
      showFrame: false,
      screen: 1
    }
  }

  showPicker(){
    var el = this;
    ImagePicker.showImagePicker(optionsCamera, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };

        // You can also display the image using data:
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        el.setState({
          avatarSource: source,
          // imageRes: {
          //   data: response,
          //   width: response.width,
          //   height: response.height
          // }
        });

        el.showImage(source.uri);
      }
    });
  }

  toggleFrame(){
    this.setState({
      showFrame: !this.state.showFrame
    })
  }

  convertPixelCm(px){
    return (px * 2.54 /96).toFixed(2);
  }

  selectFrame(selection){
    var frameSelect = null;
    var oriwidth = 412;
    var oriheight = 732;
    var el = this;

    switch(selection){
      case 1:
        frameSelect = {
          url: require('./assets/1.png'),
          type: "static",
          // marginHorizontal: 38,
          // marginVertical: 59
          contentWidth: 0,
          contentHeight: 0,
          marginHorizontal: 30,
          marginVertical: 30
        }
        break;
      case 2:
        frameSelect = {
          url: require('./assets/2.png'),
          type: "static",
          // marginHorizontal: 33,
          // marginVertical: 50
          contentWidth: 0,
          contentHeight: 0,
          marginHorizontal: 25,
          marginVertical: 25
        }
        break;
      case 3:
        frameSelect = {
          url: require('./assets/3.png'),
          type: "static",
          // marginHorizontal: 33,
          // marginVertical: 50
          contentWidth: 0,
          contentHeight: 0,
          marginHorizontal: 25,
          marginVertical: 25
        }
        break;
      default:
        frameSelect = {
          url: null,
          type: "uri",
          contentWidth: (el.state.resizedRes.width) ? el.state.resizedRes.width : 0,
          contentHeight: (el.state.resizedRes.height) ? el.state.resizedRes.height : 0,
          marginHorizontal: 0,
          marginVertical: 0
        }
        break;
    }

    var el = this;
    this.setState({
      frameSelection: selection,
      frameSelect: frameSelect
    }, function(){
      el.getFrameDetail(frameSelect.url);
    });
    // el.getFrameDetail(frameSelect.url);

  }

  async getFrameDetail(uri){
    // search for content container & margins
    var el = this;
    if(uri){

      if(el.state.frameSelect.type == "uri"){
        await Image.getSize(uri, (swidth, sheight) => {
          // var Vratio  = parseFloat(el.state.frameSelect.marginVertical) / parseFloat(sheight) * 100;
          // var Hratio  = parseFloat(el.state.frameSelect.marginHorizontal) / parseFloat(swidth) * 100;

          // var contentHeightRatio = 100-Vratio;
          // var contentWidthRatio = 100-Hratio;

          // var frameSelect = {
          //   url: uri,
          //   contentWidth: el.state.resizedRes.width*contentWidthRatio/100,
          //   contentHeight: el.state.resizedRes.height*contentHeightRatio/100,
          //   marginHorizontal: el.state.frameSelect.marginHorizontal,
          //   marginVertical: el.state.frameSelect.marginVertical
          // };

          // console.log(uri);

          // el.setState({
          //   frameSelect: frameSelect
          // });
        });
      }else{
        console.log("frame width:"+ parseFloat(resolveAssetSource(uri).width));
        console.log("frame height:"+parseFloat(resolveAssetSource(uri).height));

        var Vratio  = parseFloat(el.state.frameSelect.marginVertical) / parseFloat(resolveAssetSource(uri).height) * 100;
        var Hratio  = parseFloat(el.state.frameSelect.marginHorizontal) / parseFloat(resolveAssetSource(uri).width) * 100;

        var contentWidthRatio = (100-(Hratio*2));
        var contentHeightRatio = (100-(Vratio*2));

        if(uri){
          var frameSelect = {
            url: uri,
            contentWidth: el.state.resizedRes.width*contentWidthRatio/100,
            contentHeight: el.state.resizedRes.height*contentHeightRatio/100,
            marginHorizontal: Hratio+"%",
            marginVertical: Vratio+"%"
          };
        }

        console.log(frameSelect);

        el.setState({
          frameSelect: frameSelect
        });
      }
    }
    // else{
    //   var frameSelect = {
    //     url: uri,
    //     contentWidth: resolveAssetSource(uri).width,
    //     contentHeight: resolveAssetSource(uri).height,
    //     marginHorizontal: 0,
    //     marginVertical: 0
    //   };
    // }
  }

  async showImage(uri){
    var imageWidth;
    var imageHeight;
    var heightScreen = height - 80;
    var widthScreen = width;

    var el = this;

    var obj = {
      width: 0,
      height: 0
    }
    
    if(uri){
      await Image.getSize(uri, (swidth, sheight) => {

        // get ratio
        var vRatio = swidth / sheight;
        var hRatio = sheight / swidth;
        var ratio  = Math.min ( hRatio, vRatio );

        if(swidth > widthScreen && swidth > sheight){
          imageWidth = widthScreen;
          imageHeight = widthScreen * ratio;
        }else if(sheight > heightScreen && sheight > swidth){
          imageWidth = heightScreen * ratio;
          imageHeight = heightScreen;
        }else{
          imageWidth = swidth;
          imageHeight = sheight;
        }

        obj = {
          width: imageWidth,
          height: imageHeight
        }

        resizedRes = obj;
        imageRes = {
          width: swidth,
          height: sheight
        };

        el.setState({
          resizedRes: resizedRes
        }, function(){
          el.selectFrame(el.state.frameSelection);
        });

        // return obj;
      });
    }
  }

  _renderActions(){
    return(
      <View style={{ position: "absolute", zIndex: 999, bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderTopColor: "black", backgroundColor: "#fff" }}>
        <TouchableOpacity onPress={() => this.toggleFrame()}>
          <Text style={{ margin: 20, textDecorationLine: "underline" }}>Select Frame</Text>
        </TouchableOpacity>

        <View style={{ position: "absolute", right: 10, top: 10, flex: 1, flexDirection: "row" }}>
          <Text style={{ padding: 10, fontSize: 10, textAlign: "right" }}>
            {imageRes.width} x {imageRes.height}{"\n"}
            {this.convertPixelCm(imageRes.width)}cm x {this.convertPixelCm(imageRes.height)}cm
          </Text>
          <TouchableOpacity onPress={() => this.showPicker()} style={{ backgroundColor: "black", padding: 10 }}>
            <Text style={{ color: "#fff" }}>Select Photo</Text>
          </TouchableOpacity>
        </View>

        {(this.state.showFrame &&
          <View style={{ flex: 1, flexDirection: "row", padding: 20 }}>
            <TouchableOpacity onPress={() => this.selectFrame(0)} style={{ margin: 20, marginLeft: 0 }}>
              <Text>No Frame</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectFrame(1)}>
              <Image source={require('./assets/1.png')} style={styles.imageFrame} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectFrame(2)}>
              <Image source={require('./assets/2.png')} style={styles.imageFrame} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectFrame(3)}>
              <Image source={require('./assets/3.png')} style={styles.imageFrame} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  _renderDefault(){
    var heightScreen = height - 80;
    return (
      <View style={{ flex: 1 }}>

        <View style={{ ...styles.container, flex: 0, height: heightScreen}}>
          <ImageBackground source={this.state.frameSelect.url} style={{ height: heightScreen, width: this.state.resizedRes.width, height: this.state.resizedRes.height }} imageStyle={{ resizeMode: "stretch" }}>
            <Image source={this.state.avatarSource} style={{ resizeMode: "cover", width: this.state.frameSelect.contentWidth, height: this.state.frameSelect.contentHeight, left: this.state.frameSelect.marginHorizontal, top: this.state.frameSelect.marginVertical }} />
          </ImageBackground>
        </View>
        
        <TouchableOpacity onPress={() => alert('To be implemented')} style={{ backgroundColor: "black", padding: 8, position: "absolute", top: 10, right: 10, zIndex: 99, borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontSize: 10 }}>Checkout ></Text>
        </TouchableOpacity>

        {this._renderActions()}
      </View>
    );
  }

  _renderAfterPick(){
    var heightScreen = height - 80;
    
    return(
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.container, height: heightScreen, width: width, flex: 0}}>
          
        </View>
      </View>
    )
  }

  _renderAR(){
    return true;
  }

  render() {
    switch(this.state.screen){
      case 1:
      return this._renderDefault();
      break;

      case 2:
      return this._renderAfterPick();
      break;
    }
  }
}

const styles = StyleSheet.create({
  imageFrame: {
    flex: 1,
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
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
});
