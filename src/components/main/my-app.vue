<template>
    <VApp
        id="inspire"
        dark
    >
        <VAppBar
            clipped-left
            dense
            fixed
            app
        >
            <VSpacer />
            <VToolbarTitle>{{ title }}</VToolbarTitle>

            <VSpacer />
        </VAppBar>

        <VContent>
            <VRow>
                <VCol cols="12">
                    <VFileInput
                        label="File Input"
                        @change="loadSubscriptionsFile"
                    />
                </VCol>
            </VRow>
            <vExpansionPanels>
                <VExpansionPanel v-model="panel">
                    <VExpansionPanelContent>
                        <VBtn
                            v-if="true"
                            class="mt-5"
                            dark
                            @click="signIn"
                        >
                            <span>
                                relol
                                {{ panel }}
                            </span>
                        </VBtn>
                        <VBtn
                            v-if="gapiReady"
                            class="mt-5"
                            dark
                            @click="getSubscriptionsPage()"
                        >
                            <span>
                                relol
                                {{ panel }}
                            </span>
                        </VBtn>
                    </VExpansionPanelContent>
                </VExpansionPanel>
            </vExpansionPanels>
            <VContainer>
                <VRow>
                    <VCol cols="12">
                        <VCard
                            min-width="500px"
                        >
                            <VRow>
                                <VCol cols="1">
                                    <VCardText>
                                        <v-icon
                                            v-if="gettingChannels"
                                            small
                                        >
                                            fas fa-circle-notch fa-spin
                                        </v-icon>
                                    </VCardText>
                                </VCol>
                                <VCol cols="4">
                                    <VCardText @click="sortChannels('title')">
                                        Title
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VCol>
                                <VCol cols="2">
                                    <VCardText>
                                        Relevance
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VCol>
                                <VCol cols="2">
                                    <VCardText @click="sortChannels('subs')">
                                        Subscribers
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VCol>
                                <VCol cols="2">
                                    <VCardText @click="sortChannels('videos')">
                                        Videos
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VCol>
                            </VRow>
                        </VCard>
                    </VCol>
                    <Channel
                        v-for="channel in channels"
                        :key="channel.id"
                        :channel="channel"
                    />
                </VRow>
            </VContainer>
            <VSnackbar
                v-model="showAlert"
                :color="alertColor"
                :timeout="alertTimeout"
                :top="true"
            >
                {{ alertMessage }}
                <VBtn
                    flat
                    @click="showAlert = false"
                >
                    {{ $t('general.close') }}
                </VBtn>
            </VSnackbar>
            <!--
            <MySimpleModal
                :dialog="simpleDialog"
                :right="simpleRightButton"
                :title="simpleTitle"
                @rightClick="simpleDialog=false"
            >
                <p slot="content">
                    {{ simpleContent }}
                </p>
            </MySimpleModal>
            -->
        </VContent>

        <VFooter
            app
        >
            <span
                class="white--text"
            >
                sdsd
            </span>
        </VFooter>
    </VApp>
</template>

<style>
    @import "https://use.fontawesome.com/releases/v5.1.0/css/all.css";
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<script>

import service from '@/assets/js/service';
import Vue from 'vue';
import _ from 'lodash';

