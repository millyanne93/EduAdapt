import { useRouter } from 'next/router';
import Link from 'next/link';

const TestStart: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Test Instructions</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-xl font-semibold mb-4 text-gray-800">
          Please read the following rules before starting the test. This test will take approximately <span className="font-bold">60 minutes</span>.
        </p>
        <ul className="list-disc pl-6 mb-4 text-lg text-gray-700">
          <li className="mb-2">Read each question carefully.</li>
          <li className="mb-2">Each question has multiple choices.</li>
          <li className="mb-2">Select the correct answer and proceed to the next question.</li>
          <li className="mb-2">You cannot go back to previous questions.</li>
          <li className="mb-2">Ensure you have a stable internet connection.</li>
          <li className="mb-2">Avoid refreshing the page during the test.</li>
        </ul>
        <div className="text-center">
          <Link href={`/test/take/${id}`} className="bg-green-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-600 transition duration-300">
              Start Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestStart;
