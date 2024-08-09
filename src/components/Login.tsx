import { useDispatch } from 'react-redux';
import { loginAction } from '../store/loginSlice';

import KakaoLogin from 'react-kakao-login';

import kakaoLoginImg from '../assets/kakao_login_large_narrow.png';
import { dateAction } from '../store/dateSlice';

const Login: React.FC = () => {
    const dispatch = useDispatch();

    const handleLogin = (res: any) => {
        const userInfo = {
            id: res.profile.id,
            name: res.profile.properties.nickname,
            profileImage: res.profile.properties.profile_image ? res.profile.properties.profile_image : ''
        };

        localStorage.setItem('kakao_access_token', res.response.access_token);
        const expiresIn = res.response.expires_in * 1000;
        const expiresTime = Date.now() + expiresIn;
        localStorage.setItem('kakao_access_token_expires_in', expiresTime.toString());

        dispatch(loginAction.handleLogin(userInfo));
        dispatch(dateAction.getMyTodoList(userInfo.id));
    };

    return (
        <div className="w-full h-1/2 flex justify-center items-center">
            <KakaoLogin
                token={import.meta.env.VITE_KAKAO_MAP_API_KEY}
                onSuccess={handleLogin}
                onFail={() => console.log('fail')}
                style={{
                    backgroundColor: "none",
                    width: "220px",
                    height: "60px",
                }}
            >
                <img src={kakaoLoginImg} alt='kakao_login' />
            </KakaoLogin>
        </div>
    );
};

export default Login;