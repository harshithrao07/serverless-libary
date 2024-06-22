import { Button } from "@material-tailwind/react"
import React from "react"
import { Link } from "react-router-dom"

export default function RouteError() {
    return (
        <div className="h-screen flex justify-center items-center p-7 md:p-0">
            <div className="p-10 login-card flex justify-center items-center flex-col">
                <span className="text-lg text-center md:text-2xl mb-3">Route does not exist</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
                <Link to="/"><Button className="bg-primary-200 mt-3 px-4">Go back Home</Button></Link>
            </div>
        </div>
    )
}