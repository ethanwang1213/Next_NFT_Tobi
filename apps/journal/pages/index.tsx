import Link from 'next/link';
import Layout from '../components/Layout';
import ProfilePage1 from '@/components/pages/ProfilePage/ProfilePage1/ProfilePage1';
import ProfilePage0 from '@/components/pages/ProfilePage/ProfilePage0/ProfilePage0';

const IndexPage = () => (
  <Layout title="Tobiratory Journal">
    <ProfilePage0 />
  </Layout>
);

export default IndexPage;
