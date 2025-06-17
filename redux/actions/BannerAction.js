import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('https://67ac55285853dfff53da3574.mockapi.io/slideShow');
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (banners.length === 0) return;

      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const onScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slide);
  };

  const goToSlide = (index) => {
    flatListRef.current.scrollToIndex({ animated: true, index });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        renderItem={({ item }) => (
          <View style={{overflow:'hidden',borderRadius:20}}>
          <Image source={{ uri: item.avatar }} style={styles.image} /></View>
        )}
      />
      <View style={styles.dotContainer}>
        {banners.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <View style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: width,
      height: 160,
      marginTop: 10
      ,marginRight:10
      
    },
    image: {
      width: width,
      height: 160,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
    },
    dot: {
      colors: '#00ffff',
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#ccc',
      margin: 5,
    },
    activeDot: {
      backgroundColor: '#dc143c',
      width: 12,
      height: 12,
    },
  });
  

export default BannerSlider;
