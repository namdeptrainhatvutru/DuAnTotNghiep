import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuatChieu } from '../redux/actions/SuatChieuAction';

const SuatChieu = ({route}) => {
    const { room_id, ten_phong } = route.params;
    const dispatch = useDispatch();
    const listsuatchieu = useSelector(state => state.suatchieu.listsuatchieu);
    useEffect(()=>{
        dispatch(fetchSuatChieu(room_id))
    },[dispatch,room_id])
    const renderItem = ({ item }) => {
        return (
            <View style={{borderWidth:1,borderRadius:20,padding:10,margin:5}}>
                <Text>{item.suat_chieu_id}</Text>
                <Text>{item.ngay_chieu}</Text>
                <View style={{flexDirection:'row',borderWidth:1,borderRadius:40,padding:10,margin:5,width:120,justifyContent:'space-between',}}>
                <Text>{item.thoi_gian_bat_dau}</Text>
                <Text>-</Text>
                <Text>{item.thoi_gian_ket_thuc}</Text>
                </View>
            </View>
        )
    }
    if (!Array.isArray(listsuatchieu) || listsuatchieu.length === 0) {
    return (
        <View>
            <Text>Không có suất chiếu nào</Text>
        </View>
    )
}
  return (
    <View>
      <Text>Phòng : {ten_phong}</Text>
      <Text>Danh sách suất chiếu</Text>
      <FlatList data={listsuatchieu} keyExtractor={item => item.suat_chieu_id} renderItem={renderItem}/>
      

    </View>
  )
}

export default SuatChieu

const styles = StyleSheet.create({})