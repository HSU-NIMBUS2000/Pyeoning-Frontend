import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { doctorIdState, passwordState } from "../../../shared/components/state/LoginForDoctor";
import { useNavigate } from "react-router-dom";

function LoginButton({text, setErrorMessage}) {
    const doctorId=useRecoilValue(doctorIdState);
    const password=useRecoilValue(passwordState);
    const navigate=useNavigate();
  
    async function btnClickHandler(){  
        const requestData={
            doctorLicense: doctorId,
            doctorPassword: password,
        };

        try {
            const response = await fetch("http://15.164.174.64/api/doctor/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              });
        
              if (response.ok) {
                const responseData = await response.json();
                console.log("로그인 성공:", responseData);
                // 토큰을 세션에 저장
                sessionStorage.setItem("accessToken", responseData.data.accessToken);
                
                // 다른 화면으로 이동
                navigate("/GoTo");
              } else {
                  const errorData = await response.json();
                  console.error("로그인 실패:", response.status, errorData.message);
                  setErrorMessage(errorData.message);
              }
            } catch (error) {
              console.error("네트워크 오류:", error);
              alert("네트워크 오류입니다. 관리자에게 문의하세요");
            }

    }
  return <Button onClick={btnClickHandler}>{text}</Button>;
}

export default LoginButton;

const Button = styled.button`
  background-color: #6572d2;
  color: white;
  border: none;
  height: 70px;
  border-radius: 1em;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
`;
