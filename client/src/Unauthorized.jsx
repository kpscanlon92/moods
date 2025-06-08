import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="card">
            <h2>Unauthorized</h2>
            <p>You must be logged in to access this page.</p>
            <Link to="/login">
                <button>Go to Login</button>
            </Link>
        </div>
    );
}

export default Unauthorized;