

// Global variables
const plainText = document.querySelector('#plaintext');
const key = document.querySelector('#key');
const aesKey = document.querySelector('#aes-key');
const keyCombined = document.querySelector('#key-combined');
const aesKeyCombined = document.querySelector('#aes-key-combined');
const chipertext = document.querySelector('#chipertext');
const coverImage = document.querySelector('#coverImage');
const textBefore = document.querySelector('.text-before');
const textAfter = document.querySelector('.text-after');
const stegoImage = document.querySelector('#stegoImage');
const keyDecrypt = document.querySelector('#keyDecrypt');
const aesKeyDecrypt = document.querySelector('#aes-key-decrypt');
const keyCombinedDecrypt = document.querySelector('#key-combined-decrypt');
const aesKeyCombinedDecrypt = document.querySelector('#aes-key-combined-decrypt');
const resultDecrypt = document.querySelector('#resultDecrypt');

const canvas = document.getElementById('canvas');
const canvasAfter = document.querySelector('#canvasAfter');
const canvasDecrypt = document.getElementById('canvasDecrypt');
const ctx = canvas.getContext("2d");
const ctxAfter = canvasAfter.getContext("2d");
const ctxDecrypt = canvasDecrypt.getContext("2d");

// Initialize canvas sizes
canvas.width = 400;
canvas.height = 300;
canvasAfter.width = 400;
canvasAfter.height = 300;
canvasDecrypt.width = 400;
canvasDecrypt.height = 300;

// Encryption method state
let currentEncryptionMethod = 'combined';
let currentDecryptionMethod = 'caesar';
let imageDataWithMessage = null;

// Event Listeners
document.getElementById('caesar-toggle').addEventListener('click', () => toggleEncryption('caesar'));
document.getElementById('aes-toggle').addEventListener('click', () => toggleEncryption('aes'));
document.getElementById('combined-toggle').addEventListener('click', () => toggleEncryption('combined'));

document.getElementById('caesar-toggle-decrypt').addEventListener('click', () => toggleDecryption('caesar'));
document.getElementById('aes-toggle-decrypt').addEventListener('click', () => toggleDecryption('aes'));
document.getElementById('combined-toggle-decrypt').addEventListener('click', () => toggleDecryption('combined'));

plainText.addEventListener('input', processEncryption);
key.addEventListener('input', processEncryption);
aesKey.addEventListener('input', processEncryption);
aesKeyCombined.addEventListener('input', processEncryption);
keyCombined.addEventListener('input', processEncryption);

coverImage.addEventListener('change', handleCoverImage);
document.getElementById('btn-combine').addEventListener('click', handleCombine);
document.getElementById('btn-reset-encrypt').addEventListener('click', resetEncrypt);

stegoImage.addEventListener('change', handleStegoImage);
document.getElementById('btn-decrypt').addEventListener('click', handleDecrypt);
document.getElementById('btn-reset-decrypt').addEventListener('click', resetDecrypt);

// Toggle encryption method
function toggleEncryption(method) {
    currentEncryptionMethod = method;
    
    // Reset all buttons and options
    document.getElementById('caesar-toggle').classList.remove('bg-teal-500', 'text-white');
    document.getElementById('aes-toggle').classList.remove('bg-teal-500', 'text-white');
    document.getElementById('combined-toggle').classList.remove('bg-teal-500', 'text-white');
    document.getElementById('caesar-options').classList.add('hidden');
    document.getElementById('aes-options').classList.add('hidden');
    document.getElementById('combined-options').classList.add('hidden');
    
    // Activate selected method
    if (method === 'caesar') {
        document.getElementById('caesar-toggle').classList.add('bg-teal-500', 'text-white');
        document.getElementById('caesar-options').classList.remove('hidden');
    } else if (method === 'aes') {
        document.getElementById('aes-toggle').classList.add('bg-teal-500', 'text-white');
        document.getElementById('aes-options').classList.remove('hidden');
    } else {
        document.getElementById('combined-toggle').classList.add('bg-teal-500', 'text-white');
        document.getElementById('combined-options').classList.remove('hidden');
    }
    
    processEncryption();
}

