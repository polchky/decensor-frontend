<template>
    <VCol cols="12">
        <VCard
            min-width="500px"
        >
            <VRow>
                <VCol cols="1">
                    <VImg
                        :src="channel.thumbnail"
                        height="40px"
                        contain
                    />
                </VCol>
                <VCol cols="4">
                    <div
                        class=""
                    >
                        {{ channel.title }}
                    </div>
                </VCol>
                <VCol cols="2">
                    <VCardText>
                        <div
                            class=""
                        >
                            {{ channel.relevance }}
                        </div>
                    </VCardText>
                </VCol>
                <VCol cols="2">
                    <div
                        class=""
                    >
                        {{ utils.count(channel.subs) }}
                    </div>
                </VCol>
                <VCol cols="2">
                    <div
                        class=""
                    >
                        {{ utils.count(channel.videos) }}
                    </div>
                </VCol>
                <VCol cols="1">
                    <v-progress-circular
                        v-if="channel.gettingVideos"
                        :value="channel.nVideos
                            ? 100 * (channel.nCompletedVideos / channel.nVideos)
                            : 0
                        "
                        color="blue-grey"
                        size="20"
                    />
                    <v-icon
                        v-else-if="channel.statistics &&
                            !channel.gettingVideos &&
                            !channel.checkedVideos
                        "
                        small
                        @click="checkChannel"
                    >
                        fas fa-arrow-right
                    </v-icon>
                    <v-icon
                        v-else-if="channel.checkedVideos &&
                            Object.keys(channel.restrictedVideos).length === 0
                        "
                        small
                        color="green"
                    >
                        fas fa-check
                    </v-icon>
                    <v-icon
                        v-else-if="channel.checkedVideos &&
                            Object.keys(channel.restrictedVideos).length > 0
                        "
                        small
                        color="red"
                    >
                        fas fa-exclamation
                    </v-icon>
                </VCol>
            </VRow>
        </VCard>
    </VCol>
</template>

<script>

import utils from '@/assets/js/utils';

export default {
    props: {
        channel: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        utils,
    }),
    watch: {
    },
    mounted() {
    },
    methods: {
        checkChannel() {
            this.$emit('clicked', this.channel);
        },
    },

};
</script>
