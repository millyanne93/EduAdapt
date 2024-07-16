import { useRouter } from 'next/router';
import Link from 'next/link';

const TestStart: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Rules</h1>
      <ul className="list-disc pl-6 mb-4">
        <li>Read each question carefully.</li>
        <li>Each question has multiple choices.</li>
        <li>Select the correct answer and proceed to the next question.</li>
        <li>You cannot go back to previous questions.</li>
      </ul>
      <Link href={`/test/take/${id}`} className="bg-green-500 text-white p-2 rounded-md">
        Start Test
      </Link>
    </div>
  );
};

export default TestStart;
