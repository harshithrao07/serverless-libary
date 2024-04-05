import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
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
                <h1 className="text-9xl text-center">No Featured Books :(</h1>
            </div>
        </section>
        </>
        )
    }
    return (
        <>
            <Background/>
            <section className=" eatured">
                <header className="bg-yellow shadow-lg featured-head py-4 flex">
                    <h3 className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 text-xl">Featured Collection</h3>
                </header>
                <div className="books featured-list">
                    {featured.map(({ id, image, title }) => (
                        <article key={id} className="book featured-book">
                            <div className="book-image">
                                <img src={image} alt={title} />
                            </div>
                            <Link to={`books/${id}`} className="btn book-link">details</Link>
                        </article>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Home;