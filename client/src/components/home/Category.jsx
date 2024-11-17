import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'


const Category = () => {
    return (
        <>
            <div className="bg-white shadow-sm rounded-sm p-4">
                <h3 className="text-xl text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>React</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>Node</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>Express</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>JavaScript</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>C++</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                    <Link to="#" className='flex items-center hover:text-blue-500 transition'>
                        <span className='mr-2'>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </span>
                        <span>Python</span>
                        <span className='ml-auto'>(12)</span>
                    </Link>
                </div>
            </div>
        </>

    )
}

export default Category