<template>
  <v-app>
    <div id="container">
      <StatusCard v-for="service in sortedServices" :key="service.name" :service="service" />
    </div>
  </v-app>
</template>

<script>
import axios from 'axios';
import sortBy from 'lodash/sortBy';
import StatusCard from './components/StatusCard.vue';

export default {
  name: 'App',
  components: {StatusCard},
  data: () => ({
    services: [],
    isError: false,
    isLoading: true
  }),

  computed: {
    sortedServices() { return sortBy(this.services, ['isDisabled', 'isActive']); }
  },

  mounted() {
    axios.get('/api')
      .then(({data}) => this.services = data)
      .catch(() => this.isError = true)
      .finally(() => this.isLoading = false);
  }
};
</script>

<style lang="scss" scoped>
  #container {
    margin: auto;
    max-width: 75%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
  }
</style>
