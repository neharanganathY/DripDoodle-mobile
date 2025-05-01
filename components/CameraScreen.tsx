import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraView as CameraViewType } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <>
          <CameraView
  ref={cameraRef}
  style={styles.camera}
  facing="back" // 👈 Just use the string directly
/>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    zIndex: 999,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
