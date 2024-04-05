import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Bookcard from "../components/Bookcard";
import Background from '../components/Background'
import { BookContext } from "../context/books";

const Home = () => {
    const { featured } = useContext(BookContext);
    if (!featured.length) {
        return (
        <>
        <Background/>
        <section className=" featured">
            <header className="bg-yellow shadow-lg featured-head py-4 flex">
                <h3 className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 text-xl">Featured Collection</h3>
            </header>
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl text-center">No Featured Books :(</h1>
            </div>
        </section>
        </>
        )
    }
    return (
        <>
            <Background/>
            <section className="featured">
                <header className="bg-yellow-400 shadow-lg featured-head py-4 flex">
                    <h3 className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 h-16 text-2xl font-bold">Featured Collection</h3>
                </header>
                <div className="container mx-auto my-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {featured.map(({ id, image, title }) => (
                        <Bookcard id={id} imgUrl={image} title={title}/>
                        // <article key={id} className="book featured-book">
                        //     <div className="book-image">
                        //         <img src={image} alt={title} />
                        //     </div>
                            
                        // </article>
                    ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;