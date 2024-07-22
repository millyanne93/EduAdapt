# EduAdapt

EduAdapt is an adaptive learning platform designed to personalize the educational experience for students by providing AI-powered question recommendations. By analyzing student performance, EduAdapt tailors questions to individual needs, ensuring an efficient and effective learning process.

## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

EduAdapt is designed to enhance student learning by providing personalized question recommendations. The platform adapts to each student's performance, offering questions that target their weaknesses and build on their strengths. Our goal is to make learning more efficient and effective through AI-powered insights.

## Technologies Used

- **Backend:** Node.js with Express
- **Frontend:** HTML, CSS, JavaScript (React)
- **Database:** MongoDB
- **AI/ML:** Gemini AI
- **Third-Party Services:** Google Cloud for AI processing, Tesseract for OCR

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/EduAdapt.git
    cd EduAdapt
    ```

2. Install dependencies for the backend:
    ```sh
    cd backend
    npm install
    ```

3. Install dependencies for the frontend:
    ```sh
    cd ../frontend
    npm install
    ```

4. Install dependencies for the AI module:
    ```sh
    cd ../ai
    npm install
    ```

5. Set up environment variables:
    - Create a `.env` file in the `backend` directory with the following variables:
        ```plaintext
        MONGO_URI=your_mongodb_uri
        JWT_SECRET=your_jwt_secret
        ```
    - Create a `.env.local` file in the `frontend` directory with the following variables:
        ```plaintext
        NEXT_PUBLIC_API_URL=http://localhost:5000/api
        ```

## Usage

1. Start the backend server:
    ```sh
    cd backend
    npm start
    ```

2. Start the frontend server:
    ```sh
    cd ../frontend
    npm run dev
    ```

3. Start the AI server:
    ```sh
    cd ../ai
    node gemini-start.js
    ```

4. Access the application at `http://localhost:3000`

## Project Structure


.
├── ai
│   ├── gemini-start.js
│   ├── gemini_model.js
│   ├── package-lock.json
│   └── package.json
├── backend
│   
│   ├── config
│   │   └── db.js
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── models
│   ├── package-lock.json
│   ├── package.json
│   ├── requirements.txt
│   ├── routes
│   ├── scripts
│   │   └── extract_text.py
│   ├── server.js
│   ├── test
│   └── utils
├── frontend
│   ├── components
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── pages
│   ├── postcss.config.mjs
│   ├── public
│   ├── styles
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── package-lock.json
└── package.json

## Features
1. Students
- Personalized Question Recommendations: AI tailors questions based on individual student performance.
- Test-Taking: Submit test responses, which are then scored and stored in the database.
- Feedback Retrieval: Students can retrieve detailed feedback and recommendations from teachers.
2. Teachers
- Role-Based Login: Teachers and students can log in, with their roles distinguished by the admin parameter.
- Assessment Management: Teachers can create, update, and delete assessments.
- Feedback Provision: Provide valuable feedback on student test results.
- AI-Powered Question Generation: Generate questions based on topic, difficulty, and number of questions using Gemini AI.
- Manual Question Creation: Option to create questions manually to tailor assessments to student needs.

## Contributing
We welcome contributions from the community! To contribute:

### Fork the repository.

Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any questions or feedback, please reach out to us at tonymmputhia@gmail.com, millyanne254@gmail.com.
