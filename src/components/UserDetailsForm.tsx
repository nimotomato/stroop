import React from 'react'
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { useState } from "react";

export default function UserDetailsForm() {  
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const res = api.user.getAll.useQuery({ email: userEmail || "email_missing" })

  const [form, setForm] = useState({
    email: userEmail || '',
    gender: '',
    dateOfBirth: '',
    occupation: '',
    education: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(e)
  }


  return (
    <div>
        <form id="registrationForm">
            Register
            <br />
            <label> Email:</label><br />
            <input className="text-slate-500" type="text" id="email" value={ userEmail || ''} readOnly></input><br />
            <label> Gender:</label><br />
            <input type="text" id="gender" placeholder="male/female/unknown" onChange={handleChange}></input><br />
            <label> Date of birth: </label><br />
            <input type="text" id="dateOfBirth" placeholder="yyyy-mm-dd"></input><br />
            <label> Current occupation:</label><br />
            <input type="text" id="occupation" placeholder="e.g. machinist"></input><br />
            <label> Highest completed education:</label><br />
            <select id="education" placeholder="e.g. machinist">
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20"> 20 years</option>
            </select><br />
        </form>
        <button className="bg-black" form="registrationForm" onClick={(e) => handleSubmit(e)}>Submit</button>
    </div>
  )
}
