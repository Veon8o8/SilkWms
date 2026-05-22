// src/utils/HttpUtil.ts

import axios from 'axios';
import { LOCAL_STORAGE } from '../config/keys';
import { ErrResponse, SucResponse } from '../config/type';

class HttpUtil {

    async post(api: string, params: any): Promise<ErrResponse | SucResponse | undefined> {
        const DEBUG = true
        const TAG = `HttpUtil.post() - `

        const token = localStorage.getItem(LOCAL_STORAGE.TOKEN)
        let config = {}
        if (token) {
            config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        }

        try {
            let response = await axios.post(api, params, config)
            DEBUG && console.log(TAG, `response.data:`, response.data)

            if (400 === response.data.code) {
                return { code: response.data.code, errMsg: response.data.message, errCode: response.data.errCode }
            }
            if (200 === response.data.code) {
                return { code: response.data.code, data: response.data.data, message: response.data.message }
            }
        } catch (error) {
            return { code: 400, errMsg: `服务器找不到这个接口: ${api}`, errCode: 404 }
        }
    }

    gotoLogin() {
        // console.log(`本来该跳转到登录界面`)
        window.location.href = 'http://localhost:5173/mgmt/login';
    }

    tryGotoLogin(r: ErrResponse) {
        if (r.errCode == 10051) {// Token过期，跳转登录界面
            // 跳转到登录页面
            this.gotoLogin();
        }
    }

}

export const httpUtil = new HttpUtil