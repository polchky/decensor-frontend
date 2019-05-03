<template>
    <VFlex
        xs12
    >
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
                    <VImg
                        :src="channel.thumbnail"
                        height="40px"
                        contain
                    />
                </VFlex>
                <VFlex
                    xs4
                >
                    <VCardText>
                        <div
                            class=""
                            @click="test2(channel)"
                        >
                            {{ channel.title }}
                        </div>
                    </VCardText>
                </VFlex>
                <VFlex
                    xs2
                >
                    <VCardText>
                        <div
                            class=""
                        >
                            {{ channel.relevance }}
                        </div>
                    </VCardText>
                </VFlex>
                <VFlex
                    xs2
                >
                    <VCardText>
                        <div
                            v-if="channel.statistics"
                            class=""
                        >
                            {{ utils.count(channel.statistics.subscriberCount) }}
                        </div>
                    </VCardText>
                </VFlex>
                <VFlex
                    xs2
                >
                    <VCardText>
                        <div
                            v-if="channel.statistics"
                            class=""
                        >
                            {{ utils.count(channel.statistics.videoCount) }}
                        </div>
                    </VCardText>
                </VFlex>
                <VFlex
                    xs1
                >
                    <VCardText>
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
                    </VCardText>
                </VFlex>
            </VLayout>
        </VCard>
    </VFlex>
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
