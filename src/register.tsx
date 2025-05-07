import { useState } from "react";
import Cookies from "js-cookie";
import "./register.css";
import { get_exam_results, register_api } from "./api/all_api";
import { verify_register_api } from "./api/all_api";
import { login_api } from "./api/all_api";
import { get_otp_api } from "./api/all_api";
import { useNavigate } from "react-router-dom";
export function Login_form() {
  const navigate = useNavigate();
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
  const [hideOtp, setHideOtp] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const goToLogin = () => setInlogin(true);
  const goToSignUp = () => setInlogin(false);
  const resendFunc = () => {
    setCanResend(false);
    setTimer(10);
    let interval: number;
    interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTime = prevTimer - 1;
        if (newTime === 0) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

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
    try {
      const payload_data = {
        full_name: reg.full_name,
        mobile_no: reg.mobile_no,
        email: reg.email,
      };
      const api = await register_api(payload_data);
      if (api.data) {
        setRegistered(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verify = async () => {
    try {
      const payload_data = {
        email: reg.email,
        mobile_no: reg.mobile_no,
        email_otp: verify_otp.email_otp,
        mobile_otp: verify_otp.mobile_otp,
      };
      const to_verify_otp = await verify_register_api(payload_data);
      Cookies.set("Token", to_verify_otp.data.access_token, { expires: 7 });
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const payload_data = {
        mobile_no: login_check.mobile_no,
        otp: login_check.otp,
      };
      
      const verify_login = await login_api(payload_data);
      Cookies.set("Token", verify_login.data.accesstoken, { expires: 7 });
      localStorage.setItem("Posp_id", verify_login.data.posp_id);
      
      if (
        verify_login.data.is_training_completed &&
        verify_login.data.is_profile_completed &&
        verify_login.data.is_exam_completed &&
        verify_login.data.is_agreement_signed
      ) {
        navigate(
          verify_login.data.is_approved
            ? "/dashboard/approved"
            : "/Training"
        );
      } else {
        navigate("/Training");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const get_otp = async () => {
    try {
      const payload_data = {
        mobile_no: login_check.mobile_no,
      };
      await get_otp_api(payload_data);
      setShowOtpInput(true);
      setHideOtp(false);
      resendFunc();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2 className="mb-4">{inlogin ? "Login" : "Register"}</h2>
          <div className="btn-group mb-4">
            <button
              className={`btn ${
                !inlogin ? "btn-primary active" : "btn-outline-primary"
              }`}
              onClick={goToSignUp}
            >
              Sign Up
            </button>
            <button
              className={`btn ${
                inlogin ? "btn-primary active" : "btn-outline-primary"
              }`}
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
            {hideOtp && (
              <button className="btn btn-primary w-100" onClick={get_otp}>
                Get OTP
              </button>
            )}
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
                <div className="d-flex justify-content-end">
                  <p
                    className={`w-50 mb-2 ${
                      canResend ? "text-primary cursor-pointer" : "text-muted"
                    }`}
                    onClick={canResend ? get_otp : undefined}
                    style={{ cursor: canResend ? "pointer" : "default" }}
                  >
                    Resend OTP: {timer} sec
                  </p>
                </div>
                <button className="btn btn-success w-100" onClick={login}>
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
                <button className="btn btn-success w-100" onClick={verify}>
                  Submit
                </button>
              </div>
            ) : (
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
                <button className="btn btn-primary w-100" onClick={register}>
                  Sign UP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
