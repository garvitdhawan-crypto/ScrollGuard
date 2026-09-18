package com.scrollguard

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.lang.ref.WeakReference

class ScrollGuardModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ScrollGuardModule"
        var reactApplicationContextRef: WeakReference<ReactApplicationContext>? = null
    }

    init {
        reactApplicationContextRef = WeakReference(reactContext)
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        try {
            val context = reactApplicationContext
            val expectedServiceName = "${context.packageName}/${ScrollGuardAccessibilityService::class.java.canonicalName}"
            val settingValue = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )

            var isEnabled = false
            if (!TextUtils.isEmpty(settingValue)) {
                val colonSplitter = TextUtils.SimpleStringSplitter(':')
                colonSplitter.setString(settingValue)
                while (colonSplitter.hasNext()) {
                    val service = colonSplitter.next()
                    if (service.equals(expectedServiceName, ignoreCase = true) ||
                        service.contains(ScrollGuardAccessibilityService::class.java.simpleName, ignoreCase = true)) {
                        isEnabled = true
                        break
                    }
                }
            }
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            promise.reject("CHECK_ACCESSIBILITY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val context = reactApplicationContext
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    @ReactMethod
    fun getSessionStats(packageName: String, promise: Promise) {
        val service = ScrollGuardAccessibilityService.instance
        val result: WritableMap = Arguments.createMap()
        if (service != null) {
            val stats = service.getStats(packageName)
            result.putDouble("reelsScrolled", stats.first.toDouble())
            result.putDouble("timeSpentSeconds", stats.second.toDouble())
        } else {
            result.putDouble("reelsScrolled", 0.0)
            result.putDouble("timeSpentSeconds", 0.0)
        }
        promise.resolve(result)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter Calls
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter Calls
    }
}
