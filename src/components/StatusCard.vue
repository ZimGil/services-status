<template>
<v-card class="service-card">
  <v-card-title class="service-title">
    <v-icon :color="iconColor" x-large>{{ iconName }}</v-icon>
    {{ service.name }}
  </v-card-title>
    <v-card-text>
    {{ timeAgo }}
  </v-card-text>
</v-card>
</template>

<script>
import timeAgo from 'node-time-ago';

export default {
  name: 'StatusCard',
  props: ['service'],
  computed: {
    iconColor() {return this.service.isActive ? 'green' : 'red'},
    iconName() {return this.service.isActive ? 'check_circle_outline' : 'highlight_off'},
    timeAgo() {return timeAgo(this.service.timestamp);}
  }
};
</script>

<style lang="scss" scoped>
  .service-card {
    width: 480px;
    margin-bottom: 15px;

    .service-title {
      margin: auto;
      display: flex;
      flex-direction: column;
    }
  }
</style>
