<template>
  <div class="robotF">
    <div class="title">
      机器人一
    </div>
    <div class="content">
      <div class="left nr">
        <div class="item">
          <div class="camera">
          </div>
          <div class="control">
            <contro-btn></contro-btn>
          </div>
        </div>
        <div class="item">
          <div class="camera">
          </div>
          <div class="control">
            <contro-btn></contro-btn>
          </div>
        </div>
      </div>
      <div class="right nr">
        <rou-tine-inspection></rou-tine-inspection>
      </div>
    </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import cameraPanel from '_c/duno-m/cameraPanel'
import controBtn from '_c/duno-m/controBtn'
import rouTineInspection from '_c/duno-m/rouTineInspection'
import { mapState } from 'vuex'
export default {
  mixins: [mixinViewModule],
  name: 'RoleIndex',
  components: {
      cameraPanel,
      controBtn,
      rouTineInspection
  },
  computed:{
    ...mapState([
        'user'
    ]),

  },
  data () {
    const that = this
    return {

    }
  },
  watch: {

  },
  methods: {

  },
  created(){

  },
  mounted () {

  }
}
</script>
<style lang="scss">
.robotF{
  color: white;
  width: 100%;
  height: 100%;
  .title{
    font-size: 18px;
  }
  .content{
    display: flex;
    .left{
      width: 60%;
      &.nr{
        display: flex;
        flex-direction: column;
        .item{
          background: #132838;
          display: flex;
          &:first-child{
            margin-bottom: 15px;
          }
          .camera{
            height: 300px;
            flex: 1;
            border: 1px solid pink;
          }
          .control{
            position: relative;
            top: 8px;
          }
        }
      }
    }
    .right{
      width: 40%;
      margin-left: 15px;
      padding: 16px;
      background: #132838;
    }
  }
}
</style>
