package com.nayan.garassociates;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

// Intent service = new Intent(getApplicationContext(), MyTaskService.class);
// Bundle bundle = new Bundle();

// bundle.putString("foo", "bar");
// service.putExtras(bundle);



  @Override
  protected String getMainComponentName() {
    // getApplicationContext().startService(service);
    return "GarAssociates";
  }
}
