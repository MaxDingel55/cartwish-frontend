import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';

import "./SignupPage.css";
import user from "../../assets/user.webp";
import { getUser, signup } from '../../services/userServices';
import { Navigate } from 'react-router-dom';

// initializing our zod validation schema. Note that the properties of this object (the names of the input fields) 
// don't have to match those defined in the input objects. For example, confirmPassword refers to the input with id cpassword
const schema = z.object({
    name: z.string().min(3, {message: "Name should be at least 3 characters."}),
    email: z.string().email({message: "Please enter valid email."}),
    password: z.string().min(8, {message: "Password must be at least 8 characters."}),
    confirmPassword: z.string(),
    deliveryAddress: z.string().min(15, {message: "Address must be at least 15 characters."})
    // refine is a zod method that allows you to add more custom validation other than email, min, ...
    // data stores the schema object we just created, hence can access data.password and data.confirmpassword
}).refine(data => data.password === data.confirmPassword, { 
    message: "Confirm password does not match Password.",
    path: ["confirmPassword"] // tells zod to display this error message at the confirm password input
});

const SignupPage = () => {

    const [formError, setFormError] = useState(""); // to display errors

    const [profilePic, setProfilePic] = useState(null); // profile picture inputted as user icon

    const { register, handleSubmit, formState: {errors}} = useForm({resolver: zodResolver(schema)});

    // when signup form submitted, asynchronously run the signup method imported from our userServices.js
    // formData is made by zod's handleSubmit() method, it's an object containing all the data provided in the form
    const onSubmit = async (formData) => {
        try {
            await signup(formData, profilePic);
            window.location = "/";

        } catch (error) {
            if (error.response && error.response.status === 400) {
                setFormError(error.response.data.message);
            }
        }
    }

    // Recall can also use a then() .catch() approach for handling promise, instead of async await
    // const onSubmit = (formData) => {
    //     signup(formData, profilePic).catch(error => (error.response && error.response.status === 400) && setFormError(error.response.data.message))
    // };

    if (getUser()) { // If user is logged in, then just bring them to the home page
            return <Navigate to='/' />;
        }

    return (
        <section className='align_center form_page'>
            <form className='authentication_form signup_form' onSubmit={handleSubmit(onSubmit)}>
                <h2>SignUp Form</h2>

                <div className='image_input_section'>
                    <div className='image_preview'>
                        <img src={profilePic ? URL.createObjectURL(profilePic) : user} id='file-ip-1-preview' />
                    </div>
                    <label htmlFor='file-ip-1' className='image_label'>
                        Upload Image
                    </label>
                    {/* event.target.files returns an array of all the files uploaded, so files[0] gets the first one (able to upload multiple) */}
                    <input type='file' onChange={event => setProfilePic(event.target.files[0])} id='file-ip-1' className='image_inpinut' />
                </div>

                {/* Form Inputs */}
                <div className='form_inputs signup_form_input'>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input
                            id='name'
                            className='form_text_input'
                            type='text'
                            placeholder='Enter your name'
                            {...register("name")} 
                        />
                        {/* If errors.name is non-empty (ie there exist errors for the name input), display error message we specified above*/}
                        {errors.name && <em className='form_error'>{errors.name.message}</em>}
                    </div>

                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            id='email'
                            className='form_text_input'
                            type='email'
                            placeholder='Enter your email address'
                            { ...register("email")}
                        />
                        {errors.email && <em className='form_error'>{errors.email.message}</em>}
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            id='password'
                            className='form_text_input'
                            type='password'
                            placeholder='Enter your password'
                            { ...register("password")}
                        />
                        {errors.password && <em className='form_error'>{errors.password.message}</em>}
                    </div>

                    <div>
                        <label htmlFor='cpassword'>Confirm Password</label>
                        <input
                            id='cpassword'
                            className='form_text_input'
                            type='password'
                            placeholder='Enter confirm password'
                            { ...register("confirmPassword")} // Note that the argument name must match not the input id, 
                            // but the property names defined in the zod schema object
                        />
                        {errors.confirmPassword && <em className='form_error'>{errors.confirmPassword.message}</em>}
                    </div>

                    <div className='signup_textares_section'>
                        <label htmlFor='address'>Delivery Address</label>
                        <textarea
                            id='address'
                            className='input_textarea'
                            placeholder='Enter delivery address'
                            { ...register("deliveryAddress") }
                        />
                        {errors.deliveryAddress && <em className='form_error'>{errors.deliveryAddress.message}</em>}
                    </div>
                </div>

                {formError && <em className='form_error'>{formError}</em>}

                <button className='search_button form_submit' type='submit'>
                    Submit
                </button>
            </form>
        </section>
    );
};

export default SignupPage;

// name - Name should be at least 3 characters.
// email - Please enter valid email
// password - Password must be at least 8 characters.
// confirmPassword - Confirm Password does not match Password
// deliveryAddress - Address must be at least 15 characters.
