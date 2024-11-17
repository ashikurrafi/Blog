import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faClock } from '@fortawesome/free-regular-svg-icons'


import { Link } from "react-router-dom"

const MainPost = () => {
    return (
        <>
            <div className="bg-white shadow-sm rounded-sm">
                <Link to='#' className="overflow-hidden block">
                    <img src="./src/assets/images/artificial-intelligence-background--abstract-ai-background-with.jpg" alt="Blog image" className="w-full h-96 object-cover rounded transform hover:scale-110 transition duration-500" />
                </Link>
                <div className="p-4">
                    <Link to="#">
                        <h2 className="text-2xl text-gray-700 hover:text-blue-500 transition">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, fugiat!</h2>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti aspernatur quisquam tenetur, fugiat odio beatae nam voluptate sint officia placeat!
                    </p>
                    <div className="flex mt-3 space-x-5">
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
        </>
    )
}

export default MainPost