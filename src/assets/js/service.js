import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL;

export default {

    async signIn(payload) {
        try {
            const ret = await axios.post('/signin', payload);
            axios.defaults.headers.common.Authorization = `bearer ${ret.data.token}`;
            return true;
        } catch (err) {
            return false;
        }
    },

    async getRegions() {
        return axios.get('/regions/');
    },
};
