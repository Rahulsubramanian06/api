import axios from "axios";
const Base_url = import.meta.env.VITE_API_URL;
interface register_type {
  full_name: string;
  mobile_no: string;
  email: string;
}
interface verify_register_type {
  email: string;
  mobile_no: string;
  email_otp: string;
  mobile_otp: string;
}
interface login_type {
  mobile_no: string;
  otp: string;
}
interface get_otp_type {
  mobile_no: string;
}
export function register_api(payload: register_type) {
  return axios.post(`${Base_url}/posp/register`, payload);
}
export function verify_register_api(payload: verify_register_type) {
  return axios.post(`${Base_url}/posp/verify_otps`, payload);
}
export function login_api(payload: login_type) {
  return axios.post(`${Base_url}/posp/login`, payload);
}
export function get_otp_api(payload: get_otp_type) {
  return axios.post(`${Base_url}/posp/send_otp`, payload);
}
export function get_exam_results(header: any) {
  const id = localStorage.getItem("Posp_id");
  return axios.get(`${Base_url}/posp/exam_results?posp_id=${id}`, header);
}
