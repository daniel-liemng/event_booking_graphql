import React, { useState } from "react";

const Auth = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  const { email, password } = user;

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim().length === 0 || email.trim().length === 0) {
      return;
    }
    try {
      let requestBody = {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
      };

      if (!isLogin) {
        requestBody = {
          query: `
            mutation {
              createUser(userInput: {email: "${email}", password: "${password}"}) {
                _id
                email
              }
            }
          `,
        };
      }

      const res = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='container'>
        <h1>Authentication</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='exampleInputEmail1'>Email address</label>
            <input
              type='email'
              className='form-control'
              id='exampleInputEmail1'
              aria-describedby='emailHelp'
              name='email'
              value={email}
              onChange={handleChange}
            />
            <small id='emailHelp' className='form-text text-muted'>
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className='form-group'>
            <label htmlFor='exampleInputPassword1'>Password</label>
            <input
              type='password'
              className='form-control'
              id='exampleInputPassword1'
              name='password'
              value={password}
              onChange={handleChange}
            />
          </div>

          <button type='submit' className='btn btn-primary mr-2'>
            Submit
          </button>
          <button
            onClick={switchModeHandler}
            type='button'
            className='btn btn-success'
          >
            Switch to {isLogin ? "Signup" : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Auth;
