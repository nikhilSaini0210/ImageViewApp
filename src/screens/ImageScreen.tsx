import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {getImages} from '@service/apiServices';
import {navigate} from '@utils/NavigationUtils';
import {Routes} from '@navigation/Routes';
import {Colors} from '@utils/Constants';
import CustomButton from '@components/CustomButton';

interface ImageData {
  id: string;
  xt_image: string;
  aspectRatio?: number;
}

const ImageScreen: FC = () => {
  const [offset, setOffset] = useState(0);
  const [imgData, setImgData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImagePress = (item: ImageData) => {
    navigate(Routes.DetailsScreen, {item: item});
  };

  const handleLoadMore = () => {
    if (!loading) {
      setLoading(true);
      setOffset(offset + 1);
    }
  };

  const fetchAspectRatio = async (image: ImageData) => {
    return new Promise<ImageData>(resolve => {
      Image.getSize(
        image.xt_image,
        (width, height) => {
          resolve({...image, aspectRatio: width / height});
        },
        () => {
          resolve({...image, aspectRatio: 1});
        },
      );
    });
  };

  const renderItem = ({item}: {item: ImageData}) => (
    <TouchableOpacity
      onPress={() => handleImagePress(item)}
      style={styles.imageContainer}>
      <Image
        source={{uri: item.xt_image}}
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

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await getImages(offset);
        const updatedImages = await Promise.all(
          res?.images.map((img: ImageData) => fetchAspectRatio(img)),
        );
        setImgData(prev => [...prev, ...updatedImages]);
      } catch (error) {
        console.log('Error Fetch to images', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [offset]);

  return (
    <View style={styles.container}>
      {imgData.length > 0 ? (
        <FlatList
          data={imgData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={imgData.length % 10 === 0 ? renderFooter : null}
        />
      ) : (
        <View style={styles.contentConatiner}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      )}
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
  },
  contentConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
