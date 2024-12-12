package com.example.trackdrive3;
import com.getcapacitor.BridgeActivity;
//public class MainActivity extends BridgeActivity {}

import android.os.Bundle;
//import com.getcapacitor.BridgeActivity;
import android.webkit.WebView;
import android.webkit.WebSettings;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Permitir Mixed Content
    WebView webView = (WebView) this.bridge.getWebView();
    webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
  }
}
