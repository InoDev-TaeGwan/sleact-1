import React, {useCallback, useState} from 'react';

import { Link } from 'react-router-dom';
import axios from "axios";

import useInput from "@hooks/useInput";
import {Form, Header, Input, Label, Error, Success, Button, LinkContainer} from "@pages/SignUp/styles";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {Redirect} from "react-router";

const SignUp = () => {
    const { data, error, revalidate } = useSWR('/api/users', fetcher); // 세번째 자리(dedupingInterval)는 주기적 호출을 막는다.
    const [email,onChangeEmail] = useInput(''); // useInput 은 커스텀 hooks
    const [nickname,onChangeNickname] = useInput('');
    const [password,, setPassword] = useInput('');
    const [passwordCheck,, setPasswordCheck] = useInput('');
    // const [password,setPassword] = useState('');
    // const [passwordCheck,setPasswordCheck] = useState('');
    const [mismatchError, setMismatchError] = useState(false);
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const onChangePassword = useCallback((e)=> {
        setPassword(e.target.value)
        setMismatchError(e.target.value !== passwordCheck)
    },[passwordCheck])

    const onChangePasswordCheck = useCallback((e)=> {
        setPasswordCheck(e.target.value)
        setMismatchError(e.target.value !== password)
    },[password])

    const onSubmit = useCallback((e)=> { // useCallback 은 deps의 값이 하나라도 바뀔떄까지 이 함수를 기억해 두어라 라는 뜻, 하나라도 바뀌면 useCallback 의 함수가 다시 만들어진다
        e.preventDefault();
        if(!mismatchError && nickname) {
            console.log('서버로 회원가입하기');
            setSignUpError('');
            setSignUpSuccess(false);
            axios.post('/api/users',{email,nickname,password})
                .then((response)=> {
                    console.log(response);
                    setSignUpSuccess(true);
                })
                .catch((error)=> {
                    setSignUpError(error.response.data);
                })
                .finally(()=> {})
        }
    },[email, nickname, password, passwordCheck])

    if(data===undefined){
        return <div>로딩중</div>
    }

    if(data){
        return <Redirect to="/workspace/sleact/channel/일반" />
    }

    return (
        <div id="container">
            <Header>Sign Up</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type={"text"} id={"nickname"} name="nickname" value={nickname} onChange={onChangeNickname} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input type="password" id="password-check" name="password-check" value={passwordCheck} onChange={onChangePasswordCheck} />
                    </div>
                    {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요? &nbsp;
                <Link to="/login">로그인 하러가기</Link>
            </LinkContainer>
        </div>
    );
};

export default SignUp;
