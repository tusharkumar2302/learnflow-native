import { useEvent } from "expo";
import { useVideoPlayer, VideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";

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

type UseLinearVideoPlaybackOptions = {
  player: VideoPlayer;
  startPositionMillis: number;
  isCompleted: boolean;
  isPlayerReady: boolean;
  videoFinishedRef: React.MutableRefObject<boolean>;
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

// Minimum duration threshold to consider video loaded
const MIN_DURATION_THRESHOLD = 0;

// iOS-specific: Threshold for considering video complete (percentage of duration)
const IOS_COMPLETION_THRESHOLD = 0.98;

// ============================================================================
// Module-level singleton to track active player instance
// This ensures only ONE player can ever be active across the entire app
// ============================================================================

let globalActivePlayer: VideoPlayer | null = null;
let globalPlayerId = 0;

/**
 * Safely stops and silences a player instance
 */
function silencePlayer(player: VideoPlayer | null): void {
  if (!player) return;
  try {
    player.pause();
    player.muted = true;
    player.volume = 0;
  } catch {
    // Player may already be released
  }
}

/**
 * Registers a player as the active one, silencing any previous player
 */
function registerActivePlayer(player: VideoPlayer): number {
  // Silence the previous active player
  if (globalActivePlayer && globalActivePlayer !== player) {
    silencePlayer(globalActivePlayer);
  }
  globalActivePlayer = player;
  globalPlayerId += 1;
  return globalPlayerId;
}

/**
 * Unregisters a player if it's still the active one
 */
function unregisterPlayer(player: VideoPlayer, playerId: number): void {
  // Only unregister if this player is still the active one
  if (globalActivePlayer === player && globalPlayerId === playerId) {
    silencePlayer(player);
    globalActivePlayer = null;
  }
}

// ============================================================================
// Custom Hook: useLinearVideoPlayback
// ============================================================================

/**
 * Custom hook that handles linear video playback logic including:
 * - Skip prevention (users can't seek ahead of their max watched position)
 * - Progress tracking with throttling
 * - Completion handling
 * - Duration syncing
 */
function useLinearVideoPlayback({
  player,
  startPositionMillis,
  isCompleted,
  isPlayerReady,
  videoFinishedRef,
  onProgress,
  onComplete,
}: UseLinearVideoPlaybackOptions) {
  // -------------------------------------------------------------------------
  // Refs
  // -------------------------------------------------------------------------

  // Use ref for high-frequency max watched tracking to avoid re-renders
  const maxWatchedRef = useRef(0);

  // Use ref for duration to avoid stale closures in event handlers
  const durationRef = useRef(0);

  // Track last reported progress time for throttling
  const lastProgressReportRef = useRef(0);

  // Guard against multiple completion calls
  const hasCompletedRef = useRef(false);

  // Guard against infinite seek loops during correction
  const isCorrectingSeekRef = useRef(false);

  // Store callbacks in refs to avoid stale closures
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  // -------------------------------------------------------------------------
  // Keep callback refs updated
  // -------------------------------------------------------------------------

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // -------------------------------------------------------------------------
  // Time Update Tracking (only when player is ready)
  // -------------------------------------------------------------------------

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: player.bufferedPosition,
  });

  // -------------------------------------------------------------------------
  // Duration Sync Effect
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (isPlayerReady && player.duration > MIN_DURATION_THRESHOLD) {
      console.log("⏱️ Duration synced:", player.duration);
      durationRef.current = player.duration;
    }
  }, [isPlayerReady, player.duration, player]);

  // -------------------------------------------------------------------------
  // Progress Tracking & Skip Prevention Effect + iOS Completion Detection
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isPlayerReady || currentTime === undefined) return;

    // Skip processing if we're in the middle of a seek correction
    if (isCorrectingSeekRef.current) return;

    const maxWatched = maxWatchedRef.current;
    const duration = durationRef.current;

    // Handle skip prevention for incomplete videos
    if (!isCompleted) {
      // Detect if user tried to skip ahead
      if (currentTime > maxWatched + SKIP_TOLERANCE_SECONDS) {
        // Set guard to prevent infinite loop
        isCorrectingSeekRef.current = true;

        // Reset to max watched position
        player.currentTime = maxWatched;

        // Clear guard after a short delay to allow the seek to complete
        setTimeout(() => {
          isCorrectingSeekRef.current = false;
        }, 100);

        // Don't report progress for invalid seek attempts
        return;
      }

      // Update max watched if current time advances naturally
      if (currentTime > maxWatched) {
        maxWatchedRef.current = currentTime;
      }
    }

    // =====================================================================
    // iOS-SPECIFIC: Detect completion via time tracking
    // On iOS, playToEnd and idle status events are unreliable
    // So we detect completion when currentTime reaches near the end
    // =====================================================================
    if (
      Platform.OS === "ios" &&
      !hasCompletedRef.current &&
      !videoFinishedRef.current &&
      duration > 0 &&
      currentTime >= duration * IOS_COMPLETION_THRESHOLD
    ) {
      console.log("🍎 iOS: Video near end detected via time tracking", {
        currentTime,
        duration,
        threshold: duration * IOS_COMPLETION_THRESHOLD,
        maxWatched: maxWatchedRef.current,
      });

      // For incomplete videos, verify user watched enough
      if (!isCompleted && maxWatchedRef.current < duration * 0.9) {
        console.log("⚠️ iOS: User hasn't watched enough, not marking complete");
      } else {
        console.log("✅ iOS: Triggering completion from time tracking");

        // Mark as completed to prevent duplicate calls
        hasCompletedRef.current = true;
        videoFinishedRef.current = true;

        // Stop the video immediately
        try {
          player.pause();
          player.loop = false;
        } catch {
          // Ignore errors
        }

        // Update maxWatched to full duration
        maxWatchedRef.current = duration;

        // Send final progress report
        onProgressRef.current?.(duration);

        // Trigger completion callback
        console.log("🚀 iOS: Calling onComplete from time tracking");
        onCompleteRef.current?.();
      }
    }

    // Throttled progress reporting
    const now = Date.now();
    if (now - lastProgressReportRef.current >= PROGRESS_THROTTLE_MS) {
      // Only report progress up to max watched (never beyond)
      const reportedProgress = isCompleted
        ? currentTime
        : Math.min(currentTime, maxWatchedRef.current);

      onProgressRef.current?.(reportedProgress);
      lastProgressReportRef.current = now;
    }
  }, [currentTime, isCompleted, isPlayerReady, player, videoFinishedRef]);

  // -------------------------------------------------------------------------
  // Play-to-End Event Handler
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!player || !isPlayerReady) return;

    const handlePlayToEnd = () => {
      console.log("🎬 handlePlayToEnd fired!", {
        hasCompleted: hasCompletedRef.current,
        duration: durationRef.current,
        maxWatched: maxWatchedRef.current,
        isCompleted,
        videoFinished: videoFinishedRef.current,
      });

      // Guard against multiple completion calls
      if (hasCompletedRef.current) {
        console.log("⚠️ Already completed, skipping");
        return;
      }

      const duration = durationRef.current;
      const maxWatched = maxWatchedRef.current;

      // For incomplete videos, check if user actually watched enough
      // Only reset if they skipped significantly (watched less than 90% of video)
      if (!isCompleted && duration > 0 && maxWatched < duration * 0.9) {
        console.log(
          "⚠️ User hasn't watched enough, resetting to maxWatched:",
          maxWatched
        );
        // Reset to max watched and continue playing
        player.currentTime = maxWatched;
        player.play();
        return;
      }

      console.log("✅ Video completion criteria met, calling onComplete");

      // Mark as completed to prevent duplicate calls
      hasCompletedRef.current = true;
      // Also mark video as finished to prevent any restart attempts
      videoFinishedRef.current = true;

      // CRITICAL: Stop the video immediately to prevent auto-replay
      try {
        player.pause();
        player.loop = false; // Reinforce no loop
      } catch {
        // Ignore errors
      }

      // Update maxWatched to full duration for final progress report
      if (duration > 0) {
        maxWatchedRef.current = duration;
      }

      // Send final progress report before completion
      onProgressRef.current?.(maxWatchedRef.current);

      // Trigger completion callback (this will call the API)
      console.log("🚀 Calling onCompleteRef.current:", !!onCompleteRef.current);
      onCompleteRef.current?.();
    };

    console.log(
      "📺 Setting up playToEnd listener, isPlayerReady:",
      isPlayerReady
    );

    // Subscribe to events
    const playToEndSub = player.addListener("playToEnd", handlePlayToEnd);
    // const playingChangeSub = player.addListener(
    //   "playingChange",
    //   handlePlayingChange
    // );

    // Cleanup listeners on unmount or dependency change
    return () => {
      playToEndSub.remove();
      //   playingChangeSub.remove();
    };
  }, [player, isCompleted, isPlayerReady, videoFinishedRef]);

  // -------------------------------------------------------------------------
  // Reset state when startPositionMillis changes (new video)
  // -------------------------------------------------------------------------

  useEffect(() => {
    hasCompletedRef.current = false;
    maxWatchedRef.current = startPositionMillis / 1000;
    lastProgressReportRef.current = 0;
    isCorrectingSeekRef.current = false;
  }, [startPositionMillis]);

  // -------------------------------------------------------------------------
  // Cleanup Effect (report final progress on unmount)
  // -------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      // Report final progress when component unmounts
      if (maxWatchedRef.current > 0) {
        onProgressRef.current?.(maxWatchedRef.current);
      }
    };
  }, []);
}

// ============================================================================
// VideoPlayer3 Component
// ============================================================================

export default function VideoPlayer3({
  videoUrl,
  startPositionMillis = 0,
  isCompleted,
  onProgress,
  onComplete,
}: Props) {
  // Use responsive dimensions that update on orientation change
  const { width: screenWidth } = useWindowDimensions();
  const videoHeight = screenWidth * (9 / 16);

  // Track component mount state
  const isMountedRef = useRef(true);

  // Track our registered player ID for proper cleanup
  const playerIdRef = useRef<number>(0);

  // Track if player is ready for playback
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // -------------------------------------------------------------------------
  // Initialize player
  // -------------------------------------------------------------------------

  const player = useVideoPlayer(videoUrl, (newPlayer) => {
    // Configure player on creation (this runs synchronously)
    newPlayer.loop = false;
    newPlayer.preservesPitch = true;
    newPlayer.staysActiveInBackground = false;
    newPlayer.volume = 1;
    newPlayer.muted = false;

    // iOS-specific: Explicitly set playback rate to 1 initially
    if (Platform.OS === "ios") {
      newPlayer.playbackRate = 1;
    }
  });

  // -------------------------------------------------------------------------
  // iOS-specific: Reinforce loop = false periodically
  // AVPlayer on iOS can sometimes reset loop state
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    // Reinforce loop = false every time player changes or becomes ready
    const reinforceNoLoop = () => {
      try {
        if (player.loop) {
          console.log("🍎 iOS: Resetting loop to false");
          player.loop = false;
        }
      } catch {
        // Ignore errors
      }
    };

    reinforceNoLoop();

    // Also set up an interval to check periodically
    const interval = setInterval(reinforceNoLoop, 2000);

    return () => clearInterval(interval);
  }, [player]);

  // -------------------------------------------------------------------------
  // Player registration and lifecycle management (SINGLE useEffect)
  // -------------------------------------------------------------------------

  useEffect(() => {
    isMountedRef.current = true;
    setIsPlayerReady(false);

    // Register this player as the active one (silences any previous player)
    const playerId = registerActivePlayer(player);
    playerIdRef.current = playerId;

    // Reinforce loop = false to prevent any auto-replay
    player.loop = false;

    // Cleanup function - runs on unmount or when player changes
    return () => {
      isMountedRef.current = false;
      setIsPlayerReady(false);

      // Unregister and silence this player
      unregisterPlayer(player, playerId);
    };
  }, [player]);

  // -------------------------------------------------------------------------
  // Player status tracking and auto-play
  // -------------------------------------------------------------------------

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // Track playing state to detect unwanted replays on iOS
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // Track if video has finished to prevent restart
  const videoFinishedRef = useRef(false);

  // iOS-specific: Catch and prevent unwanted replay
  useEffect(() => {
    if (Platform.OS === "ios" && videoFinishedRef.current && isPlaying) {
      console.log("🍎 iOS: Preventing unwanted replay after completion");
      try {
        player.pause();
        player.loop = false;
      } catch {
        // Ignore errors
      }
    }
  }, [isPlaying, player]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    console.log("📊 Player status changed:", status, {
      isPlayerReady,
      videoFinished: videoFinishedRef.current,
      platform: Platform.OS,
    });

    // Handle video reaching "idle" status (finished playing)
    // THIS IS WHERE WE DETECT VIDEO COMPLETION since playToEnd event is unreliable
    if (status === "idle" && isPlayerReady && !videoFinishedRef.current) {
      console.log("🏁 Video reached idle status - THIS IS COMPLETION!");

      // Mark as finished FIRST to prevent any restart
      videoFinishedRef.current = true;

      // Stop the player completely
      try {
        player.pause();
        player.loop = false;
      } catch {
        // Ignore errors
      }

      // Trigger the onComplete callback - this is the key!
      console.log("🚀 Calling onComplete from idle status");
      onComplete?.();

      return; // Don't process further
    }

    // Prevent restart: if video finished and status goes back to readyToPlay, stop it
    if (status === "readyToPlay" && videoFinishedRef.current) {
      console.log("🛑 Preventing restart - video already finished");
      try {
        player.pause();
        player.loop = false;
      } catch {
        // Ignore errors
      }
      return; // Don't auto-play
    }

    if (status === "readyToPlay" && !isPlayerReady) {
      console.log("▶️ Player ready to play, starting...");
      // Reset finished flag for new video
      videoFinishedRef.current = false;

      // Set initial position if provided
      if (startPositionMillis > 0) {
        player.currentTime = startPositionMillis / 1000;
      }

      // Mark player as ready
      setIsPlayerReady(true);

      // Start playback only if video is not already completed
      if (!isCompleted) {
        // Small delay to ensure everything is set up
        requestAnimationFrame(() => {
          if (
            isMountedRef.current &&
            globalActivePlayer === player &&
            !videoFinishedRef.current
          ) {
            player.play();
          }
        });
      }
    }
  }, [
    status,
    isPlayerReady,
    startPositionMillis,
    isCompleted,
    player,
    onComplete,
  ]);

  // -------------------------------------------------------------------------
  // App state handling (background/foreground)
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (!isMountedRef.current) return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        // Pause when going to background
        try {
          player.pause();
        } catch {
          // Ignore errors
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [player]);

  // -------------------------------------------------------------------------
  // Use custom hook for linear playback logic
  // -------------------------------------------------------------------------

  useLinearVideoPlayback({
    player,
    startPositionMillis,
    isCompleted,
    isPlayerReady,
    videoFinishedRef,
    onProgress,
    onComplete,
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <View style={{ width: screenWidth, height: videoHeight }}>
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
        allowsFullscreen={true}
        allowsPictureInPicture={false}
        requiresLinearPlayback={!isCompleted}
      />
    </View>
  );
}
