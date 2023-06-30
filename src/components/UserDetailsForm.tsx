import { useUser } from "@clerk/nextjs";
import { api } from "src/utils/api";
import { useEffect, useState } from "react";
import { isValid } from "date-fns";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setIsRegistered: Dispatch<SetStateAction<boolean>>;
}

export default function UserDetailsForm({ setIsRegistered }: Props) {
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
    if (userData.data && userData.data.length !== 0) {
      setIsRegistered(true);
    }
  });

  if (userData.data && userData.data.length === 1) {
    return;
  }

  return (
    <div className="flex flex-col items-center" style={{ height: "90vh" }}>
      <h1 className="translate-y-16 text-center text-4xl uppercase">
        <span className="text-yellow-300">u</span>
        <span className="text-red-600">s</span>
        <span className="text-blue-600">e</span>
        <span className="text-green-600">r</span>
        <span> </span>
        <span className="text-green-600">i</span>
        <span className="text-blue-600">n</span>
        <span className="text-red-600">f</span>
        <span className="text-yellow-300">o</span>
      </h1>
      <div className="flex translate-y-32 flex-col items-center justify-center">
        <form className="bg-slate-900 p-4" id="registrationForm">
          <br />
          <label> Email: </label>
          <br />
          <input
            className="mb-2 w-60 p-2 text-sm text-slate-600"
            type="text"
            id="email"
            value={userEmail || ""}
            readOnly
          ></input>
          <br />
          <label> Gender: </label>
          <br />
          <select
            className="mb-2 w-60 p-2 text-sm  text-slate-600"
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
            className="mb-2 w-60 p-2 text-sm  text-slate-600"
            type="date"
            id="dateOfBirth"
            placeholder="yyyy-mm-dd"
            onChange={handleChange}
          ></input>
          <br />
          <label> Current occupation: </label>
          <br />
          <input
            className="mb-2 w-60 p-2 text-sm text-slate-600"
            type="text"
            id="currentOccupation"
            onChange={handleChange}
          ></input>
          <br />
          <label> Highest completed education: </label>
          <br />
          <select
            className="mb-2 w-60 p-2 text-sm text-slate-600"
            id="highestEdu"
            onChange={handleChange}
          >
            <option value="">select</option>
            <option value="primary school">primary school</option>
            <option value="high school">high school</option>
            <option value="college/gymnasium">college/gymnasium</option>
            <option value="bachelor">bachelor</option>
            <option value="master">master</option>
            <option value="doctoral">doctoral</option>
          </select>
          <br />
        </form>
        <div className="dataInfoContainer text n mt-8 w-1/2 max-w-5xl bg-slate-900 text-justify text-sm">
          <p className="dataInfo p-2">
            To take the test you must fill in this user information.
          </p>
          <p className="dataInfo p-2">
            The data you enter will be saved along with test data, i.e. response
            times and other test-related data. This data is absolutely
            neccessary to collect as it forms norms for the scores.
          </p>
          <p className="dataInfo p-2">
            As I&apos;m not sure what to do with the test data long term, please
            consider that it might be used for scientific or commercial use. By
            submitting this form you agree to any usage. If you wish to delete
            the data, simply send an email to the contact details below.
          </p>
        </div>
        <button
          className="btn m-6"
          form="registrationForm"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
