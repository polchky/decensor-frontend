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

    getRegions() {
        return axios.get('/regions/');
    },

    async getChannels(ids, country) {
        const res = await axios.get(`/channels/?id=${ids.join(',')}&country=${country}`);
        return res.data;
    },
};