export default {
    data: () => ({
        panel: 0,
        title: 'Youtube Decensor',
        drawer: null,
        simpleDialog: false,
        simpleRightButton: '',
        simpleTitle: '',
        simpleContent: '',
        showAlert: false,
        alertMessage: '',
        alertColor: '',
        alertIcon: '',
        alertTimeout: 6000,
        gapiInitialized: false,
        gapiReady: false,
        gettingChannels: false,
        channels: [],
        channelsSort: {
            criteria: null,
            order: 'desc',
        },
        pendingChannels: [],
        pendingVideos: [],
        channelsIndex: {},
        channelRelevance: 0,
        nChannels: 0,
        maxResults: 50,

        gapi: null,
        scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/youtube.readonly',
        ],
    }),
    computed: {
        orderedChannels() {
            return _.orderBy(this.channels, 'subs');
        },
    },
    watch: {
    },
    async mounted() {
        // Load and initialize google api client
        const gapiScript = document.createElement('script');
        gapiScript.async = true;
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = () => this.gapiInit();
        document.head.appendChild(gapiScript);
    },
    methods: {

        async signIn() {
            try {
                if (!this.gapiIsSignedIn()) {
                    if (!await this.gapiSignIn()) return false;
                }
                const auth = this.gapi.auth2.getAuthInstance();
                await service.signIn(
                    { token: auth.currentUser.get().getAuthResponse().id_token }
                );
                const ret = await service.getRegions();
                console.log(ret);
                return true;
            } catch (err) {
                return false;
            }
        },
        isSignedIn() {

        },
        async gapiSignIn() {
            try {
                const auth = this.gapi.auth2.getAuthInstance();
                await auth.signIn();
                if (this.gapiIsSignedIn()) {
                    auth.currentUser.listen(this.gapiRefresh);
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        },
        gapiIsSignedIn() {
            // Check that the user is signed in and granted the right permissions
            try {
                const auth = this.gapi.auth2.getAuthInstance();
                if (!auth.isSignedIn.get()) return false;
                const { scope } = auth.currentUser.get().getAuthResponse();
                for (let i = 0; i < this.scopes.length; i += 1) {
                    if (scope.indexOf(this.scopes[i]) < 0) return false;
                }
                return true;
            } catch {
                return false;
            }
        },
        gapiInit() {
            setTimeout(async () => {
                this.gapi = window.gapi;
                this.gapi.load('client', async () => {
                    await this.gapi.client.init({
                        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
                        scope: this.scopes.join(' '),
                    });
                    this.gapiInitialized = true;
                });
            }, 1000);
        },
        async gapiRefresh() {
            const auth = this.gapi.auth2.getAuthInstance();
            console.log(`Refresh called: ${auth.currentUser.get().getAuthResponse()} (${new Date()})`);
            await auth.currentUser.get().reloadAuthResponse();
        },
        async gapiAuth() {
            const auth = this.gapi.auth2.getAuthInstance();
            if (!auth.isSignedIn.get()) await auth.signIn();
            if (auth.isSignedIn.get()) {
                console.log(auth.currentUser.get().getAuthResponse());
                this.gapi.client.load('youtube', 'v3', async () => {
                    this.gapiReady = true;
                    console.log(await this.gapi.client.youtube.subscriptions.list({
                        mine: true,
                        part: 'contentDetails,snippet',
                    }));
                });
            }
        },

        SimpleModal(simpleRightButton, simpleTitle, simpleContent) {
            this.simpleContent = simpleContent;
            this.simpleTitle = simpleTitle;
            this.simpleRightButton = simpleRightButton;
            this.simpleDialog = true;
        },
        showAlertBox(mode, message) {
            this.alertColor = mode;
            this.alertMessage = message;
            this.showAlert = true;
        },

        loadSubscriptionsFile(file) {
            const reader = new FileReader();
            reader.onload = (res) => this.parseChannels(res.target.result);
            reader.readAsText(file);
        },

        parseChannels(file) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(file, 'text/xml');
            const collection = doc.documentElement.firstElementChild.firstElementChild.children;
            const channels = Array.from(collection);
            for (let i = 0; i < channels.length; i += 1) {
                Vue.set(
                    this.channels,
                    channels[i].getAttribute('xmlUrl').split('=')[1],
                    { title: channels[i].getAttribute('title') }
                );
            }
            this.fetchChannels();
        },

        async fetchChannels() {
            const promises = [];
            const ids = Object.keys(this.channels);
            for (let i = 0; i < ids.length; i += this.maxResults) {
                promises.push(service.getChannels(ids.slice(i, i + this.maxResults), 'CH'));
            }
            const channels = [];
            const data = await Promise.all(promises);
            for (let i = 0; i < data.length; i += 1) {
                channels.push(...data[i]);
            }
            for (let i = 0; i < channels.length; i += 1) {
                channels[i].thumbnail = `https://yt3.ggpht.com/${channels[i].thumbnail}`;
            }
            this.sortChannels('subs', channels);
        },

        sortChannels(criteria, channels = this.channels) {
            if (this.channelsSort.criteria === criteria) {
                this.channelsSort.order = this.channelsSort.order === 'asc' ? 'desc' : 'asc';
            } else {
                this.channelsSort = {
                    criteria,
                    order: criteria === 'title' ? 'asc' : 'desc',
                };
            }
            this.channels = _.orderBy(
                channels,
                this.channelsSort.criteria,
                this.channelsSort.order
            );
        },

    },
};
</script>
