import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
    if (api.data) {
      setRegistered(false);
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
  const [registered, setRegistered] = useState(true);

  const verify = async () => {
    const to_verify_otp = await axios.post(`${Base_url}/posp/verify_otps`, {
      email: reg.email,
      mobile_no: reg.mobile_no,
      email_otp: verify_otp.email_otp,
      mobile_otp: verify_otp.mobile_otp,
    });
    console.log(to_verify_otp.data);
    if (to_verify_otp.data.access_token) {
      Cookies.set("Token", to_verify_otp.data.access_token, { expires: 7 });
    }
  };
  const update_otp = (ch: React.ChangeEvent<HTMLInputElement>) => {
    useVerify_otp((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };

  const [inlogin, setInlogin] = useState(false);
  const [login_check, setLogin_check] = useState({
    mobile_no: "",
    otp: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);

  const login = async () => {
    const verify_login = await axios.post(`${Base_url}/posp/login`, {
      mobile_no: login_check.mobile_no,
      otp: login_check.otp,
    });
    console.log(verify_login);
    if(verify_login.data.accesstoken){
      Cookies.set("Token", verify_login.data.accesstoken,{expires: 7})
    }
  };
  const goToLogin = () => setInlogin(true);
  const goToSignUp = () => setInlogin(false);

  const update_otps = (ch: React.ChangeEvent<HTMLInputElement>) => {
    setLogin_check((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };
  // const [mob_otp, setMob_otp] = useState({
  //   mobile_otp: "",
  // });
  const getOtp = async () => {
    const mobOtp = await axios.post(`${Base_url}/posp/send_otp`, {
      mobile_no: login_check.mobile_no,
    });
    console.log(mobOtp);
    setShowOtpInput(true);
  };
  // const update_mob_otp = (ch: React.ChangeEvent<HTMLInputElement>) => {
  //   setMob_otp((prev) => ({
  //     ...prev,
  //     [ch.target.name]: ch.target.value,
  //   }));
  // }
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="mb-4">{inlogin ? "Login" : "Register"}</h2>
          <div className="btn-group mb-4">
            <button 
              className={`btn ${!inlogin ? 'btn-primary' : 'btn-outline-primary'}`} 
              onClick={goToSignUp}
            >
              Sign Up
            </button>
            <button 
              className={`btn ${inlogin ? 'btn-primary' : 'btn-outline-primary'}`} 
              onClick={goToLogin}
            >
              Sign In
            </button>
          </div>
        </div>

        {inlogin ? (
          <div className="d-flex flex-column gap-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Mobile number"
                name="mobile_no"
                value={login_check.mobile_no}
                onChange={update_otps}
              />
            </div>
            <button 
              className="btn btn-primary w-100" 
              onClick={getOtp}
            >
              Get OTP
            </button>
            {showOtpInput && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    name="otp"
                    value={login_check.otp}
                    onChange={update_otps}
                  />
                </div>
                <button 
                  className="btn btn-success w-100" 
                  onClick={login}
                >
                  Login
                </button>
              </>
            )}
          </div>
        ) : (
          <div>
            {registered ? (
              <div className="d-flex flex-column gap-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={reg.full_name}
                    onChange={update}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_no"
                    value={reg.mobile_no}
                    onChange={update}
                    placeholder="Mobile number"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={reg.email}
                    onChange={update}
                    placeholder="Email id"
                  />
                </div>
                <button 
                  className="btn btn-primary w-100" 
                  onClick={register}
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="email_otp"
                    placeholder="Email OTP"
                    onChange={update_otp}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_otp"
                    placeholder="Mobile OTP"
                    onChange={update_otp}
                  />
                </div>
                <button 
                  className="btn btn-success w-100" 
                  onClick={verify}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
