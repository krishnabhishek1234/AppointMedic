import React from "react";
import { assets } from '../assets/assets'
const Contact = () => {
  return (
    <div>
      <div className="text-center text-3xl pt-10 text-gray-500 ">
        <p>CONTACT <span className="text-gray-800 font-medium">US</span></p>
      </div>

      <div className="flex gap-12 pt-20 items-center px-20">
        <img className="w-full md:max-w-[480px]" src={assets.contact_image} alt="" />
        <div className="flex flex-col justify-center gap-9 md:2/4 text-md text-gray-600 leading-relaxed">
          <b className="text-[22px] font-medium  ">
            Our OFFICE
          </b>
          <div>
            <p>54709 Willms Station </p>
            <p>Suite 350, Washington, USA</p>
          </div>
          <div>
            <p>Tel: 9876543210</p>
            <p>Email: appointmedic@gmail.com</p>
          </div>

          <div>
            <b className="text-[22px] font-medium  ">Careers at APPOINTMEDIC</b>
          </div>

          <div>
            <p>Learn more about our teams and job openings.</p>
          </div>
          <div >
            <button className="border-2 border-black px-8 py-4 text-sm text-gray-800 font-light  hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact