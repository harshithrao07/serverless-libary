import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth';

const Header = () => {
  const [username, setUsername] = useState("")
  const [userId, setuserId] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(sessionStorage.getItem("username") && sessionStorage.getItem("userId")) {
      setUsername(sessionStorage.getItem("username") );
      setuserId(sessionStorage.getItem("userId"))
    }

    if(sessionStorage.getItem("username") == "" && sessionStorage.getItem("userId") == "" && sessionStorage.getItem('cartId') == "")
    {
      sessionStorage.removeItem("username")
      sessionStorage.removeItem("userId")
      sessionStorage.removeItem("cartId")
      navigate("/auth?message=You have to login first")
    }
  }, [location]);


  const handleClick = async () => {
    setUsername("")
    setuserId("")
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("cartId")
    await signOut({ global: true })
    navigate("/")
  }

  return (
    <header className="main-head">
      <nav>
        <h1 id="logo">Library Portal</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
          {
            username ?
              <>
                <li>
                  <Link to={`/user/${userId}`}>User</Link>
                </li>
                <button onClick={handleClick}>Sign out</button>
              </>
              :
              <button>
                <Link to="/auth">Sign In</Link>
              </button>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header