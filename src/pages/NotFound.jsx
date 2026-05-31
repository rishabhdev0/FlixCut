import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';

export default function NotFound() {
  return (
    <Layout>
      <section className="not-found">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <Button variant="dark" href="/">
          Back to PixCut
        </Button>
      </section>
    </Layout>
  );
}
