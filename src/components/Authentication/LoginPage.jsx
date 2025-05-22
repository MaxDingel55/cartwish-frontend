import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';

import './LoginPage.css'
import { getUser, login } from '../../services/userServices';
import { Navigate, useLocation } from 'react-router-dom';

// making the validation schema (set of rules)
const schema = z.object({
    email: z.string().email({message: "Please enter valid email address."}).min(3), // defined 3 rules for the email input field
    password: z.string().min(8, {message: "Password should be at least 8 characters."})
})

const LoginPage = () => {

    const [formError, setFormError] = useState(""); // to display errors

    const location = useLocation();
    console.log("Login location: " + location);
    

    // useForm() returns an object with properties including a register function, handleSubmit function,
    const { register, handleSubmit, formState: {errors} } = useForm({resolver: zodResolver(schema)}); // double destructing!!!

    // when login form submitted, asynchronously run the login() method imported from our userServices.js
    // formData is made by zod's handleSubmit() method, it's an object containing all the data provided in the form
    // using async await approach for handling promise
    // recall the login returns a promise, which, if resolved, becomes a Response object. We store the data from this response by destructuring
    const onSubmit = async (formData) => {
        try {
            await login(formData);

            const { state } = location;
            window.location = state ? state.from : "/";
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setFormError(error.response.data.message);
            }
        }
    }

    if (getUser()) { // If user is logged in, then just bring them to the home page
        return <Navigate to='/' />;
    }

    return (
        <section className="align_center form_page">
            { /* handleSubmit function basically checks if the inputs are valid, and if so, gives the collected formData to the callback function provided */}
            <form action="" className="authentication_form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Login Form</h2>
                <div className="form_inputs">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id='email' 
                            className='form_text_input' 
                            placeholder='Enter your email address'
                             // Using spread operator since register( ) function returns several properties
                            { ...register("email") }  // Ensuring name field being non-empty is required to submit the form, and that is at least 3 characters
                        />

                        {errors.email && <em className="form_error">{errors.email.message}</em>}
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            id='password' 
                            className='form_text_input' 
                            placeholder='Enter your password'
                            { ...register("password") }
                        /> 
                        {errors.password && <em className="form_error">{errors.password.message}</em>}        
                    </div>

                    {formError && <em className='form_error'>{formError}</em>}

                    <button type='submit' className="search_button form_submit">Submit</button>
                </div>
            </form>
        </section>
    )
}

export default LoginPage
