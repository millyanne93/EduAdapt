import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Results from '@/components/Results';

const UserResultsPage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Results userId={userId as string} />
    </Layout>
  );
};

export default UserResultsPage;
