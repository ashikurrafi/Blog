import { Link } from "react-router-dom"

const BlogTitle = () => {
    return (
        <>
            <div className="flex justify-between bg-white px-3 py-2 items-center rounded-sm mb-5">
                <h5 className="">Computer</h5>
                <Link to="#" className="text-white bg-blue-500 px-3 py-1 rounded-sm hover:bg-transparent hover:text-blue-500 transition border border-blue-500">See more</Link>
            </div>
        </>)
}

export default BlogTitle