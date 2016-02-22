package com.lugagi;

import com.facebook.react.ReactActivity;
<<<<<<< HEAD
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
=======
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
>>>>>>> 73eb77b1d49778205431b97ad4bfa5214ce669fb
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Lugagi";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

   /**
   * A list of packages used by the app. If the app uses additional views
   * or modules besides the default ones, add more packages here.
   */
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
<<<<<<< HEAD
        new VectorIconsPackage(),
        new ImagePickerPackage()
=======
        new ImagePickerPackage(),
        new VectorIconsPackage()
>>>>>>> 73eb77b1d49778205431b97ad4bfa5214ce669fb
      );
    }
}
