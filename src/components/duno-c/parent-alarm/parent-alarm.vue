<template>
  <div>
    <home />
    <!-- <router-view name="alarm"></router-view> -->
  </div>
</template>
<script>
import home from "@/views/communal/abnormalInfo";
export default {
  name: "ParentAlarm",
  components: {
    home
  }
};
</script>