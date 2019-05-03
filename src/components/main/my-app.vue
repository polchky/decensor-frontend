<template>
    <VApp
        id="inspire"
        dark
    >
        <VToolbar
            dense
            fixed
            clipped-left
            app
        >
            <VSpacer />
            <VToolbarTitle>{{ title }}</VToolbarTitle>

            <VSpacer />
        </VToolbar>

        <VContent>
            <VExpansionPanel v-model="panel">
                <VExpansionPanelContent>
                    <div slot="header">
                        Get started
                    </div>
                    <VBtn
                        v-if="gapiInitialized"
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
            <VContainer
                grid-list-lg
            >
                <VLayout
                    row
                    wrap
                >
                    <transition name="fade">
                        <VProgressLinear
                            v-if="nChannels == 0 || gettingChannels"
                            color="success"
                            height="10"
                            :value=" 100 *
                                ((channels.length - Object.keys(channelsIndex).length)/ nChannels)
                                + 0.01"
                            :buffer-value="100 * (channels.length / nChannels) + 0.01"
                        />
                    </transition>
                    <VFlex xs12>
                        <VCard
                            min-width="500px"
                        >
                            <VLayout
                                row
                                wrap
                            >
                                <VFlex
                                    xs1
                                >
                                    <VCardText>
                                        <v-icon
                                            v-if="gettingChannels"
                                            small
                                        >
                                            fas fa-circle-notch fa-spin
                                        </v-icon>
                                    </VCardText>
                                </VFlex>
                                <VFlex
                                    xs4
                                >
                                    <VCardText @click="sortChannels('title')">
                                        Title
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VFlex>
                                <VFlex
                                    xs2
                                >
                                    <VCardText @click="sortChannels('relevance')">
                                        Relevance
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VFlex>
                                <VFlex
                                    xs2
                                >
                                    <VCardText @click="sortChannels('subscribers')">
                                        Subscribers
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VFlex>
                                <VFlex
                                    xs2
                                >
                                    <VCardText @click="sortChannels('videos')">
                                        Videos
                                        <v-icon
                                            v-if="channelsSort"
                                            small
                                        >
                                            fas fa-sort
                                        </v-icon>
                                    </VCardText>
                                </VFlex>
                            </VLayout>
                        </VCard>
                    </VFlex>
                    <Channel
                        v-for="channel in channels"
                        :key="channel.id"
                        :channel="channel"
                        @clicked="getPlaylistItemsPage"
                    />
                </VLayout>
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

export default {
    data: () => ({
        panel: 0,
        title: 'Youtube  Checker',
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
        pendingChannels: [],
        pendingVideos: [],
        channelsIndex: {},
        channelRelevance: 0,
        nChannels: 0,
        channelsSort: null,
        maxResults: 50,

        gapi: null,
        scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/youtube.readonly',
        ],
    }),
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

    },
};
</script>
