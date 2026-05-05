import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-slate-500 mb-6">The page you are looking for could not be found.</p>
    <Link to="/">
      <Button>Back home</Button>
    </Link>
  </div>
);

export default NotFound;
