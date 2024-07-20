import React from 'react';
import { useSpring, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChartLine, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });

  return (
    <Layout>
      <div className=' my-6'>
        <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
          <div className="container mx-auto text-center">
            <animated.div style={fade}>
              <h1 className="text-5xl font-bold mb-6">Welcome to EduAdapt</h1>
              <p className="text-lg mb-4">Personalized Learning through AI-Powered Question Recommendations</p>
              <a href="/register" className="bg-white text-green-600 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-gray-200">Get Started</a>
            </animated.div>
          </div>
        </section>
        <section className="container mx-auto py-10">
          <h2 className="text-3xl font-bold text-center mb-10">Why EduAdapt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <animated.div style={useSpring({ opacity: 1, from: { opacity: 0 }, delay: 300 })} className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon icon={faUserGraduate} className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Personalized Learning</h3>
              <p className="text-gray-600">Tailored question recommendations based on individual student performance.</p>
            </animated.div>
            <animated.div style={useSpring({ opacity: 1, from: { opacity: 0 }, delay: 400 })} className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon icon={faChartLine} className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Adaptive Learning Path</h3>
              <p className="text-gray-600">Dynamic adjustment of difficulty and type of questions to match student's current level.</p>
            </animated.div>
            <animated.div style={useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500 })} className="bg-white p-6 rounded-lg shadow-md text-center">
              <FontAwesomeIcon icon={faCommentDots} className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Continuous Feedback</h3>
              <p className="text-gray-600">Real-time feedback and explanations to help students understand their mistakes and improve.</p>
            </animated.div>
          </div>
        </section>
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Thousands of Students</h2>
            <p className="text-lg text-gray-700 mb-6">Experience the future of personalized education with EduAdapt.</p>
            <a href="/register" className="bg-green-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-green-600">Sign Up Now</a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