// Toggle decryption method
function toggleDecryption(method) {
    currentDecryptionMethod = method;
    
    // Reset all buttons and options
    document.getElementById('caesar-toggle-decrypt').classList.remove('bg-yellow-500', 'text-white');
    document.getElementById('aes-toggle-decrypt').classList.remove('bg-yellow-500', 'text-white');
    document.getElementById('combined-toggle-decrypt').classList.remove('bg-yellow-500', 'text-white');
    document.getElementById('caesar-options-decrypt').classList.add('hidden');
    document.getElementById('aes-options-decrypt').classList.add('hidden');
    document.getElementById('combined-options-decrypt').classList.add('hidden');
    
    // Activate selected method
    if (method === 'caesar') {
        document.getElementById('caesar-toggle-decrypt').classList.add('bg-yellow-500', 'text-white');
        document.getElementById('caesar-options-decrypt').classList.remove('hidden');
    } else if (method === 'aes') {
        document.getElementById('aes-toggle-decrypt').classList.add('bg-yellow-500', 'text-white');
        document.getElementById('aes-options-decrypt').classList.remove('hidden');
    } else {
        document.getElementById('combined-toggle-decrypt').classList.add('bg-yellow-500', 'text-white');
        document.getElementById('combined-options-decrypt').classList.remove('hidden');
    }
}

// Process encryption based on selected method
function processEncryption() {
    if (plainText.value === '') {
        chipertext.value = '';
        return;
    }

    if (currentEncryptionMethod === 'caesar') {
        if (key.value === '') {
            chipertext.value = '';
            return;
        }
        const result = caesarShift(plainText.value, parseInt(key.value));
        chipertext.value = result;
    } else if (currentEncryptionMethod === 'aes') {
        if (aesKey.value === '') {
            chipertext.value = '';
            return;
        }
        const result = encryptAES(plainText.value, aesKey.value);
        chipertext.value = result;
    } else if (currentEncryptionMethod === 'combined') {
        if (aesKeyCombined.value === '' || keyCombined.value === '') {
            chipertext.value = '';
            return;
        }
        // First AES encryption, then Caesar
        const aesEncrypted = encryptAES(plainText.value, aesKeyCombined.value);
        const result = caesarShift(aesEncrypted, parseInt(keyCombined.value));
        chipertext.value = result;
    }
}

// Caesar cipher implementation
function caesarShift(str, amount) {
    if (amount < 0) {
        return caesarShift(str, amount + 26);
    }

    let output = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (c.match(/[a-z]/i)) {
            let code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
        }
        output += c;
    }
    return output;
}

// AES encryption implementation
function encryptAES(text, key) {
    try {
        return CryptoJS.AES.encrypt(text, key).toString();
    } catch (error) {
        console.error("AES Encryption Error:", error);
        return "";
    }
}

// AES decryption implementation
function decryptAES(ciphertext, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const result = bytes.toString(CryptoJS.enc.Utf8);
        return result || "(empty result - wrong key?)";
    } catch (error) {
        console.error("AES Decryption Error:", error);
        return "";
    }
}

// Handle cover image selection
function handleCoverImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            textBefore.textContent = 'Before';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Check text display for "after"
function checkTextAfter() {
    textAfter.textContent = 'After (Right click to save image)';
}

// Handle the combine operation (steganography)
function handleCombine() {
    // Validate inputs
    if (plainText.value === '') {
        alert('Plaintext masih kosong!');
        return;
    }
    
    if (chipertext.value === '') {
        alert('Chipertext masih kosong!');
        return;
    }
    
    if (!coverImage.files || !coverImage.files[0]) {
        alert('Cover Image masih kosong!');
        return;
    }

    checkTextAfter();
    
    // Prepare data to embed
    const dataToEmbed = {
        method: currentEncryptionMethod,
        text: chipertext.value,
        shift: currentEncryptionMethod === 'combined' ? parseInt(keyCombined.value) : null
    };
    
    const dataString = JSON.stringify(dataToEmbed);
    const dataBytes = new TextEncoder().encode(dataString);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check if image can hold the message
    if (dataBytes.length * 8 > data.length / 4) {
        alert('Pesan terlalu panjang untuk gambar ini!');
        return;
    }
    
    // Embed message length (4 bytes)
    const length = dataBytes.length;
    for (let i = 0; i < 4; i++) {
        const byte = (length >> (i * 8)) & 0xFF;
        for (let j = 0; j < 8; j++) {
            const bit = (byte >> j) & 1;
            const pixelIndex = (i * 8 + j) * 4;
            if (pixelIndex >= data.length) break;
            data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
        }
    }
    
    // Embed message data
    for (let i = 0; i < dataBytes.length; i++) {
        const byte = dataBytes[i];
        for (let j = 0; j < 8; j++) {
            const bit = (byte >> j) & 1;
            const pixelIndex = (4 * 8 + i * 8 + j) * 4;
            if (pixelIndex >= data.length) break;
            data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
        }
    }
    
    // Put the modified image data back to canvas
    ctxAfter.putImageData(imageData, 0, 0);
    imageDataWithMessage = imageData;
}

