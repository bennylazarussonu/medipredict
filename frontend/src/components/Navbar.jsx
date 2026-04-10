import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-gray-900 text-white flex justify-between w-full" style={{ padding: 10 }}>
      <div className="w-2/10 text-2xl font-bold">
        MediPredict
      </div>
      <div className="w-2/10 flex justify-center items-center bg-gray-800 rounded">
        <div className="flex gap-5">
          <Link to="/">Consultation</Link> |
          <Link to="/history">History</Link> |
          <Link to="/database">Database</Link>
        </div>
      </div>
      <div className="w-1/10 flex justify-end">
        Logout
      </div>
    </div>
  );
}

export default Navbar;
