/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  BackHandler,
} from 'react-native';
import WebView from 'react-native-webview';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-4930979189383386/6616547497';

const adUnitIdBanner = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-4930979189383386/3432815105';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const App = () => {
  const [visible, setVisible] = useState(false);
  // const [loaded, setLoaded] = useState(false);
  const COUNT = 20;
  const [countLoaded, setCountLoaded] = useState(COUNT);

  const webviewRef = React.useRef();

  useEffect(() => {
    // Handle back
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        webviewRef.current.goBack();
        return true;
      },
    );

    // show admob
    if (countLoaded <= 0) {
      interstitial.load();
      interstitial.show().catch((error) => {
        console.log(error);
      });
      setCountLoaded(COUNT);
    }

    // Unsubscribe from events on unmount
    return () => {
      backHandler.remove();
    };
  }, [countLoaded]);

  // No advert ready to show yet
  // if (!loaded) {
  //   return null;
  // }
  return (
    <>
      <StatusBar barStyle="default" backgroundColor="#073770" />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <WebView
            onTouchEnd={() => {
              setCountLoaded(countLoaded - 1);
              console.log(countLoaded);
            }}
            ref={webviewRef}
            // style={styles.WebViewStyle}
            //Loading URL
            source={{uri: 'https://sia.uty.ac.id/std'}}
            //Enable Javascript support
            javaScriptEnabled={true}
            //For the Cache
            cacheEnabled
            pagingEnabled
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            //Want to show the view or not
            // startInLoadingState={true}
            onLoadStart={() => setVisible(true)}
            onLoad={() => setVisible(false)}
          />
          <BannerAd
            unitId={adUnitIdBanner}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
          {visible ? <ActivityIndicatorElement /> : null}
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;

const ActivityIndicatorElement = () => {
  //making a view to show to while loading the webpage
  return (
    <ActivityIndicator
      color="#009688"
      size="large"
      style={styles.activityIndicatorStyle}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
  activityIndicatorStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
