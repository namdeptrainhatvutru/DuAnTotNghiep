import { setSuatChieu } from "../reducers/SuatChieuReducer"

const api_suat_chieu = 'https://6824075665ba058033989f25.mockapi.io/Suat_Chieu'




export const fetchSuatChieu = (room_id) => {
    return async dispatch => {
        try {
            const response = await fetch(`${api_suat_chieu}?room_id=${room_id}`)
            const data = await response.json()
            dispatch(setSuatChieu(data))
        } catch (error) {
            console.error('Error fetching suat chieu:', error)
        }
    }
}
