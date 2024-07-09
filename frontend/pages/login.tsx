import AuthForm from "@/components/AuthForm";
import Layout from '../components/Layout';

const LoginPage: React.FC = () => {
    return (
        <Layout>
            <AuthForm mode="login" />
        </Layout>
);
};

export default LoginPage;
