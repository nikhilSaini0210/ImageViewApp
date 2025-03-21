import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {getImages} from '@service/apiServices';
import {navigate} from '@utils/NavigationUtils';
import {Routes} from '@navigation/Routes';
import {Colors, Fonts} from '@utils/Constants';
import CustomButton from '@components/CustomButton';
import CustomText from '@components/CustomText';

interface ImageData {
  id: string;
  xt_image: string;
  aspectRatio?: number;
}

const ImageScreen: FC = () => {
  const [offset, setOffset] = useState(0);
  const [imgData, setImgData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoader, setScreenLoader] = useState<boolean>(false);

  const handleImagePress = (item: ImageData) => {
    navigate(Routes.DetailsScreen, {item: item});
  };

  const handleLoadMore = () => {
    if (!loading) {
      setLoading(true);
      fetchImages(offset + 1);
    }
  };

  const formatImageUrl = (url: string): string => {
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (url.startsWith('http:')) {
      return url.replace('http:', 'https:');
    }
    return url;
  };

  const fetchAspectRatio = useCallback(async (image: ImageData) => {
    return new Promise<ImageData>(resolve => {
      const formattedUrl = formatImageUrl(image.xt_image);
      Image.getSize(
        formattedUrl,
        (width, height) => {
          resolve({
            ...image,
            xt_image: formattedUrl,
            aspectRatio: width / height,
          });
        },
        () => {
          resolve({...image, xt_image: formattedUrl, aspectRatio: 1});
        },
      );
    });
  }, []);

  const renderItem = ({item}: {item: ImageData}) => (
    <TouchableOpacity
      onPress={() => handleImagePress(item)}
      style={styles.imageContainer}>
      <Image
        source={{
          uri: item.xt_image,
        }}
        style={[
          styles.image,
          item.aspectRatio ? {aspectRatio: item.aspectRatio} : {},
        ]}
      />
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <CustomButton
      disabled={loading}
      title="Click here to load more..."
      onPress={handleLoadMore}
      loading={loading}
    />
  );

  const fetchImages = useCallback(
    async (val: number) => {
      try {
        const res = await getImages(val);
        const updatedImages = await Promise.all(
          res?.images.map((img: ImageData) => fetchAspectRatio(img)),
        );
        setImgData(prev => [...prev, ...updatedImages]);
        setOffset(val);
      } catch (error) {
        console.log('Error Fetch to images', error);
        Alert.alert('Error', 'Network Error');
      } finally {
        setLoading(false);
        setScreenLoader(false);
      }
    },
    [fetchAspectRatio],
  );

  useEffect(() => {
    if (offset === 0) {
      setScreenLoader(true);
      fetchImages(0);
    }
  }, [fetchImages, offset]);

  return (
    <View style={styles.container}>
      {screenLoader && (
        <View style={styles.contentConatiner}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      )}
      {imgData.length > 0 ? (
        <FlatList
          data={imgData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={imgData.length % 10 === 0 ? renderFooter : null}
        />
      ) : !screenLoader ? (
        <View style={styles.contentConatiner}>
          <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
            No Data
          </CustomText>
        </View>
      ) : null}
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
