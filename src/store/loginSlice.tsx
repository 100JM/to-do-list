import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { modalAction } from "./modalSlice";

interface LoginState {
    isLogin: boolean;
    name: string;
    id: number;
    profileImage: string;
    isLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
};

interface handleLogin {
    name: string;
    id: number;
    profileImage: string;
};

interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
};

const initLoginState: LoginState = {
    isLogin: false,
    name: '',
    id: 0,
    profileImage: '',
    isLoading: 'idle',
    error: null,
};

export const fetchUserInfoThunk = createAsyncThunk<handleLogin, string>(
    'login/fetchUserInfoThunk',
    async (token: string, { rejectWithValue }) => {
        try {
            localStorage.setItem('kakao_access_token', token);
            window.Kakao.Auth.setAccessToken(token);

            const response = await window.Kakao.API.request({
                url: '/v2/user/me'
            });

            return {
                id: response.id,
                name: response.properties.nickname,
                profileImage: response.properties.profile_image || ''
            };
        } catch (error) {
            console.error('User profile fetch failed:', error);
            return rejectWithValue('Failed to fetch user info');
        }
    }
);

export const fetchAccessTokenThunk = createAsyncThunk(
    'login/fetchAccessTokenThunk',
    async (code: string, { dispatch }) => {
        try {
            // 1. Access Token 가져오기
            const tokenData = {
                grant_type: 'authorization_code',
                client_id: import.meta.env.VITE_KAKAO_MAP_API_KEY,
                redirect_uri: 'http://192.168.0.127:5173',
                code: code
            };

            const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                body: new URLSearchParams(tokenData as any).toString()
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to fetch access token');
            }

            const tokenResult: KakaoTokenResponse = await tokenResponse.json();
            const accessToken = tokenResult.access_token;

            // 2. 액세스 토큰 설정
            localStorage.setItem('kakao_access_token', accessToken);
            window.Kakao.Auth.setAccessToken(accessToken);

            // 3. 사용자 정보 가져오기
            const userResponse = await window.Kakao.API.request({
                url: '/v2/user/me'
            });

            // 4. 사용자 정보 반환
            return {
                id: userResponse.id,
                name: userResponse.properties.nickname,
                profileImage: userResponse.properties.profile_image || ''
            };
        } catch (error) {
            console.error('Error in Kakao login process:', error);
            throw error;
        }
    }
);

export const kakaoLogoutThunk = createAsyncThunk(
    'login/kakaoLogoutThunk',
    async (_, { rejectWithValue }) => {
        try {
            if (window.Kakao && window.Kakao.Auth) {
                await new Promise<void>((resolve, reject) => {
                    window.Kakao.Auth.logout((success: boolean) => {
                        if (success) {
                            console.log('Kakao auth logout successful');
                            resolve();
                        } else {
                            reject(new Error('Kakao auth logout failed'));
                        }
                    });
                });
            } else {
                console.log('Kakao SDK not loaded or not logged in');
            }
        } catch (error) {
            console.error('Kakao auth logout error:', error);
            return rejectWithValue(error);
        } finally {
            // 로그아웃 성공 여부와 관계없이 로컬 스토리지 정리
            localStorage.removeItem('kakao_access_token');
            localStorage.removeItem('kakao_access_token_expires_in');
            console.log('Local storage cleared');
        }
    }
);

const loginSlice = createSlice({
    name: 'login',
    initialState: initLoginState,
    reducers: {
        handleLogin: (state, action: PayloadAction<handleLogin>) => {
            state.isLogin = true;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profileImage = action.payload.profileImage;
            state.isLoading = 'succeeded';
        },
        handleLogout: (state) => {
            state.isLogin = false;
            state.id = 0;
            state.name = '';
            state.profileImage = '';
        },
        handleLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfoThunk.pending, (state) => {
                state.isLoading = 'pending';
                state.error = null;
            })
            .addCase(fetchUserInfoThunk.fulfilled, (state, action: PayloadAction<handleLogin>) => {
                state.isLoading = 'succeeded';
                state.isLogin = true;
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.profileImage = action.payload.profileImage;
                state.error = null;
            })
            .addCase(fetchUserInfoThunk.rejected, (state, action) => {
                state.isLoading = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAccessTokenThunk.pending, (state) => {
                state.isLoading = 'pending';
            })
            .addCase(fetchAccessTokenThunk.fulfilled, (state, action) => {
                state.isLoading = 'succeeded';
                state.isLogin = true;
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.profileImage = action.payload.profileImage;

                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete('state');
                urlParams.delete('code');
                window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
            })
            .addCase(fetchAccessTokenThunk.rejected, (state, action) => {
                state.isLoading = 'failed';
                state.error = action.error.message || '로그인 중 오류가 발생했습니다.';

                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete('state');
                urlParams.delete('code');
                window.history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
            })
            .addCase(kakaoLogoutThunk.pending, (state) => {
                state.isLoading = 'pending';
                state.error = null;
            })
            .addCase(kakaoLogoutThunk.fulfilled, (state) => {
                state.isLoading = 'succeeded';
                state.isLogin = false;
                state.id = 0;
                state.name = '';
                state.profileImage = '';
                state.error = null;
            })
            .addCase(kakaoLogoutThunk.rejected, (state, action) => {
                state.isLoading = 'failed';
                state.error = action.error.message || '로그아웃 중 오류가 발생했습니다.';
            });
    }
});

export const loginAction = loginSlice.actions;
export default loginSlice.reducer;