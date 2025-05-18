import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export async function takeScreenshot(viewRef: any) {
  try {
    // Request permissions first (only needed for saving to camera roll)
    if (Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library was denied');
      }
    }

    // Capture the screen
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.8,
    });

    if (Platform.OS !== 'web') {
      // Save to camera roll on mobile
      await MediaLibrary.saveToLibraryAsync(uri);
      return 'Screenshot saved to camera roll!';
    } else {
      // Download on web
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = uri;
      link.click();
      return 'Screenshot downloaded!';
    }
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  }
}