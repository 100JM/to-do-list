import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loginAction } from '../store/loginSlice';

import KakaoLogin from 'react-kakao-login';

import kakaoLoginImg from '../assets/kakao_login_large_narrow.png';

const Login: React.FC = () => {
    const isLogin = useSelector((state: RootState) => state.login.isLogin);
    const useName = useSelector((state: RootState) => state.login.name);

    const dispatch = useDispatch();

    const handleLogin = (res: any) => {
        const userInfo = {
            id: res.profile.id,
            name: res.profile.properties.nickname,
            accessToken: res.response.access_token
        }

        dispatch(loginAction.handleLogin(userInfo));
    };

    const handleLogout = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.logout(() => {
                dispatch(loginAction.handleLogout());
            });
        }
    };

    return (
        <>
            {
                !isLogin &&
                <div className="w-full h-full flex justify-center items-center">
                    <KakaoLogin
                        token={import.meta.env.VITE_KAKAO_MAP_API_KEY}
                        onSuccess={handleLogin}
                        onFail={() => console.log('fail')}
                        style={{
                            backgroundColor: "none",
                            width: "220px",
                            height: "60px"
                        }}
                    >
                        <img src={kakaoLoginImg} alt='kakao_login' />
                    </KakaoLogin>
                </div>
            }
            {
                isLogin &&
                <div>
                    <div>{useName}</div>
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            }
        </>
    );
};

export default Login;