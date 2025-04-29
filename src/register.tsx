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
  const [verify_otp, setRegisterOtp] = useState({
    email_otp: "",
    mobile_otp: "",
  });
  const [login_check, setLogin_check] = useState({
    mobile_no: "",
    otp: "",
  });

  const [inlogin, setInlogin] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [registered, setRegistered] = useState(true);

  const goToLogin = () => setInlogin(true);
  const goToSignUp = () => setInlogin(false);

  const update = (ch: React.ChangeEvent<HTMLInputElement>) => {
    useReg((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };

  const update_register_otp = (ch: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterOtp((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };

  const update_login_otp = (ch: React.ChangeEvent<HTMLInputElement>) => {
    setLogin_check((prev) => ({
      ...prev,
      [ch.target.name]: ch.target.value,
    }));
  };

  const register = async () => {
    const payload = {
      full_name: reg.full_name,
      mobile_no: reg.mobile_no,
      email: reg.email,
    };
    const api = await axios.post(`${Base_url}/posp/register`,payload );
    if (api.data) {
      setRegistered(false);
    }
  };

  const verify = async () => {
    const to_verify_otp = await axios.post(`${Base_url}/posp/verify_otps`, {
      email: reg.email,
      mobile_no: reg.mobile_no,
      email_otp: verify_otp.email_otp,
      mobile_otp: verify_otp.mobile_otp,
    });
    if (to_verify_otp.data.access_token) {
      Cookies.set("Token", to_verify_otp.data.access_token, { expires: 7 });
    }
  };

  const login = async () => {
    try {
      const verify_login = await axios.post(`${Base_url}/posp/login`, {
        mobile_no: login_check.mobile_no,
        otp: login_check.otp,
    });
    if(verify_login.data.accesstoken){
      Cookies.set("Token", verify_login.data.accesstoken,{expires: 7})
    }
  } catch (error) {
    console.error(error);
  }
  };

  const getOtp = async () => {
    const mobOtp = await axios.post(`${Base_url}/posp/send_otp`, {
      mobile_no: login_check.mobile_no,
    });
    setShowOtpInput(true);
  };
  // const [mob_otp, setMob_otp] = useState({
  //   mobile_otp: "",
  // });

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
                onChange={update_login_otp}
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
                    onChange={update_login_otp}
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
                    value={verify_otp.email_otp}
                    onChange={update_register_otp}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_otp"
                    placeholder="Mobile OTP"
                    value={verify_otp.mobile_otp}
                    onChange={update_register_otp}
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
