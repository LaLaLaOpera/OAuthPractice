import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class OAuthService {
  async authAccessToken(type: string, code: string) {
    const body = {
      grant_type: 'authorization_code',
      client_id:
        type === 'naver'
          ? process.env.NAVER_CLIENT_ID
          : type === 'kakao'
          ? process.env.KAKAO_CLIENT_ID
          : process.env.GOOGLE_CLIENT_ID,
      client_secret:
        type === 'naver'
          ? process.env.NAVER_CLIENT_SECRET
          : type === 'kakao'
          ? process.env.KAKAO_CLIENT_SECRET
          : process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: 'http://localhost:3000/account/signup/' + type,
    };
    const uri =
      type === 'naver'
        ? process.env.NAVER_TOKEN_ISSUE
        : type === 'kakao'
        ? process.env.KAKAO_TOKEN_ISSUE
        : process.env.GOOGLE_TOKEN_ISSUE;
    let info;
    try {
      info = await axios.post(uri, body, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err) {
      console.log(err);
    }
    return info?.data?.access_token;
  }
  async requestUserData(type: string, access_token: string) {
    console.log(type, access_token);
    const uri =
      type === 'naver'
        ? process.env.NAVER_INFO
        : type === 'kakao'
        ? process.env.KAKAO_INFO
        : process.env.GOOGLE_INFO;
    const { data } = await axios.get(uri, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
  }
}
