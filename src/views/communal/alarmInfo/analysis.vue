<template>
  <div class="analysis">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div class="dunoDrap">
      <div>重点监测区域</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            @on-select="onSelectAmmeter"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="ammeterData"
            :title="titleAmmeter"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectParts"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="partsData"
            :title="titleParts"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectPhase"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="phaseData"
            :title="titlePhase"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "analysis",
  data() {
    return {
      titleAmmeter: "",
      titleParts: "",
      titlePhase: "",
      ammeterData: [],
      partsData: [],
      phaseData: []
    };
  },
  methods: {
    onSelectAmmeter(item) {
      this.titleAmmeter = item["describeName"];
    },
    onSelectParts(item) {
      this.titleParts = item["describeName"];
    },
    onSelectPhase(item) {
      this.titlePhase = item["describeName"];
    }
  }
};
</script>

<style lang="scss">
</style>
