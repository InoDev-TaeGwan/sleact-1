import React, { useCallback, useState } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';

import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import {Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import {Redirect} from "react-router";

const LogIn = () => {
    const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher); // 세번째 자리(dedupingInterval)는 주기적 호출을 막는다.
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setLogInError(false);
            axios
                .post(
                    '/api/users/login',
                    { email, password },
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    // revalidate(); // revalidate()는 SWR을 내가 원할때만 호출하도록 커스텀
                    mutate(response.data,false) // OPTIMISTIC UI 인스타그램 좋아요 같은 기능, 내가 보낸 요청이 성공할거라 낙관을 하고 하트를 누르면 하트에 불이 들어오고 그 다음 종료(shouldRevalidate 는 꼭 false)
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.statusCode === 401);
                });
        },
        [email, password],
    );

    if(data===undefined){
       return <div>로딩중</div>
    }

    if(data){
        return <Redirect to="/workspace/sleact/channel/일반" />
    }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                </Label>
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요?&nbsp;
                <Link to="/signup">회원가입 하러가기</Link>
            </LinkContainer>
        </div>
    );
};

export default LogIn;
