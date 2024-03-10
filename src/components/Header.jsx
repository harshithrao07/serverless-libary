import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth';
import { UserContext } from "../context/user";

const Header = () => {
  const { currentAuthenticatedUser } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function getUsername() {
      const user = await currentAuthenticatedUser();
      if(user !== undefined) {
        setUsername(user);
      }
    }

    getUsername();
  }, [location]);

  const handleClick = async () => {
    setUsername("")
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
                  <Link to="/cart">Cart</Link>
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