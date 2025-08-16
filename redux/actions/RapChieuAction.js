import { createAsyncThunk } from '@reduxjs/toolkit';
import { setRapChieu} from '../reducers/RapChieuReducer';
import BASE from '../../config/BaseUrl';
import { fetchAllPhongChieu } from './PhongChieuAction';
import { fetchAllSuatChieu } from './SuatChieuAction';

const api_rapchieu = `http://${BASE}:3000/rapchieu`

export const fetchRapChieu = () => {
  return async dispatch => {
    try {
      const response = await fetch(api_rapchieu);
      const data = await response.json();
      dispatch(setRapChieu(data));
    } catch (error) {
      console.error('Error fetching rap chieu:', error);
    }
  };
};

export const addRapChieu = createAsyncThunk(
    'rapchieu/addRapChieu',
    async rapchieu => {
        const response = await fetch(api_rapchieu, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rapchieu),
        });
        const data = await response.json();
        if (response.ok) {
        return data;
        }
    },
)

export const deleteRapChieu = createAsyncThunk(
  "rapchieu/deleteRapChieu",
  async (cinema_id, { dispatch, getState }) => {
    try {
      // 1. Đảm bảo có dữ liệu mới nhất
      await dispatch(fetchAllPhongChieu());
      await dispatch(fetchAllSuatChieu());

      // 2. Lấy tất cả phòng chiếu của rạp này
      const allPhongChieu = getState().phongchieu.listphongchieu || [];
      const phongChieuOfCinema = allPhongChieu.filter(
        (phong) => phong.cinema_id === cinema_id
      );

      // 3. Lấy tất cả suất chiếu
      const allSuatChieu = getState().suatchieu.listsuatchieu || [];
      
      // 4. Xóa từng suất chiếu của các phòng
      for (const phong of phongChieuOfCinema) {
        const suatChieuOfPhong = allSuatChieu.filter(
          (suat) => suat.room_id === phong.room_id
        );
        
        for (const suat of suatChieuOfPhong) {
          // Xóa suất chiếu
          await fetch(`http://${BASE}:3000/suatchieu/${suat.suat_chieu_id}`, {
            method: 'DELETE',
          });
        }
        
        // Xóa phòng chiếu
        await fetch(`http://${BASE}:3000/phongchieu/${phong.room_id}`, {
          method: 'DELETE',
        });
      }

      // 5. Cuối cùng xóa rạp chiếu
      const response = await fetch(`${api_rapchieu}/${cinema_id}`, { // <-- Sửa lại từ api_rap_chieu thành api_rapchieu
        method: "DELETE",
      });
      
      if (response.ok) {
        return cinema_id;
      }
      throw new Error("Không thể xóa rạp chiếu");
    } catch (error) {
      console.error("Error deleting rap chieu:", error);
      throw error;
    }
  }
);

export const updateRapChieu = createAsyncThunk(
    'rapchieu/updateRapChieu',
    async (rapchieu) => {
        const response = await fetch(`${api_rapchieu}/${rapchieu.cinema_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rapchieu),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        }
    },
)
