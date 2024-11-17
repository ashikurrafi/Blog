import Category from './Category';
import Navbar from './Navbar';
import RandomPost from './RandomPost';

const Home = () => {
    return (
        <div>
            <Navbar></Navbar >
            <main>
                <div className='py-12 bg-gray-100 min-h-screen'>
                    <div className="container mx-auto px-4 flex">
                        <div className="w-3/12">
                            <Category></Category>
                            <RandomPost></RandomPost>
                        </div>
                        <div className="w-6/12 bg-white py-12 mx-6"></div>
                        <div className="w-3/12 bg-white py-12"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home