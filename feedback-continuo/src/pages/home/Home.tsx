import { api } from "../../api";
import { AxiosError } from "axios"
import { AuthContext } from "../../context/AuthContext";
import { IAuthContext } from "../../model/AuthDTO";
import { FeedbacksDTO } from "../../model/FeedbackDTO";
import { Container, TitlePrincipal } from "../../Global.styles";
import { useContext, useEffect, useState } from "react";
import { AiOutlineRightCircle, AiOutlineLeftCircle } from "react-icons/ai";

import {
  NavOptions,
  Pagination,
  PrincipalCard,
  TitlePage,
} from './Home.styles'

import Tab from "../../components/tabs/Tab";
import Tabs from '../../components/tabs'
import Card from "../../components/cards/Card";
import Error from "../../components/error/Error";
import Loading from "../../components/loading/Loading";
import handleError from '../../utils/Error'
import FirstLetterUppercase from "../../utils/FirstLetterUppercase";

const DEFAULT_IMAGE = 'data:image/png;base64,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'

const Home = () => {

  const {isLogged} = useContext(AuthContext) as IAuthContext
  const [gived, setGived] = useState<FeedbacksDTO[]>();
  const [received, setReceived] = useState<FeedbacksDTO[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentPageReceived, setCurrentPageReceveid] = useState<number>(0);
  const [currentPageGived, setCurrentPageGived] = useState<number>(0);
  const [totalPagesReceived, setTotalPagesReceived] = useState(0);
  const [totalPagesGived, setTotalPagesGived] = useState(0);
  const [btnDisabledReceived, setBtnDisabledReceived] = useState<boolean>(false);
  const [btnDisabledGived, setBtnDisabledGived] = useState<boolean>(false);
  const [btnDisabledReceivedPrevious, setBtnDisabledReceivedPrevious] = useState<boolean>(true);
  const [btnDisabledGivedPrevious, setBtnDisabledGivedPrevious] = useState<boolean>(true);
 
  useEffect(() => {
    isLogged();
    getGivedFeedback();    
  },[currentPageGived, currentPageReceived])

  const getGivedFeedback = async () => {
    try {
      const {data} = await api.get(`/feedback/gived?page=${currentPageGived}`)          
      setGived(data.content)  
      setTotalPagesGived(data.totalPages)
      if (data.totalPages <= 1){
        setBtnDisabledGived(true)        
        setBtnDisabledGivedPrevious(true)
      }
      getReceveidFeedback();
    } catch (error) {
      setLoading(false)
      setError(true)
      const errorData = error as AxiosError 
      handleError(errorData)
    }
  }

  const nextPageGived = () => {
    setCurrentPageGived(currentPageGived + 1);
    setBtnDisabledGivedPrevious(false)
    if (currentPageGived + 1 >= totalPagesGived-1) {
      setBtnDisabledGived(true);
    }        
  }

  const nextPageReceived = () => {
    setCurrentPageReceveid(currentPageReceived + 1);
    setBtnDisabledReceivedPrevious(false)
    if (currentPageReceived+1 >= totalPagesReceived-1) {
      setBtnDisabledReceived(true)      
    }
  }

  const previousPageGived = () => {
    setBtnDisabledGived(false);
    setCurrentPageGived(currentPageGived - 1);
    if (currentPageGived <= 1) {
      setBtnDisabledGivedPrevious(true);
    }      
  }

  const previousPageReceived = () => {
    setBtnDisabledReceived(false)     
    setCurrentPageReceveid(currentPageReceived - 1); 
    if (currentPageReceived <= 1) {
      setBtnDisabledReceivedPrevious(true)       
    }
  }

  const getReceveidFeedback = async () =>{
    try {
      const{data} = await api.get(`/feedback/receveid?page=${currentPageReceived}`)  
      setReceived(data.content)
      setTotalPagesReceived(data.totalPages)
      if (data.totalPages <= 1){
        setBtnDisabledReceived(true)
        setBtnDisabledReceivedPrevious(true)
      }
      setLoading(false)
    } catch (error) {
      const errorData = error as AxiosError 
      handleError(errorData)
    }
  }

  const formatTags = (tagList: string[]) => {
    let response = "";
    tagList.map((tag) => {
      response = response + "#" + tag
    }); 
    return response;
  }

  if (loading) { return (<Loading />) }
  if (error) { return(<Error />) }

  return(
    <Container>
      <PrincipalCard>
        <TitlePage>Feedbacks</TitlePage>
        <Tabs>
          <Tab title="Recebidos">   
            <>
              {received ? 
                received.length > 0 ? 
                  received.map ((feedback:FeedbacksDTO) => (              
                    <Card key={feedback.feedbackId} profileUserImage={feedback.profileUserImage ? `data:image/png;base64,${feedback.profileUserImage}` : DEFAULT_IMAGE} userName={FirstLetterUppercase(feedback.userName)} message={feedback.message} tags={formatTags(feedback.tags)} createdAt={feedback.createdAt}/>                
                  )) 
                : <TitlePrincipal>Nenhum feedback recebido!</TitlePrincipal> 
              : null}  
              <NavOptions>
              <Pagination disabled={btnDisabledReceivedPrevious} onClick={() => previousPageReceived()}><AiOutlineLeftCircle size={30}/></Pagination> 
              <Pagination disabled={btnDisabledReceived} onClick={() => nextPageReceived()}><AiOutlineRightCircle size={30}/></Pagination>
              </NavOptions>   
            </>   
          </Tab>
          <Tab title="Enviados">        
            <>
              {gived ? 
                gived.length > 0 ? 
                  gived.map ((feedback:FeedbacksDTO) => (                  
                    <Card key={feedback.feedbackId} profileUserImage={feedback.profileUserImage ? `data:image/png;base64,${feedback.profileUserImage}` : DEFAULT_IMAGE} userName={FirstLetterUppercase(feedback.userName)} message={feedback.message} tags={formatTags(feedback.tags)} createdAt={feedback.createdAt}/>          
                  ))
                : <TitlePrincipal>Nenhum feedback enviado!</TitlePrincipal>
              : null}
              <NavOptions>
                <Pagination disabled={btnDisabledGivedPrevious} onClick={() => previousPageGived()}><AiOutlineLeftCircle size={30}/></Pagination>
                <Pagination disabled={btnDisabledGived} onClick={() => nextPageGived()}><AiOutlineRightCircle size={30}/></Pagination>
              </NavOptions>
            </>
          </Tab>
        </Tabs>           
      </PrincipalCard>
    </Container>    
  )
}

export default Home;


