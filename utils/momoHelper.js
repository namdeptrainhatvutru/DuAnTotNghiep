import CryptoJS from 'crypto-js';
import { MOMO_CONFIG } from '../config/MomoConfig';

export const generateMomoPayment = async (amount, orderInfo = '') => {
  const {
    partnerCode,
    accessKey,
    secretKey,
    endpoint,
    redirectUrl,
    ipnUrl,
    requestType,
    storeId,
    partnerName,
  } = MOMO_CONFIG;

  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';
  
  // Tạo chuỗi signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo || `Thanh toan ve xem phim - ${orderId}`}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

  const requestBody = {
    partnerCode,
    partnerName,
    storeId,
    requestId,
    amount: amount.toString(),
    orderId,
    orderInfo: orderInfo || `Thanh toan ve xem phim - ${orderId}`,
    redirectUrl,
    ipnUrl,
    lang,
    extraData,
    requestType,
    autoCapture,
    signature
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    
    if (result.resultCode === 0) {
      // Success - return QR code data
      return {
        success: true,
        qrCode: result.qrCodeUrl,
        payUrl: result.payUrl,
        orderId: orderId,
        requestId: requestId,
      };
    } else {
      // Error
      return {
        success: false,
        message: result.message || 'Có lỗi xảy ra khi tạo thanh toán',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Không thể kết nối đến Momo',
    };
  }
};