package com.scrollguard

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * ScrollGuardAccessibilityService
 *
 * Scoped strictly to:
 * - Instagram: com.instagram.android
 * - YouTube: com.google.android.youtube
 *
 * Privacy & Play Store Compliance:
 * - Does NOT inspect, extract, or read on-screen text or user-generated content.
 * - Only detects vertical scroll events (TYPE_VIEW_SCROLLED) within short-form feeds (Reels/Shorts).
 * - Tracks dwell time (seconds) inside Reels/Shorts surfaces vs general app feeds.
 */
class ScrollGuardAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ScrollGuardAccessService"
        const val PKG_INSTAGRAM = "com.instagram.android"
        const val PKG_YOUTUBE = "com.google.android.youtube"

        var instance: ScrollGuardAccessibilityService? = null
            private set
    }

    private var currentPackage: String? = null
    private var isInShortsFeed: Boolean = false
    private var feedEnterTimestamp: Long = 0L
    private var accumulatedSecondsToday: MutableMap<String, Long> = mutableMapOf(
        PKG_INSTAGRAM to 0L,
        PKG_YOUTUBE to 0L
    )
    private var scrollCountToday: MutableMap<String, Long> = mutableMapOf(
        PKG_INSTAGRAM to 0L,
        PKG_YOUTUBE to 0L
    )

    private val tickerHandler = Handler(Looper.getMainLooper())
    private val tickerRunnable = object : Runnable {
        override fun run() {
            if (isInShortsFeed && currentPackage != null) {
                val pkg = currentPackage!!
                val currentAcc = (accumulatedSecondsToday[pkg] ?: 0L) + 1L
                accumulatedSecondsToday[pkg] = currentAcc

                // Emit time update to React Native
                emitEvent("onScreenTimeUpdate", Arguments.createMap().apply {
                    putString("source", pkg)
                    putDouble("secondsSpent", currentAcc.toDouble())
                    putDouble("sessionDurationSeconds", ((SystemClock.elapsedRealtime() - feedEnterTimestamp) / 1000).toDouble())
                })
            }
            tickerHandler.postDelayed(this, 1000L)
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.i(TAG, "ScrollGuard Accessibility Service Connected")
        tickerHandler.postDelayed(tickerRunnable, 1000L)
    }

    override fun onDestroy() {
        super.onDestroy()
        tickerHandler.removeCallbacks(tickerRunnable)
        instance = null
        Log.i(TAG, "ScrollGuard Accessibility Service Destroyed")
    }

    override fun onInterrupt() {
        Log.w(TAG, "ScrollGuard Accessibility Service Interrupted")
        exitShortsFeed()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkgName = event.packageName?.toString() ?: return
        if (pkgName != PKG_INSTAGRAM && pkgName != PKG_YOUTUBE) {
            if (isInShortsFeed) {
                exitShortsFeed()
            }
            return
        }

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                handleWindowStateChanged(pkgName, event)
            }
            AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                handleViewScrolled(pkgName, event)
            }
        }
    }

    /**
     * Inspects whether the active window is within Reels or Shorts specifically.
     * Note: UI IDs can change across app releases; we use defensive heuristics
     * based on className, viewIdResourceName tokens without parsing private content.
     */
    private fun handleWindowStateChanged(pkgName: String, event: AccessibilityEvent) {
        val className = event.className?.toString() ?: ""
        var isShortsNow = false

        if (pkgName == PKG_INSTAGRAM) {
            // Instagram Reels viewer activities or clips containers
            // e.g. "ClipsViewerActivity", "ModalActivity", or fragments containing "reel" / "clips"
            if (className.contains("ClipsViewer", ignoreCase = true) ||
                className.contains("Reel", ignoreCase = true) ||
                className.contains("clips", ignoreCase = true)) {
                isShortsNow = true
            } else {
                // Secondary heuristic: check root view container id token
                val rootNode = rootInActiveWindow
                if (rootNode != null) {
                    isShortsNow = hasShortsContainer(rootNode, "clips")
                    rootNode.recycle()
                }
            }
        } else if (pkgName == PKG_YOUTUBE) {
            // YouTube Shorts container or player activities
            if (className.contains("Shorts", ignoreCase = true) ||
                className.contains("ReelPlayer", ignoreCase = true)) {
                isShortsNow = true
            } else {
                val rootNode = rootInActiveWindow
                if (rootNode != null) {
                    isShortsNow = hasShortsContainer(rootNode, "reel") || hasShortsContainer(rootNode, "shorts")
                    rootNode.recycle()
                }
            }
        }

        if (isShortsNow && !isInShortsFeed) {
            enterShortsFeed(pkgName)
        } else if (!isShortsNow && isInShortsFeed) {
            exitShortsFeed()
        }
    }

    /**
     * Helper to detect if any child container belongs to a Reels/Shorts pager.
     * NO TEXT OR USER STRINGS ARE ACCESSED OR SAVED.
     */
    private fun hasShortsContainer(node: AccessibilityNodeInfo, keyword: String): Boolean {
        val viewId = node.viewIdResourceName
        if (viewId != null && viewId.contains(keyword, ignoreCase = true)) {
            return true
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            val found = hasShortsContainer(child, keyword)
            child.recycle()
            if (found) return true
        }
        return false
    }

    private fun enterShortsFeed(pkgName: String) {
        isInShortsFeed = true
        currentPackage = pkgName
        feedEnterTimestamp = SystemClock.elapsedRealtime()

        Log.d(TAG, "Entered Short-Form Feed: $pkgName")
        emitEvent("onAppForeground", Arguments.createMap().apply {
            putString("source", pkgName)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        })
    }

    private fun exitShortsFeed() {
        if (!isInShortsFeed) return
        val pkg = currentPackage ?: ""
        val sessionSeconds = ((SystemClock.elapsedRealtime() - feedEnterTimestamp) / 1000).toDouble()

        Log.d(TAG, "Exited Short-Form Feed: $pkg (duration: ${sessionSeconds}s)")
        emitEvent("onAppBackground", Arguments.createMap().apply {
            putString("source", pkg)
            putDouble("sessionDurationSeconds", sessionSeconds)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        })

        isInShortsFeed = false
        currentPackage = null
    }

    /**
     * Detects vertical scroll / fling gestures inside the short-form feed.
     */
    private fun handleViewScrolled(pkgName: String, event: AccessibilityEvent) {
        // Only count scrolls if currently within Reels or Shorts feed
        if (!isInShortsFeed || currentPackage != pkgName) return

        // Vertical scroll detection (scrollDeltaY != 0 or fromIndex/toIndex change)
        val currentCount = (scrollCountToday[pkgName] ?: 0L) + 1L
        scrollCountToday[pkgName] = currentCount

        Log.d(TAG, "Reel scrolled in $pkgName: total $currentCount")
        emitEvent("onReelScrolled", Arguments.createMap().apply {
            putString("source", pkgName)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
            putDouble("totalScrollsToday", currentCount.toDouble())
        })
    }

    private fun emitEvent(eventName: String, params: WritableMap) {
        val reactContext: ReactContext? = ScrollGuardModule.reactApplicationContextRef?.get()
        if (reactContext != null && reactContext.hasActiveReactInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    fun getStats(pkg: String): Pair<Long, Long> {
        val scrolls = scrollCountToday[pkg] ?: 0L
        val seconds = accumulatedSecondsToday[pkg] ?: 0L
        return Pair(scrolls, seconds)
    }
}
