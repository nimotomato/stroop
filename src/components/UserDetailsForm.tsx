import { useUser } from "@clerk/nextjs";
import { api } from "src/utils/api";
import { useEffect, useState } from "react";
import { isValid } from "date-fns";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setUserEmail: Dispatch<SetStateAction<string>>;
}

export default function UserDetailsForm({ setUserEmail }: Props) {
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [form, setForm] = useState({
    gender: "",
    currentOccupation: "",
    highestEdu: "",
    dateOfBirth: new Date(),
    email: userEmail || "",
  });

  const res = api.user.createUser.useMutation();

  const userData = api.user.getAll.useQuery({ email: userEmail || "" });

  // Update form state
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.id === "dateOfBirth") {
      setForm({ ...form, [e.target.id]: new Date(e.target.value) });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };

  // Make sure now form data is missing
  const checkEmpty = (key: string, value: string | Date) => {
    if (value === "") {
      alert(`${key} is empty!`);
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    if (
      userData &&
      userData.data &&
      userData.data[0] &&
      userData.data[0].email
    ) {
      // This cannot be the way...
      alert("Email already registered.");
      return;
    }

    const isEmpty = Object.entries(form).some((x) => {
      if (checkEmpty(x[0], x[1])) {
        return true;
      }
      return false;
    });

    if (isEmpty) {
      return;
    }

    if (
      form.dateOfBirth.getFullYear() === new Date().getFullYear() ||
      !isValid(form.dateOfBirth) ||
      form.dateOfBirth.getFullYear() >= new Date().getFullYear()
    ) {
      alert("Invalid year selection, try again. ");
      return;
    }

    res.mutate({ ...form }); // This badboy needs error handling
  };

  useEffect(() => {
    if (userEmail) setUserEmail(userEmail);
  }, [userEmail]);

  if (userData.data && userData.data.length === 1) {
    return;
  }

  return (
    <div>
      <form id="registrationForm">
        Register
        <br />
        <label> Email: </label>
        <br />
        <input
          className="text-slate-600"
          type="text"
          id="email"
          value={userEmail || ""}
          readOnly
        ></input>
        <br />
        <label> Gender: </label>
        <br />
        <select
          className="text-slate-600"
          id="gender"
          placeholder="male/female/unspecified"
          onChange={handleChange}
        >
          <option value="">select</option>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="unspecified">unspecified</option>
        </select>
        <br />
        <label> Date of birth: </label>
        <br />
        <input
          className="text-slate-600"
          type="date"
          id="dateOfBirth"
          placeholder="yyyy-mm-dd"
          onChange={handleChange}
        ></input>
        <br />
        <label> Current occupation: </label>
        <br />
        <input
          className="text-slate-600"
          type="text"
          id="currentOccupation"
          onChange={handleChange}
        ></input>
        <br />
        <label> Highest completed education: </label>
        <br />
        <select
          className="text-slate-600"
          id="highestEdu"
          onChange={handleChange}
        >
          <option value="">select</option>
          <option value="5">5 years</option>
          <option value="10">10 years</option>
          <option value="15">15 years</option>
          <option value="20"> 20 years</option>
        </select>
        <br />
      </form>
      <button
        className="bg-black"
        form="registrationForm"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
