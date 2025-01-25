"use client";
import "../../app/globals.css";
// import 'bootstrap/dist/css/bootstrap.min.css'; 

function Header() {
  return (
    <>
      <nav className="bg-blue-500 text-white p-4"> 
        <div className="container mx-auto flex justify-between items-center"> 
          <h1 className="text-2xl font-bold">Construction Monitoring</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="/home" className="text-white hover:underline">Home</a>
            </li>
            <li>
              <a href="/jobcreate" className="text-white hover:underline">Job create</a>
            </li>
            <li>
              <a href="/billcreate" className="text-white hover:underline">Bill create</a>
            </li>
            <li>
              <a href="/pocreate" className="text-white hover:underline">PO create</a>
            </li>
            <li>
              <a href="/jobquery" className="text-white hover:underline">Job query</a>
            </li>
            <li>
              <a href="/poquery" className="text-white hover:underline">P.O. query</a>
            </li>
            <li>
              <a href="/billquery" className="text-white hover:underline">Bill query</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;