import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import styled, { StyleSheetManager } from "styled-components";
import { RecoilRoot } from "recoil";
import PatientInfoForDoctor from "./PatientInfoForDoctor";
import ShowPatientChatForDoctor from "./ShowPatientChatForDoctor"; // 컴포넌트 가져오기
import PatientRegisterForDoctor from "./PatientRegisterForDoctor";
import Table from "../entities/PatientInfoForDoctor/ui/Table";
import NewTable from "../entities/PatientInfoForDoctor/ui/NewTable";
import Title from "../entities/PatientInfoForDoctor/ui/TItle";
import Summary from "../entities/PatientInfoForDoctor/ui/Summary";
import Chart from "../entities/PatientInfoForDoctor/ui/Chart";
import axios from "axios";
import { diseaseState, promptState } from "../shared/components/state/PatientInfoForDoctor";
import { useRecoilState } from "recoil";

function PatientListForDoctor() {

  const [disease, setDisease] = useRecoilState(diseaseState);
  const [prompt, setPrompt] = useRecoilState(promptState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const patientId = localStorage.getItem('patientId');

        const response = await axios.get(`/api/patient/${patientId}/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('상세정보 데이터:', response.data.data);
        setDisease(response.data.data.pyeoningDisease);
        setPrompt(response.data.data.pyeoningPrompt);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])


  useEffect(() => {

    

    const iframe = document.querySelector("iframe");

    iframe.onload = () => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      // summary에 PatientInfoForDoctor 렌더링
      const summaryElement = iframeDocument.getElementById("summary");
      if (summaryElement) {
        const root = ReactDOM.createRoot(summaryElement);

        root.render(
          <StyleSheetManager target={iframeDocument.head}>
            <RecoilRoot>
              <Chart />
              <Summary />
            </RecoilRoot>
          </StyleSheetManager>
        );
      }


      const chatElement = iframeDocument.getElementById("chat");
      const patientId=localStorage.getItem('patientId');
      if (chatElement) {
        const chatRoot = ReactDOM.createRoot(chatElement);

        chatRoot.render(
          <StyleSheetManager target={iframeDocument.head}>
            <RecoilRoot>
              <ShowPatientChatForDoctor patientId={patientId} />
            </RecoilRoot>
          </StyleSheetManager>
        );
      }

      const addElement = iframeDocument.getElementById("register");
      if (addElement) {
        const addRoot = ReactDOM.createRoot(addElement);

        addRoot.render(
          <StyleSheetManager target={iframeDocument.head}>
            <RecoilRoot>
              <PatientRegisterForDoctor />
            </RecoilRoot>
          </StyleSheetManager>
        );
      }

      const infoElement = iframeDocument.getElementById("info");
      if (infoElement) {
        const infoRoot = ReactDOM.createRoot(infoElement);

        infoRoot.render(
          <StyleSheetManager target={iframeDocument.head}>
            <RecoilRoot>
              <NewTable />
            </RecoilRoot>
          </StyleSheetManager>
        );
      }

      const infopageElement = iframeDocument.getElementById("infopage");
      if (infopageElement) {
        const infopageRoot = ReactDOM.createRoot(infopageElement);

        infopageRoot.render(
          <StyleSheetManager target={iframeDocument.head}>
            <RecoilRoot>
              <PatientInfoForDoctor />
            </RecoilRoot>
          </StyleSheetManager>
        );
      }


    };
  }, []);

  return (
    <MainLayout>
      <iframe src="/template/home.html" title="Embedded Content" />
    </MainLayout>
  );
}

export default PatientListForDoctor;

const MainLayout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;