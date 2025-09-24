import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40  text-sm">
                {/*--left section--*/}
                <div>
                    <img className="mb-5 w-44" src={assets.logo3} alt="" />
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum eligendi vero nisi aliquid. Dolore deleniti quia id. Amet magni tempore beatae corporis! A porro praesentium laudantium officiis excepturi exercitationem debitis!</p>
                </div>
                {/*--Center section--*/}
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/*--right section--*/}
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>9876543210</li>
                        <li>appointmedic@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                {/* copyright text */}
                <hr />
                <p className="py-5 text-sm text-center">Copyright 2025@ AppointMedic - All Right Reserved.</p>
            </div>
        </div>
    )
}
export default Footer