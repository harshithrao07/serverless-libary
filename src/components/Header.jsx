import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth';
import { Button } from '@aws-amplify/ui-react';

const Header = () => {
  const [username, setUsername] = useState("")
  const [userId, setuserId] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

  }, []);


  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("userId")) {
      setUsername(localStorage.getItem("username"));
      setuserId(localStorage.getItem("userId"))
    }

    if (localStorage.getItem("username") == "" && localStorage.getItem("userId") == "" && localStorage.getItem('cartId') == "") {
      localStorage.removeItem("username")
      localStorage.removeItem("userId")
      localStorage.removeItem("cartId")
      navigate("/auth?message=You have to login first")
    }
  }, [location]);




  const handleLogOut = async () => {
    setUsername("")
    setuserId("")
    localStorage.clear()
    await signOut({ global: true })
    navigate("/")
  }

  const links = [
    {
      'name': 'Home',
      'to': '/'
    },
    {
      'name': 'About',
      'to': '/about'
    },
    {
      'name': 'Books',
      'to': '/books'
    }
  ]


  function renderLinks() {
    return (
      <div className="flex flex-col h-screen border-l lg:flex-row lg:h-max lg:border-l-0 border-[#2A2A2A]">
        <ul className="items-center inline-block lg:ml-9 lg:flex">
          {isOpen &&
            <div className="pt-3">
              <svg className="w-8 h-8 ml-auto mr-2 cursor-pointer" onClick={handleClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

          }
          {links.map((link, index) => (
            <li key={index} onClick={() => isMobile && setIsOpen(prevState => !prevState)} className="my-5 font-bold text-[14px] mx-14 lg:py-6 lg:my-0 md:mx-36 lg:mx-6">
              <NavLink className={({ isActive }) => isActive ? "border-b-[3px] lg:py-6 border-[#2A2A2A]" : null} to={link.to}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center ml-2 justify-center mt-3 lg:mt-0">
          <div>
            {username ?
              <div className='flex items-center gap-x-8 justify-between'>
                <NavLink onClick={() => isMobile && setIsOpen(prevState => !prevState)} to={`/user/${userId}`} className={`${({ isActive }) => isActive ? "text-black" : "text-primary-200"}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                </NavLink>
                <Button className='bg-[#2A2A2A] text-white'><Link onClick={() => isMobile && setIsOpen(prevState => !prevState)} to="/"><span onClick={handleLogOut} className="font-semibold text-xs cursor-pointer">Log Out</span></Link></Button>
              </div>
              :
              <div className='gap-x-8'>
                <Button className='bg-[#2A2A2A] text-white'><Link to="/auth" onClick={() => isMobile && setIsOpen(prevState => !prevState)}><span className="font-semibold cursor-pointer text-xs">Sign Up</span></Link></Button>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

  function handleClick() {
    setIsOpen(prevState => !prevState)
  }


  return (
    <nav className="fixed z-50 top-0 uppercase text-[#2A2A2A] bg-yellow-400 w-full flex items-center justify-between px-5 font-normal lg:px-16">
      <NavLink to="/"><span className='text-xl lg:text-4xl font-bold'>NITTE</span></NavLink>
      <div className={isOpen ? "inline-block absolute top-0 bg-yellow-400 h-screen right-0" : "hidden lg:inline-flex"}>
        {renderLinks()}
      </div>
      <div className="lg:hidden">
        <svg onClick={handleClick} className="w-8 h-8 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
    </nav>
  )
}

export default Header