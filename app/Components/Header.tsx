"use client";
import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Usa una librería para manejar cookies fácilmente

import "../../app/globals.css";


interface decodedToken {
    userId: number,
    role: string,
    authorized: boolean,
    iat: number,
    exp: number
}

function Header() {
    const router = useRouter(); // Inicialización dentro del componente

    const handleLogout = () => {
        Cookies.remove('token'); // Elimina la cookie
        router.push('/login');
    };
    const [userRole, setUserRole] = useState<string | null>(null); // Estado para el rol del usuario

    useEffect(() => {
        const token = Cookies.get('token'); // Accede al token desde las cookies
        if (token) {
            try {
                const decoded: decodedToken = jwtDecode(token);
                setUserRole(decoded.role);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setUserRole(null);
            }
        } else {
            setUserRole(null);
        }
    }, []);
    return (
        <nav className="bg-white-500 text-black p-4">
            <div className="mx-auto flex justify-between items-cente">
                <h2 className="text-2xl font-bold text-left">Construction Monitoring</h2>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/home" className="text-black hover:underline">Home</a>
                    </li>
                    {userRole === 'admin' && (
                        <li>
                            <a href="/jobcreate" className="text-black hover:underline">Job create</a>
                        </li>
                    )}
                    {userRole === 'admin' && (
                        <li>
                            <a href="/billcreate" className="text-black hover:underline">Bill create</a>
                        </li>
                    )}
                    {userRole === 'admin' && (
                        <li>
                            <a href="/pocreate" className="text-black hover:underline">PO create</a>
                        </li>
                    )}
                    <li>
                        <a href="/jobquery" className="text-black hover:underline">Job query</a>
                    </li>
                    <li>
                        <a href="/poquery" className="text-black hover:underline">P.O. query</a>
                    </li>
                    <li>
                        <a href="/billquery" className="text-black hover:underline">Bill query</a>
                    </li>
                    <li>
                        <button  className="text-black hover:underline" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;