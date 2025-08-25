import CryptoJS from 'crypto-js';
import { MOMO_CONFIG } from '../config/MomoConfig';

// Function to create a payment transaction with Momo API v2
export const generateMomoPayment = async (amount, orderInfo = '') => {
  const {
    partnerCode,
    accessKey,
    secretKey,
    redirectUrl,
    ipnUrl,
    requestType,
    lang,
    autoCapture,
    extraData,
    orderGroupId,
    storeId,
    partnerName
  } = MOMO_CONFIG;

  // Generate order ID and request ID
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  
  // Use provided orderInfo or default
  const finalOrderInfo = orderInfo || MOMO_CONFIG.orderInfo;

  // Create raw signature exactly as per Momo documentation
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${finalOrderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  console.log('Raw Signature:', rawSignature);
  
  // Generate HMAC SHA256 signature
  const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);
  
  console.log('Generated Signature:', signature);

  // Create request body exactly as per Momo documentation
  const requestBody = {
    partnerCode: partnerCode,
    partnerName: partnerName,
    storeId: storeId,
    requestId: requestId,
    amount: amount.toString(),
    orderId: orderId,
    orderInfo: finalOrderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  };

  console.log('Request Body:', requestBody);

  try {
    console.log('Calling Momo API...');
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(requestBody).length.toString()
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Momo API Response:', result);

    if (result.resultCode === 0) {
      // Check if we have qrCodeUrl, paymentUrl, payUrl, or deeplink
      const qrCodeUrl = result.qrCodeUrl || result.paymentUrl || result.payUrl || result.shortLink || result.deeplink;
      
      if (!qrCodeUrl) {
        console.error('Momo API success but no payment URL found:', result);
        return { 
          success: false, 
          message: 'Momo API thành công nhưng không có URL thanh toán',
          resultCode: result.resultCode,
          fullResponse: result
        };
      }
      
      // If we have payUrl but no qrCodeUrl, we can create a QR code from the payUrl
      const finalQrCodeUrl = result.qrCodeUrl || qrCodeUrl;
      
      return {
        success: true,
        qrCodeUrl: finalQrCodeUrl,
        orderId: orderId,
        requestId: requestId,
        paymentUrl: result.paymentUrl || result.payUrl,
        deeplink: result.deeplink,
        payUrl: result.payUrl,
        shortLink: result.shortLink,
        fullResponse: result
      };
    } else {
      return { 
        success: false, 
        message: result.message || 'Lỗi không xác định từ Momo',
        resultCode: result.resultCode 
      };
    }
  } catch (error) {
    console.error('Momo API Error:', error);
    return { 
      success: false, 
      message: 'Không thể kết nối đến máy chủ Momo: ' + error.message 
    };
  }
};

// Function to check transaction status
export const checkMomoTransactionStatus = async (orderId, requestId) => {
  const { partnerCode, accessKey, secretKey, queryEndpoint } = MOMO_CONFIG;
  const lang = 'vi';

  // Create raw signature for query
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
  const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

  const requestBody = {
    partnerCode,
    requestId,
    orderId,
    lang,
    signature,
  };

  try {
    const response = await fetch(queryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    
    const result = await response.json();
    console.log('Transaction Status Response:', result);
    
    // resultCode: 0 means payment successful
    if (result.resultCode === 0) {
      return { success: true, message: result.message, data: result };
    } else {
      return { success: false, message: result.message, resultCode: result.resultCode };
    }
  } catch (error) {
    console.error('Query Error:', error);
    return { success: false, message: 'Lỗi khi kiểm tra trạng thái giao dịch: ' + error.message };
  }
};