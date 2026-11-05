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
    {{ service.status }}
  </v-card-text>
</v-card>
</template>

<script>
export default {
  name: 'StatusCard',
  props: [ 'service' ],
  computed: {
    iconName() { return this.service.isActive ? 'check_circle_outline' : 'highlight_off'; },
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
