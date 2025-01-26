"use client";
import "../../app/globals.css";
// import 'bootstrap/dist/css/bootstrap.min.css'; 

function Header() {
  return (
      <nav className="bg-white-500 text-black p-4"> 
        <div className="mx-auto flex justify-between items-cente"> 
          <h2 className="text-2xl font-bold text-left">Construction Monitoring</h2>
          <ul className="flex space-x-4">
            <li>
              <a href="/home" className="text-black hover:underline">Home</a>
            </li>
            <li>
              <a href="/jobcreate" className="text-black hover:underline">Job create</a>
            </li>
            <li>
              <a href="/billcreate" className="text-black hover:underline">Bill create</a>
            </li>
            <li>
              <a href="/pocreate" className="text-black hover:underline">PO create</a>
            </li>
            <li>
              <a href="/jobquery" className="text-black hover:underline">Job query</a>
            </li>
            <li>
              <a href="/poquery" className="text-black hover:underline">P.O. query</a>
            </li>
            <li>
              <a href="/billquery" className="text-black hover:underline">Bill query</a>
            </li>
          </ul>
        </div>
      </nav>
  );
}

export default Header;