// Handle stego image selection for decryption
function handleStegoImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            ctxDecrypt.clearRect(0, 0, canvasDecrypt.width, canvasDecrypt.height);
            ctxDecrypt.drawImage(img, 0, 0, canvasDecrypt.width, canvasDecrypt.height);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Handle decryption process
function handleDecrypt() {
    if (!stegoImage.files || !stegoImage.files[0]) {
        alert('Upload stego image terlebih dahulu!');
        return;
    }
    
    // Validate keys based on decryption method
    if (currentDecryptionMethod === 'caesar' && keyDecrypt.value === '') {
        alert('Isi field key terlebih dahulu!');
        return;
    }
    
    if (currentDecryptionMethod === 'aes' && aesKeyDecrypt.value === '') {
        alert('Isi field AES key terlebih dahulu!');
        return;
    }
    
    if (currentDecryptionMethod === 'combined' && 
        (keyCombinedDecrypt.value === '' || aesKeyCombinedDecrypt.value === '')) {
        alert('Isi field AES key dan Caesar shift terlebih dahulu!');
        return;
    }

    // Get image data
    const imageData = ctxDecrypt.getImageData(0, 0, canvasDecrypt.width, canvasDecrypt.height);
    const data = imageData.data;
    
    // Extract message length (first 4 bytes)
    let length = 0;
    for (let i = 0; i < 4; i++) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            const pixelIndex = (i * 8 + j) * 4;
            if (pixelIndex >= data.length) break;
            const bit = data[pixelIndex] & 1;
            byte |= (bit << j);
        }
        length |= (byte << (i * 8));
    }
    
    // Extract message data
    const extractedBytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            const pixelIndex = (4 * 8 + i * 8 + j) * 4;
            if (pixelIndex >= data.length) break;
            const bit = data[pixelIndex] & 1;
            byte |= (bit << j);
        }
        extractedBytes[i] = byte;
    }
    
    try {
        // Parse extracted data
        const extractedString = new TextDecoder().decode(extractedBytes);
        const parsedData = JSON.parse(extractedString);
        
        let decryptedText = '';
        
        // Decrypt based on method
        if (currentDecryptionMethod === 'caesar') {
            if (parsedData.method === 'caesar' || parsedData.method === 'combined') {
                decryptedText = caesarShift(parsedData.text, -parseInt(keyDecrypt.value));
            } else {
                decryptedText = "Metode enkripsi tidak cocok (gunakan AES atau Kombinasi)";
            }
        } else if (currentDecryptionMethod === 'aes') {
            if (parsedData.method === 'aes' || parsedData.method === 'combined') {
                decryptedText = decryptAES(parsedData.text, aesKeyDecrypt.value);
            } else {
                decryptedText = "Metode enkripsi tidak cocok (gunakan Caesar atau Kombinasi)";
            }
        } else if (currentDecryptionMethod === 'combined') {
            if (parsedData.method === 'combined') {
                // First reverse Caesar, then decrypt AES
                const caesarReversed = caesarShift(parsedData.text, -parseInt(keyCombinedDecrypt.value));
                decryptedText = decryptAES(caesarReversed, aesKeyCombinedDecrypt.value);
            } else if (parsedData.method === 'caesar') {
                decryptedText = caesarShift(parsedData.text, -parseInt(keyCombinedDecrypt.value));
            } else if (parsedData.method === 'aes') {
                decryptedText = decryptAES(parsedData.text, aesKeyCombinedDecrypt.value);
            }
        }
        
        resultDecrypt.value = decryptedText;
    } catch (error) {
        console.error("Error during decryption:", error);
        resultDecrypt.value = "Gagal mendekripsi pesan. Pastikan gambar dan kunci benar.";
    }
}

// Reset encryption section
function resetEncrypt() {
    plainText.value = '';
    key.value = '';
    aesKey.value = '';
    keyCombined.value = '';
    aesKeyCombined.value = '';
    chipertext.value = '';
    coverImage.value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxAfter.clearRect(0, 0, canvasAfter.width, canvasAfter.height);
    textBefore.textContent = '';
    textAfter.textContent = '';
}

// Reset decryption section
function resetDecrypt() {
    stegoImage.value = '';
    keyDecrypt.value = '';
    aesKeyDecrypt.value = '';
    keyCombinedDecrypt.value = '';
    aesKeyCombinedDecrypt.value = '';
    resultDecrypt.value = '';
    ctxDecrypt.clearRect(0, 0, canvasDecrypt.width, canvasDecrypt.height);
}

// Initialize the page
toggleEncryption('combined');
toggleDecryption('caesar');
