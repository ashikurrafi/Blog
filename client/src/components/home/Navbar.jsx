import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faPhone, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center">
                    <div className="w-40">
                        <a href="/">
                            <img src="./src/assets/react.svg" alt="Logo" className="w-full size-12" />
                        </a>
                    </div>
                    <div className="ml-12 flex space-x-5">
                        <Link to='/' className="flex items-center hover:text-blue-500 transition">
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faHouse} />
                            </span>
                            Home
                        </Link>
                        <Link to='/' className="flex items-center hover:text-blue-500 transition">
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faFile} />                            </span>
                            About
                        </Link>
                        <Link to='/' className="flex items-center hover:text-blue-500 transition">
                            <span className="mr-2">
                                <FontAwesomeIcon icon={faPhone} />                            </span>
                            Contact
                        </Link>
                    </div>
                    <div className="relative ml-auto">
                        <span className='absolute left-3 top-2 text-sm text-gray-600'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                        <input type="text" placeholder='Search' className='block w-full border-none rounded-2xl pl-11 pr-2 py-2 focus:outline-none bg-gray-100 text-sm text-gray-700 shadow-sm' />
                    </div>
                    <div className='ml-5'>
                        <Link to="/login" className='flex items-center text-sm hover:text-blue-500 transition'>
                            <span className='mr-2'>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            Login/Register</Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar