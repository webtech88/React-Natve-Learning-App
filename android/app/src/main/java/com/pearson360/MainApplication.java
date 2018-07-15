package com.pearson360;

import android.app.Application;

import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.common.logging.FLog;
import com.facebook.react.ReactApplication;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.BV.LinearGradient.LinearGradientPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.smixx.fabric.FabricPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

import io.intercom.android.sdk.Intercom;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeYouTube(),
            new LinearGradientPackage(),
            new ReactNativeConfigPackage(),
            new FabricPackage(),
            new ReactVideoPackage(),
            new RNFetchBlobPackage(),
            new IntercomPackage(),
            new RNDeviceInfo(),
            new FBSDKPackage(mCallbackManager),
            new ReactNativePermissionsPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new SvgPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics.Builder().core(new CrashlyticsCore.Builder().disabled(BuildConfig.DEBUG).build()).build());
    FLog.setLoggingDelegate(ReactNativeFabricLogger.getInstance());
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
    Intercom.initialize(this, BuildConfig.INTERCOM_API_KEY_ANDROID, BuildConfig.INTERCOM_APP_ID);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
