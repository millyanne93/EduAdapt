import React from 'react';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="text-center my-10">
        <h1 className="text-5xl font-bold mb-6">Welcome to EduAdapt</h1>
        <p className="text-lg text-gray-700">Personalized Learning through AI-Powered Question Recommendations</p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Personalized Learning</h2>
          <p className="text-gray-600">Tailored question recommendations based on individual student performance.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Adaptive Learning Path</h2>
          <p className="text-gray-600">Dynamic adjustment of difficulty and type of questions to match student's current level.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Continuous Feedback</h2>
          <p className="text-gray-600">Real-time feedback and explanations to help students understand their mistakes and improve.</p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
