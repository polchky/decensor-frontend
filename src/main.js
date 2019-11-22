import Vue from 'vue';
import i18n from '@/translations';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

import 'vuetify/dist/vuetify.min.css';

/* eslint-disable no-multi-spaces */
import myApp                    from '@/components/main/my-app';
import channel                  from '@/components/channel';
/* eslint-enable no-multi-spaces */

Vue.config.productionTip = false;


// register reusable components for all vue instances
Vue.component('my-app', myApp);
Vue.component('Channel', channel);


Vue.use(Vuetify);

const vuetifyOptions = {
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.red.base,
                secondary: colors.purple.base,
                accent: colors.teal.base,
                error: colors.brown.base,
                warning: colors.amber.base,
                info: colors.blue.base,
                success: colors.green.base,
            },
        },
    },
};

new Vue({
    render: (h) => h(myApp),
    i18n,
    vuetify: new Vuetify(vuetifyOptions),
}).$mount('#app');
