import BlogCard from './BlogCard';
import BlogTitle from './BlogTitle';
import Category from './Category';
import MainPost from './MainPost';
import Navbar from './Navbar';
import RandomPost from './RandomPost';

const Home = () => {
    return (
        <div>
            <Navbar></Navbar >
            <main>
                <div className='py-5 bg-gray-100 min-h-screen'>
                    <div className="container mx-auto px-4 flex">
                        <div className="w-3/12">
                            <Category></Category>
                            <RandomPost></RandomPost>
                        </div>
                        <div className="w-6/12 mx-6">
                            <BlogTitle></BlogTitle>
                            <MainPost></MainPost>
                            <BlogCard></BlogCard>
                        </div>
                        <div className="w-3/12 bg-white py-12"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home