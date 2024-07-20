const { exec } = require('child_process');

const extractTextFromWord = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python3 scripts/extract_text.py ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      const result = JSON.parse(stdout);
      resolve(result.text);
    });
  });
};

module.exports = { extractTextFromWord };
