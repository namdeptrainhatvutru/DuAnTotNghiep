import { setPhim } from "../reducers/PhimReducer"



const api_phim = 'https://67b5f43207ba6e59083f3354.mockapi.io/Phim'

export const fetchPhim = () => {
    return async dispatch => {
        try {
            const response = await fetch(api_phim)
            const data = await response.json()
            dispatch(setPhim(data))
        } catch (error) {
            console.error('Error fetching phong chieu:', error)
        }
    }
}