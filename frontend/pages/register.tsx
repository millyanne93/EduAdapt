import AuthForm from "@/components/AuthForm";
import Layout from "@/components/Layout";

const RegisterPage: React.FC = () => {
    return (
        <Layout>
            <AuthForm mode="register" />
        </Layout>
);
};

export default RegisterPage;
