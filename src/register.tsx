import { useState } from "react";
import axios from "axios";
import Cookies from 'cookies';
const Base_url = import.meta.env.VITE_API_URL;
export function Register() {
  const [reg, useReg] = useState({
    full_name: "",
    mobile_no: "",
    email: "",
  });
  const register = async () => {
    const api = await axios.post(`${Base_url}/posp/register`, {
      full_name: reg.full_name,
      mobile_no: reg.mobile_no,
      email: reg.email,
    });
    console.log(api.data);
    if(api.data){
        setRegistered(false)
    }
  };
  const update = (ch: React.ChangeEvent<HTMLInputElement>) => {
    useReg((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };
  const [verify_otp, useVerify_otp] = useState({
    email_otp: "",
    mobile_otp: "",
  });
  const [registered, setRegistered] = useState(true)

  const verify = async () => {
    const to_verify_otp = await axios.post(`${Base_url}/posp/verify_otps`, {
      email: reg.email,
      mobile_no: reg.mobile_no,
      email_otp: verify_otp.email_otp,
      mobile_otp: verify_otp.mobile_otp,
    });
    console.log(to_verify_otp);
    if (to_verify_otp.access_token) {
      Cookies.set("Token", to_verify_otp.access_token, { expires: 7 });
    }
  };
  const update_otp = (ch: React.ChangeEvent<HTMLInputElement>) => {
    useVerify_otp((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };
  return (
    <div className="container display-6">
        {registered ? (<div className="d-flex flex-column w-50">
        Sign up
        <input
          type="text"
          name="full_name"
          value={reg.full_name}
          onChange={update}
          placeholder="Enter your full name"
        />
        <input
          type="text"
          name="mobile_no"
          value={reg.mobile_no}
          onChange={update}
          placeholder="Mobile number"
        />
        <input
          type="text"
          name="email"
          value={reg.email}
          onChange={update}
          placeholder="Email id"
        />
        <div className="d-flex justify-content-evenly">
          <button onClick={register}>Register</button>
          <button>Login</button>
        </div>
       
      </div>):(
        <div>
      <input type="text" name="email_otp" placeholder="Email otp" onChange={update_otp} />
      <input type="text" name="mobile_otp" placeholder="Mobile otp" onChange={update_otp}/>
      <button onClick={verify}>Submit</button></div>)
      }
      
       
    </div>
  );
}
