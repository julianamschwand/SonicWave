import request from '../request.js'

export async function allUsers() {
  return request("get", "/users")
}

export async function userdata() {
  return request("get", "/users/userdata");
}

export async function register(username, email, password) {
  return request("post", "/users/register", { data: { username, email, password }});
}

export async function login(email, password) {
  return request("post", "/users/login", { data: { email, password }});
}

export async function logout() {
  return request("post", "/users/logout");
}

export async function loginState() {
  return request("get", "/users/login-state");
}

export async function changePassword(email, passwordOld, passwordNew, otp) {
  return request("patch", "/users/change-password", { data: { email, passwordOld, passwordNew, otp }});
}

export async function sendOTP(email) {
  return request("get", "/users/send-otp", { params: { email } });
}

export async function deleteUser(userDataId) {
  return request("delete", "/users/delete", { data: { userDataId } });
}

export async function registerRequests() {
  return request("get", "/users/register-requests");
}

export async function approveRegister(userDataId) {
  return request("patch", "/users/approve-register", { data: { userDataId }});
}

export async function denyRegister(userDataId) {
  return request("patch", "/users/deny-register", { data: { userDataId }});
}

export async function makeAdmin(userDataId) {
  return request("patch", "/users/make-admin", { data: { userDataId }});
}

export async function removeAdmin(userDataId) {
  return request("patch", "/users/remove-admin", { data: { userDataId }});
}