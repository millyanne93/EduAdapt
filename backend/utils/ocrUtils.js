const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractTextFromPdf = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  } catch (error) {
    throw new Error('Error extracting text from PDF');
  }
};

module.exports = { extractTextFromPdf };
