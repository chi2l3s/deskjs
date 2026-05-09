import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runCommand } from "@deskjs/platform-web/command";

export interface AndroidConfig {
  appId: string;
  name: string;
  packageName?: string;
  minSdk?: number;
}

export interface AndroidOptions {
  root: string;
  webDir: string;
  config: AndroidConfig;
}

function createActivity(packageName: string) {
  return `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
  private WebView webView;

  @Override
  protected void onCreate(Bundle state) {
    super.onCreate(state);
    webView = new WebView(this);
    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setMediaPlaybackRequiresUserGesture(false);
    webView.loadUrl("file:///android_asset/www/index.html");
    setContentView(webView);
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    return webView.dispatchKeyEvent(event) || super.dispatchKeyEvent(event);
  }
}
`;
}

function createManifest(packageName: string, name: string) {
  return `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET" />
  <application android:theme="@style/AppTheme" android:label="${name}" android:usesCleartextTraffic="true">
    <activity android:name=".MainActivity" android:configChanges="keyboard|keyboardHidden|navigation|orientation|screenSize" android:exported="true">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>
`;
}

function createBuild(packageName: string, minSdk: number) {
  return `plugins {
    id 'com.android.application' version '8.13.0' apply false
}

subprojects {
    afterEvaluate {
        if (plugins.hasPlugin('com.android.application')) {
            android {
                namespace '${packageName}'
                compileSdk 36
                defaultConfig {
                    applicationId '${packageName}'
                    minSdk ${minSdk}
                    targetSdk 36
                    versionCode 1
                    versionName '1.0'
                }
            }
        }
    }
}
`;
}

function createAppBuild() {
  return `plugins {
    id 'com.android.application'
}
`;
}

function writeAndroidFiles(outDir: string, config: Required<AndroidConfig>) {
  const packageName = config.packageName;
  const sourceDir = join(outDir, "app", "src", "main", "java", ...packageName.split("."));
  mkdirSync(join(outDir, "app", "src", "main", "assets", "www"), { recursive: true });
  mkdirSync(join(outDir, "app", "src", "main", "res", "values"), { recursive: true });
  mkdirSync(sourceDir, { recursive: true });
  writeFileSync(
    join(outDir, "settings.gradle"),
    "pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }\ndependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }\nrootProject.name = 'DeskAndroidApp'\ninclude ':app'\n"
  );
  writeFileSync(join(outDir, "build.gradle"), createBuild(packageName, config.minSdk));
  writeFileSync(join(outDir, "app", "build.gradle"), createAppBuild());
  writeFileSync(
    join(outDir, "app", "src", "main", "AndroidManifest.xml"),
    createManifest(packageName, config.name)
  );
  writeFileSync(
    join(outDir, "app", "src", "main", "res", "values", "styles.xml"),
    '<resources><style name="AppTheme" parent="android:style/Theme.Material.NoActionBar"><item name="android:windowFullscreen">true</item></style></resources>\n'
  );
  writeFileSync(join(sourceDir, "MainActivity.java"), createActivity(packageName));
}

export function createAndroidPlan(config: AndroidConfig) {
  return {
    packageName: config.packageName ?? config.appId,
    minSdk: config.minSdk ?? 23,
    strategy: "WebView shell loads bundled deskjs web assets from android_asset/www."
  };
}

export function buildAndroid(options: AndroidOptions) {
  const outDir = join(options.root, ".desk", "dist", "android");
  const packageName = options.config.packageName ?? options.config.appId;
  const config = { ...options.config, packageName, minSdk: options.config.minSdk ?? 23 };
  rmSync(outDir, { recursive: true, force: true });
  writeAndroidFiles(outDir, config);
  cpSync(options.webDir, join(outDir, "app", "src", "main", "assets", "www"), { recursive: true });
  writeFileSync(
    join(outDir, "README.md"),
    "Open this Gradle project in Android Studio or run `gradle assembleDebug` with Android SDK installed.\n"
  );
  return { outDir };
}

function findApk(dir: string): string | null {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      const file = findApk(path);
      if (file) return file;
      continue;
    }
    if (item.name.endsWith(".apk")) return path;
  }
  return null;
}

export function packageAndroid(outDir: string) {
  const wrapper = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
  const command = existsSync(join(outDir, wrapper.replace("./", ""))) ? wrapper : "gradle";

  runCommand(
    command,
    ["assembleDebug"],
    outDir,
    "Install Android SDK and Gradle, or open the generated project in Android Studio."
  );

  const file = findApk(join(outDir, "app", "build", "outputs", "apk"));
  if (!file) throw new Error("Gradle completed, but no .apk file was produced.");
  return { file };
}
