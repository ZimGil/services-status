<template>
<v-card class="service-card">
  <v-card-title class="service-title">
    <v-icon :color="iconColor" x-large>{{ iconName }}</v-icon>
    <v-tooltip bottom :disabled="!service.title">
      <template v-slot:activator="{ on }">
        <span v-on="on">{{ service.title || service.name }}</span>
      </template>
      <span>{{ service.name}}</span>
    </v-tooltip>
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
  props: [ 'service' ],
  computed: {
    iconName() { return this.service.isActive ? 'check_circle_outline' : 'highlight_off'; },
    timeAgo() { return timeAgo(this.service.timestamp); },
    iconColor() {
      if (this.service.isDisabled) { return 'grey'; }
      return this.service.isActive ? 'green' : 'red'
    }
  }
};
</script>

<style lang="scss" scoped>
  .service-card {
    width: 480px;
    margin: 0 5px 15px;

    .service-title {
      margin: auto;
      display: flex;
      flex-direction: column;
    }
  }
</style>
