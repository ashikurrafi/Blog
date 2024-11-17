import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from '@fortawesome/free-regular-svg-icons'

const RandomPost = () => {
    return (
        <>
            <div className="bg-white shadow-sm rounded-sm p-4 mt-8">
                <h3 className="text-xl text-gray-700 mb-3">Random Post</h3>
                <div className="space-y-4">
                    <Link to="#" className="flex group">
                        <div className="flex-shrink-0">
                            <img src='./src/assets/images/pexels-eberhardgross-640781.jpg' alt="Random post image" className="w-20 h-14 rounded object-cover" />
                        </div>
                        <div className="flex-grow pl-3">
                            <h5 className="text-md leading-5 group-hover:text-blue-500 transition">Nature is beautiful</h5>
                            <div className="flex text-gray-400 text-sm items-center">
                                <span className="mr-1 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </Link>
                    <Link to="#" className="flex group">
                        <div className="flex-shrink-0">
                            <img src='./src/assets/images/pexels-luis-gomes-166706-546819.jpg' alt="Random post image" className="w-20 h-14 rounded object-cover" />
                        </div>
                        <div className="flex-grow pl-3">
                            <h5 className="text-md leading-5 group-hover:text-blue-500 transition">Coding is life</h5>
                            <div className="flex text-gray-400 text-sm items-center">
                                <span className="mr-1 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </Link>
                    <Link to="#" className="flex group">
                        <div className="flex-shrink-0">
                            <img src='./src/assets/images/pexels-pixabay-262508.jpg' alt="Random post image" className="w-20 h-14 rounded object-cover" />
                        </div>
                        <div className="flex-grow pl-3">
                            <h5 className="text-md leading-5 group-hover:text-blue-500 transition">Bloging is fun</h5>
                            <div className="flex text-gray-400 text-sm items-center">
                                <span className="mr-1 text-xs">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                October 24, 2024
                            </div>
                        </div>
                    </Link>
                </div>
            </div >
        </>

    )
}

export default RandomPost