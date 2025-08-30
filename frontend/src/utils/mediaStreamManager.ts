/**
 * Global Media Stream Manager
 * Ensures only one video call can access camera/microphone at a time
 * Prevents "device already in use" errors
 */

class MediaStreamManager {
  private static instance: MediaStreamManager;
  private activeStream: MediaStream | null = null;
  private activeRoomId: string | null = null;
  private isInitializing: boolean = false;

  private constructor() {}

  public static getInstance(): MediaStreamManager {
    if (!MediaStreamManager.instance) {
      MediaStreamManager.instance = new MediaStreamManager();
    }
    return MediaStreamManager.instance;
  }

  /**
   * Get media stream for a specific room
   * Returns existing stream if same room, creates new one if different room
   */
  public async getMediaStream(roomId: string): Promise<MediaStream> {
    console.log(`🎥 MediaStreamManager: Getting stream for room ${roomId}`);
    
    // If we're already initializing, wait for it to complete
    if (this.isInitializing) {
      console.log('🎥 MediaStreamManager: Already initializing, waiting...');
      await this.waitForInitialization();
    }

    // If we already have a stream for this room, return it
    if (this.activeStream && this.activeRoomId === roomId) {
      console.log(`🎥 MediaStreamManager: Reusing existing stream for room ${roomId}`);
      return this.activeStream;
    }

    // If we have a stream for a different room, clean it up first
    if (this.activeStream && this.activeRoomId !== roomId) {
      console.log(`🎥 MediaStreamManager: Cleaning up stream for old room ${this.activeRoomId}`);
      this.releaseStream();
    }

    // Create new stream
    return this.createNewStream(roomId);
  }

  /**
   * Create a new media stream
   */
  private async createNewStream(roomId: string): Promise<MediaStream> {
    this.isInitializing = true;
    
    try {
      console.log(`🎥 MediaStreamManager: Creating new stream for room ${roomId}`);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      });

      this.activeStream = stream;
      this.activeRoomId = roomId;
      this.isInitializing = false;

      console.log(`🎥 MediaStreamManager: Stream created successfully for room ${roomId}`);
      console.log('🎥 Active tracks:', stream.getTracks().map(t => `${t.kind}: ${t.label}`));

      return stream;
    } catch (error) {
      this.isInitializing = false;
      console.error('❌ MediaStreamManager: Failed to create stream:', error);
      throw error;
    }
  }

  /**
   * Release the current media stream
   */
  public releaseStream(roomId?: string): void {
    // If roomId is specified, only release if it matches the active room
    if (roomId && this.activeRoomId !== roomId) {
      console.log(`🎥 MediaStreamManager: Ignoring release request for room ${roomId} (active: ${this.activeRoomId})`);
      return;
    }

    if (this.activeStream) {
      console.log(`🎥 MediaStreamManager: Releasing stream for room ${this.activeRoomId}`);
      
      this.activeStream.getTracks().forEach(track => {
        console.log(`🎥 MediaStreamManager: Stopping ${track.kind} track: ${track.label}`);
        track.stop();
      });
      
      this.activeStream = null;
      this.activeRoomId = null;
      console.log('🎥 MediaStreamManager: Stream released');
    }
  }

  /**
   * Release media stream for a specific room
   */
  public releaseMediaStream(roomId: string): void {
    console.log(`🧹 Releasing media stream for room: ${roomId}`);
    
    if (this.activeStream) {
      // Stop all tracks
      this.activeStream.getTracks().forEach(track => {
        console.log(`🛑 Stopping ${track.kind} track: ${track.label}`);
        track.stop();
      });
      
      this.activeStream = null;
      this.activeRoomId = null;
      this.isInitializing = false;
      
      console.log('✅ Media stream released successfully');
    } else {
      console.log('ℹ️ No active media stream to release');
    }
  }

  /**
   * Force release all media streams (emergency cleanup)
   */
  public forceReleaseAll(): void {
    console.log('🚨 Force releasing all media streams');
    
    if (this.activeStream) {
      this.activeStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    this.activeStream = null;
    this.activeRoomId = null;
    this.isInitializing = false;
    
    console.log('✅ Force cleanup completed');
  }

  /**
   * Wait for initialization to complete
   */
  private async waitForInitialization(): Promise<void> {
    while (this.isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get current active room ID
   */
  public getActiveRoomId(): string | null {
    return this.activeRoomId;
  }

  /**
   * Check if a stream is active for a specific room
   */
  public isStreamActive(roomId: string): boolean {
    return this.activeRoomId === roomId && this.activeStream !== null;
  }
}

export const mediaStreamManager = MediaStreamManager.getInstance();
