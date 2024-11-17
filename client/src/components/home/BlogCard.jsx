import { Link } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faClock } from '@fortawesome/free-regular-svg-icons'


const BlogCard = () => {
    return (
        <>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-white p-4 shadow-sm rounded-sm">
                    <Link to='#' className="overflow-hidden block">
                        <img src="./src/assets/images/computer-4795762_1280.jpg" alt="Blog image" className="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500" />
                    </Link>
                    <div className="mt-3">
                        <Link to="#">
                            <h2 className="text-xl text-gray-700 hover:text-blue-500 transition">Lorem ipsum dolor sit amet consectetur</h2>
                        </Link>
                        <div className="flex mt-2 space-x-5">
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                Ashikur Rafi
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 shadow-sm rounded-sm">
                    <Link to='#' className="overflow-hidden block">
                        <img src="./src/assets/images/fiber-4814456_1280.jpg" alt="Blog image" className="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500" />
                    </Link>
                    <div className="mt-3">
                        <Link to="#">
                            <h2 className="text-xl text-gray-700 hover:text-blue-500 transition">Lorem ipsum dolor sit amet consectetur</h2>
                        </Link>
                        <div className="flex mt-2 space-x-5">
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                Ashikur Rafi
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 shadow-sm rounded-sm">
                    <Link to='#' className="overflow-hidden block">
                        <img src="./src/assets/images/pexels-eberhardgross-640781.jpg" alt="Blog image" className="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500" />
                    </Link>
                    <div className="mt-3">
                        <Link to="#">
                            <h2 className="text-xl text-gray-700 hover:text-blue-500 transition">Lorem ipsum dolor sit amet consectetur</h2>
                        </Link>
                        <div className="flex mt-2 space-x-5">
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                Ashikur Rafi
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 shadow-sm rounded-sm">
                    <Link to='#' className="overflow-hidden block">
                        <img src="./src/assets/images/pexels-luis-gomes-166706-546819.jpg" alt="Blog image" className="w-full h-60 object-cover rounded transform hover:scale-110 transition duration-500" />
                    </Link>
                    <div className="mt-3">
                        <Link to="#">
                            <h2 className="text-xl text-gray-700 hover:text-blue-500 transition">Lorem ipsum dolor sit amet consectetur</h2>
                        </Link>
                        <div className="flex mt-2 space-x-5">
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                Ashikur Rafi
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <span className="mr-2 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCard