import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Video, {
  OnLoadData,
  OnPlaybackStateChangedData,
  OnProgressData,
  VideoRef,
} from "react-native-video";

// ============================================================================
// Types
// ============================================================================

type Props = {
  videoUrl: string;
  startPositionMillis?: number;
  isCompleted: boolean;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
};

// ============================================================================
// Constants
// ============================================================================

// Throttle interval for progress reporting (in milliseconds)
const PROGRESS_THROTTLE_MS = 1000;

// Tolerance for skip detection (in seconds)
const SKIP_TOLERANCE_SECONDS = 0.5;

// ============================================================================
// VideoPlayerRNV Component (using react-native-video)
// ============================================================================

export default function VideoPlayerRNV({
  videoUrl,
  startPositionMillis = 0,
  isCompleted,
  onProgress,
  onComplete,
}: Props) {
  // Use responsive dimensions that update on orientation change
  const { width: screenWidth } = useWindowDimensions();
  const videoHeight = screenWidth * (9 / 16);

  // Video ref for imperative control
  const videoRef = useRef<VideoRef>(null);

  // State
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);

  // Refs for tracking
  const maxWatchedRef = useRef(startPositionMillis / 1000);
  const lastProgressReportRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const videoFinishedRef = useRef(false);
  const isMountedRef = useRef(true);
  const isCorrectingSeekRef = useRef(false);
  const currentTimeRef = useRef(0);

  // Store callbacks in refs to avoid stale closures
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // -------------------------------------------------------------------------
  // Reset state when video URL changes
  // -------------------------------------------------------------------------

  useEffect(() => {
    hasCompletedRef.current = false;
    videoFinishedRef.current = false;
    maxWatchedRef.current = startPositionMillis / 1000;
    lastProgressReportRef.current = 0;
    isCorrectingSeekRef.current = false;
    currentTimeRef.current = 0;
    setPaused(false);
  }, [videoUrl, startPositionMillis]);

  // -------------------------------------------------------------------------
  // Mount/Unmount tracking
  // -------------------------------------------------------------------------

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Report final progress on unmount
      if (maxWatchedRef.current > 0) {
        onProgressRef.current?.(maxWatchedRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // App state handling (background/foreground)
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (!isMountedRef.current) return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        setPaused(true);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Video Event Handlers
  // -------------------------------------------------------------------------

  const handleLoad = useCallback(
    (data: OnLoadData) => {
      console.log("📺 RNV: Video loaded", {
        duration: data.duration,
        startPositionMillis,
      });

      setDuration(data.duration);

      // Seek to start position if provided
      if (startPositionMillis > 0 && videoRef.current) {
        videoRef.current.seek(startPositionMillis / 1000);
        maxWatchedRef.current = startPositionMillis / 1000;
      }
    },
    [startPositionMillis]
  );

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      if (!isMountedRef.current) return;
      if (videoFinishedRef.current) return;

      const currentTime = data.currentTime;
      currentTimeRef.current = currentTime;

      // Skip processing if we're in the middle of a seek correction
      if (isCorrectingSeekRef.current) return;

      const maxWatched = maxWatchedRef.current;

      // Handle skip prevention for incomplete videos
      if (!isCompleted) {
        // Detect if user tried to skip ahead
        if (currentTime > maxWatched + SKIP_TOLERANCE_SECONDS) {
          console.log("⚠️ RNV: Skip detected, resetting to:", maxWatched);
          isCorrectingSeekRef.current = true;

          // Reset to max watched position
          videoRef.current?.seek(maxWatched);

          // Clear guard after a short delay
          setTimeout(() => {
            isCorrectingSeekRef.current = false;
          }, 200);

          return;
        }

        // Update max watched if current time advances naturally
        if (currentTime > maxWatched) {
          maxWatchedRef.current = currentTime;
        }
      }

      // Throttled progress reporting
      const now = Date.now();
      if (now - lastProgressReportRef.current >= PROGRESS_THROTTLE_MS) {
        const reportedProgress = isCompleted
          ? currentTime
          : Math.min(currentTime, maxWatchedRef.current);

        onProgressRef.current?.(reportedProgress);
        lastProgressReportRef.current = now;
      }
    },
    [isCompleted]
  );

  const handleEnd = useCallback(() => {
    console.log("🎬 RNV: handleEnd fired!", {
      hasCompleted: hasCompletedRef.current,
      duration,
      maxWatched: maxWatchedRef.current,
      isCompleted,
      videoFinished: videoFinishedRef.current,
    });

    // Guard against multiple completion calls
    if (hasCompletedRef.current || videoFinishedRef.current) {
      console.log("⚠️ RNV: Already completed, preventing replay");
      setPaused(true);
      return;
    }

    const maxWatched = maxWatchedRef.current;

    // For incomplete videos, check if user actually watched enough
    // Only reset if they skipped significantly (watched less than 90% of video)
    if (!isCompleted && duration > 0 && maxWatched < duration * 0.9) {
      console.log(
        "⚠️ RNV: User hasn't watched enough, resetting to maxWatched:",
        maxWatched
      );
      // Reset to max watched and continue playing
      videoRef.current?.seek(maxWatched);
      setPaused(false);
      return;
    }

    console.log("✅ RNV: Video completion criteria met, calling onComplete");

    // Mark as completed to prevent duplicate calls
    hasCompletedRef.current = true;
    videoFinishedRef.current = true;

    // Pause the video to prevent any auto-replay
    setPaused(true);

    // Update maxWatched to full duration for final progress report
    if (duration > 0) {
      maxWatchedRef.current = duration;
    }

    // Send final progress report before completion
    onProgressRef.current?.(maxWatchedRef.current);

    // Trigger completion callback (this will call the API)
    console.log("🚀 RNV: Calling onComplete");
    onCompleteRef.current?.();
  }, [duration, isCompleted]);

  const handlePlaybackStateChanged = useCallback(
    (data: OnPlaybackStateChangedData) => {
      console.log("📊 RNV: Playback state changed:", data);

      // If video finished and somehow starts playing again, stop it
      if (videoFinishedRef.current && data.isPlaying) {
        console.log("🛑 RNV: Preventing replay after completion");
        setPaused(true);
      }
    },
    []
  );

  const handleError = useCallback((error: any) => {
    console.error("❌ RNV: Video error:", error);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <View
      style={[styles.container, { width: screenWidth, height: videoHeight }]}
    >
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        repeat={false}
        controls={true}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        progressUpdateInterval={250}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onPlaybackStateChanged={handlePlaybackStateChanged}
        onError={handleError}
        // iOS specific
        allowsExternalPlayback={false}
      />
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
