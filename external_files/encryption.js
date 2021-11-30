import CryptoJS from 'crypto-js'

var cryptoObj = {
    /* 加密 */
    encryptFunc: (message) => {
        var key = 'vike123';//前后端约定好的秘钥
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.AES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();

    },
}

export default cryptoObj;
